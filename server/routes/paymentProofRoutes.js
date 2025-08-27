const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Invoice = require("../models/invoiceModel");

// Multer storage configuration for payment proofs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/payment-proofs');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `payment-proof-${req.params.paymentToken}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed!'));
    }
  }
});

// Get invoice by payment token (public access)
const getInvoiceByPaymentToken = async (req, res) => {
  try {
    const { paymentToken } = req.params;
    console.log('Looking for invoice with payment token:', paymentToken);
    
    const invoice = await Invoice.findOne({ 
      'paymentProof.paymentToken': paymentToken 
    });
    
    console.log('Invoice found:', invoice ? 'YES' : 'NO');
    if (invoice) {
      console.log('Invoice ID:', invoice.id);
      console.log('Payment token in DB:', invoice.paymentProof?.paymentToken);
    }
    
    if (!invoice) {
      console.log('No invoice found for payment token:', paymentToken);
      return res.status(404).json({ 
        success: false, 
        message: 'Payment link not found or expired' 
      });
    }
    
    // Return only necessary invoice data for payment
    const paymentData = {
      id: invoice.id,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      total: invoice.total,
      status: invoice.status,
      createAt: invoice.createAt,
      paymentDue: invoice.paymentDue,
      description: invoice.description,
      paymentProof: invoice.paymentProof,
      emailTracking: invoice.emailTracking
    };
    
    res.json({ success: true, invoice: paymentData });
  } catch (error) {
    console.error('Error getting invoice by payment token:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Upload payment proof (public access)
const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentToken } = req.params;
    const { clientEmail } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select a file to upload' 
      });
    }
    
    const invoice = await Invoice.findOne({ 
      'paymentProof.paymentToken': paymentToken 
    });
    
    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment link not found or expired' 
      });
    }
    
    // Verify client email matches
    if (invoice.clientEmail !== clientEmail) {
      return res.status(403).json({ 
        success: false, 
        message: 'Email address does not match invoice' 
      });
    }
    
    // Update invoice with payment proof
    const paymentProof = {
      uploadedAt: new Date(),
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: clientEmail,
      status: 'pending',
      paymentToken: paymentToken
    };
    
    await Invoice.findOneAndUpdate(
      { 'paymentProof.paymentToken': paymentToken },
      { paymentProof: paymentProof },
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: 'Payment proof uploaded successfully! It will be reviewed by the admin.' 
    });
    
  } catch (error) {
    console.error('Error uploading payment proof:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload payment proof' 
    });
  }
};

// Get payment proof status (public access)
const getPaymentProofStatus = async (req, res) => {
  try {
    const { paymentToken } = req.params;
    
    const invoice = await Invoice.findOne({ 
      'paymentProof.paymentToken': paymentToken 
    });
    
    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment link not found or expired' 
      });
    }
    
    const status = {
      invoiceId: invoice.id,
      clientName: invoice.clientName,
      total: invoice.total,
      status: invoice.status,
      paymentProof: invoice.paymentProof ? {
        status: invoice.paymentProof.status,
        uploadedAt: invoice.paymentProof.uploadedAt,
        adminNotes: invoice.paymentProof.adminNotes,
        reviewedAt: invoice.paymentProof.reviewedAt
      } : null
    };
    
    res.json({ success: true, status });
  } catch (error) {
    console.error('Error getting payment proof status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Review payment proof (admin only)
const reviewPaymentProof = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status, adminNotes } = req.body;
    
    const invoice = await Invoice.findOne({ id: invoiceId });
    if (!invoice || !invoice.paymentProof) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment proof not found' 
      });
    }
    
    // Update payment proof
    const updateData = {
      'paymentProof.status': status,
      'paymentProof.adminNotes': adminNotes,
      'paymentProof.reviewedAt': new Date(),
      'paymentProof.reviewedBy': req.user.id
    };
    
    // If approved, mark invoice as paid
    if (status === 'approved') {
      updateData.status = 'Paid';
    }
    
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { id: invoiceId },
      updateData,
      { new: true }
    );
    
    res.json({ 
      success: true, 
      message: `Payment proof ${status} successfully`,
      invoice: updatedInvoice
    });
    
  } catch (error) {
    console.error('Error reviewing payment proof:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to review payment proof' 
    });
  }
};

// Download payment proof (admin only)
const downloadPaymentProof = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    console.log('Download request for invoice:', invoiceId);
    
    const invoice = await Invoice.findOne({ id: invoiceId });
    if (!invoice || !invoice.paymentProof) {
      console.log('Invoice or payment proof not found for:', invoiceId);
      return res.status(404).json({ 
        success: false, 
        message: 'Payment proof not found' 
      });
    }
    
    const filePath = invoice.paymentProof.filePath;
    const fileName = invoice.paymentProof.fileName;
    
    console.log('File path:', filePath);
    console.log('File name:', fileName);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist at path:', filePath);
      return res.status(404).json({ 
        success: false, 
        message: 'File not found on server' 
      });
    }
    
    console.log('File exists, setting up download...');
    
    // Set headers for file download
    res.setHeader('Content-Type', invoice.paymentProof.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    console.log('File stream started');
    
  } catch (error) {
    console.error('Error downloading payment proof:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download payment proof' 
    });
  }
};

// Public routes (no auth required)
router.get('/invoice/:paymentToken', getInvoiceByPaymentToken);
router.post('/upload/:paymentToken', upload.single('paymentProof'), uploadPaymentProof);
router.get('/status/:paymentToken', getPaymentProofStatus);

// Admin routes (require authentication)
const validateToken = require('../middleware/validateTokenHandler');
router.use(validateToken);
router.get('/download/:invoiceId', downloadPaymentProof);
router.put('/review/:invoiceId', reviewPaymentProof);

module.exports = router;
