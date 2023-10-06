const  express =  require("express");
const router = express.Router();
const {createInvoice,getInvoices,getUniqueInvoices,updateInvoice,deleteInvoice} = require("../controllers/invoiceController.js");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(getInvoices).post(createInvoice);
router.route("/:id").get(getUniqueInvoices).put(updateInvoice).delete(deleteInvoice);

module.exports =  router;