const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }, 
  id: {
    type: String,
    
  },
  senderAddress: {
    Address: {
      type: String,
      
    },
    City: {
      type: String,
      
    },
    PostCode: {
      type: String,
      
    },
    Country: {
      type: String,
      
    },
  },
  clientName: {
    type: String,
    
  },
  clientEmail: {
    type: String,
    
  },
  clientAddress: {
   
    Address: {
      type: String,
 
    },
    City: {
      type: String,
     
    },
    PostCode: {
      type: String,
    
    },
    Country: {
      type: String,
      
    },
  },
 
    status: {
      type: String,
      default: "Pending",
    },
    createAt: {
      type: String,
    
    },
    paymentTerm: {
      type: Number,
    
    },
    description: {
      type: String,
    
    },
    paymentDue:{
      type: String,
    
    },
  
  ItemList: [
    {
      _id: false, 
      name: {
        type: String,
      
      },
      quantity: {
        type: Number,
      
      },
      total: {
        type: Number,
      
      },
      price: {
        type: Number,
      
      },
    },
  ],
  total: {
    type: Number,
  
  },
  // Email tracking fields
  emailTracking: {
    trackingId: String, // For webhook tracking
    sentAt: Date,
    recipientEmail: String,
    messageId: String,
    status: {
      type: String,
      enum: ['sent', 'resent', 'failed'],
      default: 'sent'
    },
    openedAt: Date,
    openedCount: { type: Number, default: 0 },
    lastOpenedAt: Date
  },
  emailHistory: [{
    sentAt: Date,
    recipientEmail: String,
    messageId: String,
    status: {
      type: String,
      enum: ['sent', 'resent', 'failed'],
      default: 'sent'
    }
  }],
  lastEmailSent: Date,
  emailOpened: {
    type: Boolean,
    default: false
  },
  emailOpenedAt: Date,
  emailOpenedCount: {
    type: Number,
    default: 0
  },
  // Payment proof fields
  paymentProof: {
    paymentToken: String, // Unique token for payment link
    uploadedAt: Date,
    fileName: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    uploadedBy: String, // client email
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminNotes: String,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
}, {
  timestamps: true,
  _id: true,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
