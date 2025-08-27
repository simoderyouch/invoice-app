const express = require("express");
const router = express.Router();
const { recordEmailOpenWebhook } = require("../services/webhookEmailTrackingService");

// Email opened webhook (no auth required)
router.get("/email-opened/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    console.log(`Webhook received for tracking ID: ${trackingId}`);
    
    // Record email open
    const result = await recordEmailOpenWebhook(trackingId);
    
    if (result) {
      console.log(`Email tracking successful for tracking ID: ${trackingId}`);
      res.status(200).json({ 
        success: true, 
        message: 'Email opened tracked successfully' 
      });
    } else {
      console.log(`Email tracking failed for tracking ID: ${trackingId}`);
      res.status(404).json({ 
        success: false, 
        message: 'Tracking ID not found' 
      });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;

