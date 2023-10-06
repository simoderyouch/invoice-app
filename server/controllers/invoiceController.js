const asyncHandler = require("express-async-handler")
const Invoice = require("../models/invoiceModel")

const createInvoice = asyncHandler(async (req, res) => {
    const invoiceData = req.body;
     console.log(invoiceData)
    try {

       invoiceData.user_id = req.user.id; 
      const invoice = await Invoice.create(invoiceData);
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
module.exports = {
    createInvoice,
    updateInvoice,
    getInvoices,
    getUniqueInvoices,
    deleteInvoice
}