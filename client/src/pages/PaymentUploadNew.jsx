import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const PaymentUploadNew = () => {
  const { paymentToken } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [clientEmail, setClientEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (paymentToken) {
      fetchInvoice();
    }
  }, [paymentToken]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!clientEmail) {
      setError('Please enter your email address');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('paymentProof', file);
      formData.append('clientEmail', clientEmail);

      const response = await axios.post(`/api/payment-proof/upload/${paymentToken}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadSuccess(true);
        setEditing(false);
        // Refresh invoice data to get updated payment proof status
        fetchInvoice();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      console.log('Fetching invoice with payment token:', paymentToken);
      const response = await axios.get(`/api/payment-proof/invoice/${paymentToken}`);
      console.log('Response:', response.data);
      if (response.data.success) {
        setInvoice(response.data.invoice);
        setClientEmail(response.data.invoice.clientEmail);
        
        // Track email open if there's a tracking ID
        if (response.data.invoice.emailTracking?.trackingId) {
          try {
            await axios.get(`/api/webhooks/email-opened/${response.data.invoice.emailTracking.trackingId}`);
            console.log('Email open tracked successfully');
          } catch (trackingError) {
            console.error('Failed to track email open:', trackingError);
            // Don't show error to user, just log it
          }
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          <svg className="w-6 h-6 text-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-6 h-6 text-red" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-6 h-6 text-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-baliHai" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p>Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Payment Link Invalid</h1>
          <p className="text-baliHai mb-6">{error || 'This payment link is not valid or has expired.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-heliotrope transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className=" w-full h-[100vh] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-green bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Proof Uploaded!</h1>
          <p className="text-baliHai mb-6">Your payment proof has been uploaded successfully!</p>
          <button
            onClick={() => setUploadSuccess(false)}
            className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-heliotrope transition-colors"
          >
            View Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white w-full h-full items-center justify-center">
      <div className="px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Payment Upload</h1>
            <p className="text-baliHai">Invoice #{invoice.id}</p>
          </div>

          {/* Invoice Summary */}
          <div className="bg-ebony rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-purple font-medium mb-2">Client Information</h3>
                <p className="text-white font-medium">{invoice.clientName}</p>
                <p className="text-baliHai">{invoice.clientEmail}</p>
              </div>
              <div>
                <h3 className="text-purple font-medium mb-2">Invoice Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-baliHai">Invoice Date:</span>
                    <span className="text-white">{invoice.createAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-baliHai">Payment Due:</span>
                    <span className="text-white">{invoice.paymentDue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-baliHai">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      invoice.status === 'Paid' 
                        ? 'bg-green bg-opacity-20 text-green border border-green' 
                        : invoice.status === 'Pending'
                        ? 'bg-orange bg-opacity-20 text-orange border border-orange'
                        : 'bg-baliHai bg-opacity-20 text-baliHai border border-baliHai'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-baliHai">Total Amount:</span>
                    <span className="text-white font-bold text-lg">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Proof Status */}
          {invoice.paymentProof && (
            <div className="bg-ebony rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Payment Proof Status</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mirage rounded-full flex items-center justify-center">
                    {getStatusIcon(invoice.paymentProof.status)}
                  </div>
                  {invoice.paymentProof.status === 'pending' && (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-heliotrope transition-colors text-sm"
                    >
                      Edit Proof
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-baliHai">Status:</span>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(invoice.paymentProof.status)}`}>
                    {invoice.paymentProof.status.charAt(0).toUpperCase() + invoice.paymentProof.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-baliHai">Uploaded:</span>
                  <span className="text-white">{formatDate(invoice.paymentProof.uploadedAt)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-baliHai">File:</span>
                  <span className="text-white text-sm">{invoice.paymentProof.fileName}</span>
                </div>
                
                {invoice.paymentProof.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-baliHai">Reviewed:</span>
                    <span className="text-white">{formatDate(invoice.paymentProof.reviewedAt)}</span>
                  </div>
                )}
                
                {invoice.paymentProof.adminNotes && (
                  <div className="bg-mirage p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">Admin Notes:</h4>
                    <p className="text-sm text-baliHai">{invoice.paymentProof.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Proof Upload Form */}
          {(!invoice.paymentProof.uploadedAt || editing) && (
            <div className="bg-ebony rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editing ? 'Update Payment Proof' : 'Upload Payment Proof'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Verification */}
              <div>
                <label className="block text-sm font-medium text-baliHai mb-2">
                  Email Address (for verification)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-mirage border border-darkAccent rounded-lg text-white focus:border-purple focus:outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-baliHai mb-2">
                  Payment Proof File
                </label>
                <div className="border-2 border-dashed border-darkAccent rounded-lg p-6 text-center hover:border-purple transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    className="hidden"
                    id="payment-file"
                  />
                  <label htmlFor="payment-file" className="cursor-pointer">
                    <div className="space-y-2">
                      <svg className="mx-auto h-8 w-8 text-baliHai" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-baliHai">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-baliHai">
                        PNG, JPG, GIF, PDF, DOC up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
                
                {file && (
                  <div className="mt-3 p-3 bg-mirage rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-baliHai">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-baliHai hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red bg-opacity-20 border border-red rounded-lg">
                  <p className="text-red text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !file || !clientEmail}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  uploading || !file || !clientEmail
                    ? 'bg-baliHai text-darkAccent cursor-not-allowed'
                    : 'bg-purple text-white hover:bg-heliotrope'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  editing ? 'Update Payment Proof' : 'Upload Payment Proof'
                )}
              </button>
            </form>
          </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-mirage rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <div className="space-y-3 text-sm text-baliHai">
              <div className="flex items-start gap-3">
                <span className="bg-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <p>Make your payment using the method specified in the invoice</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <p>Take a screenshot or photo of your payment receipt/confirmation</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <p>Upload the payment proof using the form above</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <p>Wait for admin review and confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUploadNew;
