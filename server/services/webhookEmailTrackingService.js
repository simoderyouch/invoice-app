const crypto = require('crypto');
const Invoice = require('../models/invoiceModel');

// Generate unique payment token
const generatePaymentToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate unique tracking ID
const generateTrackingId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Create email tracking webhook
const createEmailTrackingWebhook = (invoiceId, userId) => {
  const trackingId = generateTrackingId();
  const webhookUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/webhook/email-opened/${trackingId}`;
  
  return {
    trackingId,
    webhookUrl,
    trackingData: {
      invoiceId,
      userId,
      timestamp: new Date()
    }
  };
};

// Record email open via webhook
const recordEmailOpenWebhook = async (trackingId) => {
  try {
    console.log(`Webhook email tracking for tracking ID: ${trackingId}`);
    
    const Invoice = require('../models/invoiceModel');
    
    // Find invoice by tracking ID
    const invoice = await Invoice.findOne({
      'emailTracking.trackingId': trackingId
    });
    
    if (!invoice) {
      console.log(`No invoice found for tracking ID: ${trackingId}`);
      return false;
    }
    
    // Update email tracking
    const updateData = {
      emailOpened: true,
      emailOpenedAt: new Date(),
      $inc: { emailOpenedCount: 1 },
      'emailTracking.openedAt': new Date(),
      'emailTracking.lastOpenedAt': new Date()
    };
    
    const result = await Invoice.findOneAndUpdate(
      { 'emailTracking.trackingId': trackingId },
      updateData,
      { new: true }
    );
    
    if (result) {
      console.log(`Email opened tracked via webhook for invoice: ${invoice.id}`);
      return true;
    } else {
      console.log(`Failed to update invoice for tracking ID: ${trackingId}`);
      return false;
    }
  } catch (error) {
    console.error('Error recording email open via webhook:', error);
    return false;
  }
};

// Create payment token for invoice
const createPaymentToken = async (invoiceId) => {
  try {
    const Invoice = require('../models/invoiceModel');
    const paymentToken = generatePaymentToken();
    
    console.log(`Creating payment token for invoice: ${invoiceId}`);
    console.log(`Generated token: ${paymentToken}`);
    
    const result = await Invoice.findOneAndUpdate(
      { id: invoiceId },
      { 
        'paymentProof.paymentToken': paymentToken,
        'paymentProof.createdAt': new Date()
      },
      { new: true }
    );
    
    if (result) {
      console.log(`Payment token created successfully for invoice: ${invoiceId}`);
      return paymentToken;
    } else {
      throw new Error(`Failed to update invoice ${invoiceId} with payment token`);
    }
  } catch (error) {
    console.error('Error creating payment token:', error);
    throw error;
  }
};

// Get payment URL
const getPaymentUrl = (paymentToken) => {
  return `${process.env.BASE_URL || 'http://localhost:3000'}/pay/${paymentToken}`;
};

// Get status check URL
const getStatusUrl = (paymentToken) => {
  return `${process.env.BASE_URL || 'http://localhost:3000'}/status/${paymentToken}`;
};

module.exports = {
  generatePaymentToken,
  generateTrackingId,
  createEmailTrackingWebhook,
  recordEmailOpenWebhook,
  createPaymentToken,
  getPaymentUrl,
  getStatusUrl
};
