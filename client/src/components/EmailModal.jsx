import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useInvoiceAPI from '../context/useInvoiceAPI';

const EmailModal = ({ isOpen, onClose, invoiceId, clientEmail, clientName, invoice }) => {
  const [email, setEmail] = useState(clientEmail || '');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const { sendInvoiceEmail, resendInvoiceEmail } = useInvoiceAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setIsError(true);
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      if (invoice?.emailTracking) {
        // If email was sent before, use resend
        await resendInvoiceEmail(invoiceId, email);
        setIsResending(true);
        setMessage('Invoice resent successfully!');
      } else {
        // First time sending
        await sendInvoiceEmail(invoiceId, email);
        setMessage('Invoice sent successfully!');
      }
      
      setIsSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setIsError(false);
        setIsResending(false);
        setMessage('');
      }, 2000);
      
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to send invoice');
    }
  };

  const handleClose = () => {
    onClose();
    setIsSuccess(false);
    setIsError(false);
    setIsResending(false);
    setMessage('');
    setEmail(clientEmail || '');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-ebony p-8 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Send Invoice</h2>
              <button
                onClick={handleClose}
                className="text-baliHai hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Email Tracking Information */}
            {invoice?.emailTracking && (
              <div className="mb-6 p-4 bg-mirage rounded-lg border border-darkAccent">
                <h3 className="text-sm font-semibold text-white mb-3">Email History</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-baliHai">Last Sent:</span>
                    <span className="text-white">{formatDate(invoice.emailTracking.sentAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-baliHai">Recipient:</span>
                    <span className="text-white">{invoice.emailTracking.recipientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-baliHai">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.emailTracking.status === 'sent' 
                        ? 'bg-green bg-opacity-20 text-green' 
                        : 'bg-orange bg-opacity-20 text-orange'
                    }`}>
                      {invoice.emailTracking.status}
                    </span>
                  </div>
                  {invoice.emailHistory && invoice.emailHistory.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-darkAccent">
                      <span className="text-baliHai">Total emails sent: {invoice.emailHistory.length}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-baliHai mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter recipient email"
                  className="w-full px-3 py-2 bg-mirage border border-darkAccent rounded-lg text-white placeholder-baliHai focus:outline-none focus:border-purple"
                  required
                />
                {clientName && (
                  <p className="text-xs text-baliHai mt-1">
                    Client: {clientName}
                  </p>
                )}
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  isSuccess 
                    ? 'bg-green bg-opacity-20 text-green border border-green' 
                    : 'bg-burntSienna bg-opacity-20 text-monaLisa border border-burntSienna'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-transparent border border-darkAccent text-baliHai rounded-lg hover:bg-darkAccent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple text-white rounded-lg hover:bg-heliotrope transition-colors"
                >
                  {invoice?.emailTracking ? 'Resend Invoice' : 'Send Invoice'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmailModal;
