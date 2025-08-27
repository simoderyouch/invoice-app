const asyncHandler = require("express-async-handler")
const Invoice = require("../models/invoiceModel")
const { sendInvoiceToClient, resendInvoiceEmail } = require("../services/emailService")
const { generateInvoicePDFBuffer } = require("../services/pdfService")
const { createPaymentToken } = require("../services/webhookEmailTrackingService")
const User = require("../models/userModel")

const createInvoice = asyncHandler(async (req, res) => {
    const invoiceData = req.body;
    console.log(invoiceData)
    try {
      invoiceData.user_id = req.user.id; 
      const invoice = await Invoice.create(invoiceData);
      
      // Create payment token for the invoice
      if (invoiceData.clientEmail) {
        try {
          await createPaymentToken(invoice.id);
          console.log(`Payment token created for invoice ${invoice.id}`);
        } catch (tokenError) {
          console.error('Failed to create payment token:', tokenError);
        }
      }
      
      // Automatically send email if client email is provided and status is not Draft
      if (invoiceData.clientEmail && invoiceData.status !== 'Draft') {
        try {
          await sendInvoiceToClient(invoice.id, invoiceData.clientEmail);
          console.log(`Invoice ${invoice.id} automatically sent to ${invoiceData.clientEmail}`);
        } catch (emailError) {
          console.error('Failed to send automatic email:', emailError);
          // Don't fail the invoice creation if email fails
        }
      }
      
      res.status(201).json({message : "invoice created " , data : invoice});
    } catch (error) {
      res.status(500);
      console.log(error)
     /*  throw new Error("Invoice not creaed") */
    }
  });
const updateInvoice=asyncHandler (async (req,res)=>{
    try {

        const invoice = await Invoice.findOne({ id: req.params.id });
        console.log(invoice)
        if(!invoice) {
            res.status(404).json({ error: "Invoice not found" });
            return; 
        }
    
        const updatedInvoice = await Invoice.findOneAndUpdate({id: req.params.id}, req.body,{new : true})
        if (!updatedInvoice) {
            res.status(404).json({ error: "Updated invoice not found" });
            return; // Return early to prevent further execution
          }
        res.status(200).json({message : "invoice updated " , data : updatedInvoice});
     } catch (error) {
       res.status(500);
       console.log(error)
      /*  throw new Error("Invoice not creaed") */
     }
    
})
const deleteInvoice= asyncHandler(async (req,res)=>{

    const invoice = await Invoice.findOne({ id: req.params.id });
    if(!invoice) {
        res.status(404)
        throw new Error("Invoice not found")
    }
    await invoice.deleteOne();

    res.status(200).json({ message: "Invoice deleted" });

})

const getInvoices = asyncHandler(async(req,res)=>{
    try {
        const filterCriteria = {
            user_id: req.user.id
          };
      
          const selectedStatuses = Object.values(req.query);

          // Check if any statuses are selected, and add to filterCriteria
          if (selectedStatuses.length > 0) {
            filterCriteria.status = { $in: selectedStatuses };
          }
        console.log(req.query,filterCriteria)
        // Retrieve invoices associated with the authenticated user
         const invoices = await Invoice.find(filterCriteria); 
       
       res.status(200).json(invoices)
    } catch (error) {
        res.status(404)
        throw new Error("Invoices not found")
    }
    
   
})
const getUniqueInvoices = asyncHandler(async(req,res)=>{
  
    const invoice = await Invoice.findOne({ id: req.params.id });
    if(!invoice) {
        res.status(404)
        throw new Error("Invoice not found")
    }
    res.status(200).json({message: "Invoice found " , invoice: invoice})
})

// Public function to get invoice by ID (no auth required)
const getPublicInvoice = asyncHandler(async(req,res)=>{
    const invoice = await Invoice.findOne({ id: req.params.id });
    if(!invoice) {
        res.status(404)
        throw new Error("Invoice not found")
    }
    res.status(200).json({message: "Invoice found " , invoice: invoice})
})

// Send invoice via email
const sendInvoiceEmail = asyncHandler(async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { recipientEmail } = req.body;
        
        if (!recipientEmail) {
            res.status(400);
            throw new Error("Recipient email is required");
        }
        
        const result = await sendInvoiceToClient(invoiceId, recipientEmail);
        
        res.status(200).json({
            message: "Invoice sent successfully",
            data: result
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to send invoice: ${error.message}`);
    }
});

// Resend invoice via email
const resendInvoiceEmailController = asyncHandler(async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { recipientEmail } = req.body;
        
        if (!recipientEmail) {
            res.status(400);
            throw new Error("Recipient email is required");
        }
        
        const result = await resendInvoiceEmail(invoiceId, recipientEmail);
        
        res.status(200).json({
            message: "Invoice resent successfully",
            data: result
        });
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to resend invoice: ${error.message}`);
    }
});

// Download invoice as PDF
const downloadInvoicePDF = asyncHandler(async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        const invoice = await Invoice.findOne({ id: invoiceId });
        if (!invoice) {
            res.status(404);
            throw new Error("Invoice not found");
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        
        const pdfBuffer = await generateInvoicePDFBuffer(invoice, user);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoice.id}.pdf"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
});

// Mark invoice as paid
const markInvoiceAsPaid = asyncHandler(async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        const invoice = await Invoice.findOne({ id: invoiceId });
        if (!invoice) {
            res.status(404);
            throw new Error("Invoice not found");
        }
        
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { id: invoiceId },
            { status: 'Paid' },
            { new: true }
        );
        
        res.status(200).json({
            message: "Invoice marked as paid",
            data: updatedInvoice
        });
        
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to update invoice status: ${error.message}`);
    }
});

module.exports = {
    createInvoice,
    updateInvoice,
    getInvoices,
    getUniqueInvoices,
    getPublicInvoice,
    deleteInvoice,
    sendInvoiceEmail,
    resendInvoiceEmail: resendInvoiceEmailController,
    downloadInvoicePDF,
    markInvoiceAsPaid
}