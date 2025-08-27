import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useInvoiceAPI from '../context/useInvoiceAPI';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const PaymentProofReview = ({ paymentProof, invoiceId, onReview }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState(paymentProof?.status || 'pending');
  const [notes, setNotes] = useState(paymentProof?.adminNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reviewPaymentProof } = useInvoiceAPI();
  const axiosPrivate = useAxiosPrivate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green bg-opacity-20 text-green border border-green';
      case 'rejected':
        return 'bg-red bg-opacity-20 text-red border border-red';
      case 'pending':
        return 'bg-orange bg-opacity-20 text-orange border border-orange';
      default:
        return 'bg-baliHai bg-opacity-20 text-baliHai border border-baliHai';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5 text-red" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-baliHai" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await reviewPaymentProof(invoiceId, status, notes);
      setIsOpen(false);
      if (onReview) onReview();
    } catch (error) {
      console.error('Error reviewing payment proof:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      console.log('Attempting to download payment proof for invoice:', invoiceId);
      console.log('File path:', paymentProof?.filePath);
      console.log('File name:', paymentProof?.fileName);
      
      // Use the authenticated axios instance for download
      const response = await axiosPrivate.get(`/api/payment-proof/download/${invoiceId}`, {
        responseType: 'blob'
      });
      
      console.log('Download response received:', response.status);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', paymentProof.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to download payment proof: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-ebony rounded-lg border border-darkAccent mt-7">
      {/* Header */}
      <div className="p-4 border-b border-darkAccent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mirage rounded-full flex items-center justify-center">
              {getStatusIcon(paymentProof?.status || 'pending')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Payment Proof Review</h3>
              <p className="text-sm text-baliHai">
                Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(paymentProof?.status || 'pending')}`}>
                  {paymentProof?.status?.charAt(0).toUpperCase() + paymentProof?.status?.slice(1) || 'Pending'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-baliHai hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* File Information */}
              <div className="bg-mirage rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-3">File Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-baliHai">File Name:</span>
                    <p className="text-white font-medium">{paymentProof?.fileName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-baliHai">File Size:</span>
                    <p className="text-white">{formatFileSize(paymentProof?.fileSize)}</p>
                  </div>
                  <div>
                    <span className="text-baliHai">File Type:</span>
                    <p className="text-white">{paymentProof?.fileType || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-baliHai">Uploaded By:</span>
                    <p className="text-white">{paymentProof?.uploadedBy || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-baliHai">Upload Date:</span>
                    <p className="text-white">{formatDate(paymentProof?.uploadedAt)}</p>
                  </div>
                  {paymentProof?.reviewedAt && (
                    <div>
                      <span className="text-baliHai">Reviewed Date:</span>
                      <p className="text-white">{formatDate(paymentProof.reviewedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Button */}
              {paymentProof?.fileName && (
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-heliotrope transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Payment Proof
                  </button>
                </div>
              )}

              {/* Review Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-baliHai mb-2">
                    Review Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-mirage border border-darkAccent rounded-lg text-white focus:border-purple focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-baliHai mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-mirage border border-darkAccent rounded-lg text-white focus:border-purple focus:outline-none resize-none"
                    placeholder="Add notes about the payment proof review..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-purple text-white py-2 px-4 rounded-lg hover:bg-heliotrope transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-transparent border border-darkAccent text-baliHai py-2 px-4 rounded-lg hover:bg-darkAccent transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentProofReview;
