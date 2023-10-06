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
}, {
  timestamps: true,
  _id: true,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
