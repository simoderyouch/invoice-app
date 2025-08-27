const  express =  require("express");
const router = express.Router();
const {
    createInvoice,
    getInvoices,
    getUniqueInvoices,
    updateInvoice,
    deleteInvoice,
    sendInvoiceEmail,
    resendInvoiceEmail,
    downloadInvoicePDF,
    markInvoiceAsPaid
} = require("../controllers/invoiceController.js");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(getInvoices).post(createInvoice);
router.route("/:id").put(updateInvoice).delete(deleteInvoice);
router.route("/:invoiceId/send").post(sendInvoiceEmail);
router.route("/:invoiceId/resend").post(resendInvoiceEmail);
router.route("/:invoiceId/download").get(downloadInvoicePDF);
router.route("/:invoiceId/mark-paid").put(markInvoiceAsPaid);

module.exports =  router;