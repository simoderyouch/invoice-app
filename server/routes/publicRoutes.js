const express = require("express");
const router = express.Router();
const { getPublicInvoice } = require("../controllers/invoiceController.js");

// Public route to get invoice by ID (no auth required)
router.route("/invoices/:id").get(getPublicInvoice);

module.exports = router;
