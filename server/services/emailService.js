const nodemailer = require('nodemailer');
const path = require('path');
const { createEmailTrackingWebhook, createPaymentToken, getPaymentUrl } = require('./webhookEmailTrackingService');

// Create transporter for email sending
const createTransporter = () => {
  console.log('Creating nodemailer transporter...');
  console.log('Email user:', process.env.EMAIL_USER);
  console.log('Email password set:', !!process.env.EMAIL_PASSWORD);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  console.log('Nodemailer transporter created successfully');
  return transporter;
};

// Email template for invoice
const createEmailTemplate = (invoice, user) => {
  const itemsList = invoice.ItemList.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.total.toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.id}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 800px; margin: 0 auto; background: #fff; }
        .header { background: #7c5dfa; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0 0; font-size: 1.2em; }
        .content { padding: 40px; }
        .invoice-details { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .address-section { display: flex; justify-content: space-between; margin: 30px 0; gap: 40px; }
        .address-box { flex: 1; }
        .address-box h3 { color: #7c5dfa; margin-bottom: 15px; font-size: 1.1em; }
        .address-box p { margin: 5px 0; }
        .invoice-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .invoice-info p { margin: 10px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; background: white; border-radius: 8px; overflow: hidden; }
        .items-table th { background: #7c5dfa; color: white; padding: 15px; text-align: left; font-weight: 600; }
        .items-table td { padding: 15px; border-bottom: 1px solid #eee; }
        .items-table tr:last-child td { border-bottom: none; }
        .total-section { text-align: right; font-size: 1.3em; font-weight: bold; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; font-weight: bold; text-transform: uppercase; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-paid { background: #d4edda; color: #155724; }
        .status-draft { background: #e2e3e5; color: #383d41; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>INVOICE</h1>
          <p>Invoice #${invoice.id}</p>
        </div>
        
        <div class="content">
          <div class="invoice-details">
            <div class="address-section">
              <div class="address-box">
                <h3>From:</h3>
                <p><strong>${user.username}</strong></p>
                <p>${invoice.senderAddress.Address}</p>
                <p>${invoice.senderAddress.City}, ${invoice.senderAddress.PostCode}</p>
                <p>${invoice.senderAddress.Country}</p>
              </div>
              <div class="address-box">
                <h3>To:</h3>
                <p><strong>${invoice.clientName}</strong></p>
                <p>${invoice.clientAddress.Address}</p>
                <p>${invoice.clientAddress.City}, ${invoice.clientAddress.PostCode}</p>
                <p>${invoice.clientAddress.Country}</p>
              </div>
            </div>
            
            <div class="invoice-info">
              <p><strong>Invoice Date:</strong> ${invoice.createAt}</p>
              <p><strong>Payment Due:</strong> ${invoice.paymentDue}</p>
              <p><strong>Description:</strong> ${invoice.description}</p>
              <p><strong>Status:</strong> <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total-section">
              <p>Total Amount: $${invoice.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>This invoice was generated by Invoice App</p>
            <p>If you have any questions, please contact us.</p>
            <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <h4 style="color: #7c5dfa; margin-bottom: 10px;">Payment Instructions</h4>
              <p style="margin-bottom: 15px; color: #666;">After making your payment, please upload your payment proof:</p>
              <a href="${getPaymentUrl(invoice.paymentProof?.paymentToken || '')}" 
                 style="display: inline-block; background: #7c5dfa; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Upload Payment Proof
              </a>
              <p style="margin-top: 10px; font-size: 12px; color: #888;">Click the button above to upload your payment receipt or screenshot</p>
              <p style="margin-top: 10px; font-size: 12px; color: #888;">You can also check your payment status anytime using the link above</p>
              <p style="margin-top: 10px; font-size: 12px; color: #888;">Payment Token: ${invoice.paymentProof?.paymentToken || 'NOT_FOUND'}</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send invoice email
const sendInvoiceEmail = async (invoice, user, recipientEmail, pdfPath) => {
  try {
    console.log('Creating email transporter...');
    const transporter = createTransporter();
    console.log('Email transporter created successfully');
    
    // Fetch the latest invoice data to get the payment token
    const Invoice = require('../models/invoiceModel');
    const latestInvoice = await Invoice.findOne({ id: invoice.id });
    
    let emailTemplate = createEmailTemplate(latestInvoice, user);
    
    // Add webhook tracking to email
    const trackingData = createEmailTrackingWebhook(invoice.id, invoice.user_id);
    const trackingLink = `<a href="${trackingData.webhookUrl}" style="display:none;">Email Tracking</a>`;
    emailTemplate = emailTemplate.replace('</body>', `${trackingLink}\n</body>`);
    console.log('Email template created with webhook tracking');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Invoice #${invoice.id} from ${user.username}`,
      html: emailTemplate,
      attachments: [
        {
          filename: `Invoice-${invoice.id}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasAttachment: !!mailOptions.attachments.length
    });

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    // Return with tracking data
    return { 
      success: true, 
      messageId: result.messageId, 
      emailTracking: {
        trackingId: trackingData.trackingId,
        sentAt: new Date(),
        recipientEmail: recipientEmail,
        messageId: result.messageId,
        status: 'sent'
      }
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send invoice to client with tracking
const sendInvoiceToClient = async (invoiceId, recipientEmail) => {
  try {
    const Invoice = require('../models/invoiceModel');
    const User = require('../models/userModel');
    const { generateInvoicePDF } = require('./pdfService');
    
    // Get invoice and user data
    const invoice = await Invoice.findOne({ id: invoiceId });
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const user = await User.findById(invoice.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate PDF
    const pdfPath = await generateInvoicePDF(invoice, user);
    
    // Send email
    const result = await sendInvoiceEmail(invoice, user, recipientEmail, pdfPath);
    
    // Update invoice with email tracking
    const emailTracking = {
      trackingId: result.emailTracking.trackingId,
      sentAt: new Date(),
      recipientEmail: recipientEmail,
      messageId: result.messageId,
      status: 'sent'
    };
    
    // Update invoice status and add email tracking
    const updateData = {
      status: invoice.status === 'Draft' ? 'Pending' : invoice.status,
      emailTracking: emailTracking,
      lastEmailSent: new Date()
    };
    
    await Invoice.findOneAndUpdate(
      { id: invoiceId },
      updateData,
      { new: true }
    );
    
    return result;
  } catch (error) {
    console.error('Error in sendInvoiceToClient:', error);
    throw error;
  }
};

// Resend invoice email
const resendInvoiceEmail = async (invoiceId, recipientEmail) => {
  try {
    const Invoice = require('../models/invoiceModel');
    const User = require('../models/userModel');
    const { generateInvoicePDF } = require('./pdfService');
    
    const invoice = await Invoice.findOne({ id: invoiceId });
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const user = await User.findById(invoice.user_id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate new PDF
    const pdfPath = await generateInvoicePDF(invoice, user);
    
    // Send email
    const result = await sendInvoiceEmail(invoice, user, recipientEmail, pdfPath);
    
    // Update email tracking
    const emailTracking = {
      trackingId: result.emailTracking.trackingId,
      sentAt: new Date(),
      recipientEmail: recipientEmail,
      messageId: result.messageId,
      status: 'resent'
    };
    
    // Add to email history
    const updateData = {
      emailTracking: emailTracking,
      lastEmailSent: new Date(),
      emailHistory: invoice.emailHistory ? [...invoice.emailHistory, emailTracking] : [emailTracking]
    };
    
    await Invoice.findOneAndUpdate(
      { id: invoiceId },
      updateData,
      { new: true }
    );
    
    return result;
  } catch (error) {
    console.error('Error in resendInvoiceEmail:', error);
    throw error;
  }
};

module.exports = {
  sendInvoiceEmail,
  sendInvoiceToClient,
  resendInvoiceEmail,
  createEmailTemplate
};
