import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../utils/axios';

const PaymentProofUpload = ({ invoiceId, clientEmail, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB');
        setIsError(true);
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage('Please upload an image (JPEG, PNG, GIF) or document (PDF, DOC, DOCX)');
        setIsError(true);
        return;
      }
      
      setFile(selectedFile);
      setMessage('');
      setIsError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Please select a file to upload');
      setIsError(true);
      return;
    }

    if (!clientEmail) {
      setMessage('Client email is required');
      setIsError(true);
      return;
    }

    setIsUploading(true);
    setMessage('');
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append('paymentProof', file);
      formData.append('clientEmail', clientEmail);

      const response = await axios.post(
        `/api/tracking/payment-proof/${invoiceId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setIsSuccess(true);
      setMessage('Payment proof uploaded successfully! It will be reviewed by the admin.');
      
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Reset form
      setFile(null);
      const fileInput = document.getElementById('payment-proof-file');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Failed to upload payment proof');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-ebony p-6 rounded-lg border border-darkAccent">
      <h3 className="text-lg font-semibold text-white mb-4">Upload Payment Proof</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-baliHai mb-2">
            Payment Proof File
          </label>
          <div className="border-2 border-dashed border-darkAccent rounded-lg p-4 text-center hover:border-purple transition-colors">
            <input
              id="payment-proof-file"
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              className="hidden"
            />
            <label htmlFor="payment-proof-file" className="cursor-pointer">
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
                  onClick={() => {
                    setFile(null);
                    document.getElementById('payment-proof-file').value = '';
                  }}
                  className="text-baliHai hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
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

        <button
          type="submit"
          disabled={isUploading || !file}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
            isUploading || !file
              ? 'bg-darkAccent text-baliHai cursor-not-allowed'
              : 'bg-purple text-white hover:bg-heliotrope'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Payment Proof'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-mirage rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Instructions:</h4>
        <ul className="text-xs text-baliHai space-y-1">
          <li>• Upload a screenshot or photo of your payment receipt</li>
          <li>• Acceptable formats: JPG, PNG, GIF, PDF, DOC, DOCX</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Your payment proof will be reviewed by the admin</li>
          <li>• You'll be notified once the payment is verified</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentProofUpload;

