import React from 'react';

const EmailTrackingDashboard = ({ invoice }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getEmailStatus = () => {
    if (!invoice.emailTracking) {
      return {
        status: 'Not Sent',
        color: 'text-baliHai',
        bgColor: 'bg-baliHai bg-opacity-20',
        borderColor: 'border-baliHai'
      };
    }

    if (invoice.emailOpened) {
      return {
        status: 'Opened',
        color: 'text-green',
        bgColor: 'bg-green bg-opacity-20',
        borderColor: 'border-green'
      };
    }

    return {
      status: 'Sent',
      color: 'text-orange',
      bgColor: 'bg-orange bg-opacity-20',
      borderColor: 'border-orange'
    };
  };

  const emailStatus = getEmailStatus();

  return (
    <div className="bg-ebony p-6 rounded-lg border border-darkAccent">
      <h3 className="text-lg font-semibold text-white mb-4">Email Tracking</h3>
      
      <div className="space-y-4">
        {/* Email Status */}
        <div className="flex items-center justify-between">
          <span className="text-baliHai">Email Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${emailStatus.bgColor} ${emailStatus.color} ${emailStatus.borderColor}`}>
            {emailStatus.status}
          </span>
        </div>

        {/* Email Tracking Details */}
        {invoice.emailTracking && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-baliHai">Sent To:</span>
              <span className="text-white">{invoice.emailTracking.recipientEmail}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-baliHai">Sent At:</span>
              <span className="text-white">{formatDate(invoice.emailTracking.sentAt)}</span>
            </div>

                         {invoice.emailOpened && (
               <>
                 <div className="flex items-center justify-between">
                   <span className="text-baliHai">First Opened:</span>
                   <span className="text-white">{formatDate(invoice.emailOpenedAt)}</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-baliHai">Open Count:</span>
                   <span className="text-white">{invoice.emailTracking?.openedCount || invoice.emailOpenedCount || 0} times</span>
                 </div>
                 
                 {invoice.emailTracking?.lastOpenedAt && (
                   <div className="flex items-center justify-between">
                     <span className="text-baliHai">Last Opened:</span>
                     <span className="text-white">{formatDate(invoice.emailTracking.lastOpenedAt)}</span>
                   </div>
                 )}
               </>
             )}

            {/* Email History */}
            {invoice.emailHistory && invoice.emailHistory.length > 1 && (
              <div className="mt-4 pt-4 border-t border-darkAccent">
                <h4 className="text-sm font-medium text-white mb-2">Email History</h4>
                <div className="space-y-2">
                  {invoice.emailHistory.map((email, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-baliHai">
                        {email.status === 'resent' ? 'Resent' : 'Sent'} #{index + 1}
                      </span>
                      <span className="text-white">{formatDate(email.sentAt)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Payment Proof Status */}
        {invoice.paymentProof && (
          <div className="mt-4 pt-4 border-t border-darkAccent">
            <h4 className="text-sm font-medium text-white mb-2">Payment Proof</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-baliHai">Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  invoice.paymentProof.status === 'approved' 
                    ? 'bg-green bg-opacity-20 text-green border border-green' 
                    : invoice.paymentProof.status === 'rejected'
                    ? 'bg-burntSienna bg-opacity-20 text-monaLisa border border-burntSienna'
                    : 'bg-orange bg-opacity-20 text-orange border border-orange'
                }`}>
                  {invoice.paymentProof.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-baliHai">Uploaded:</span>
                <span className="text-white">{formatDate(invoice.paymentProof.uploadedAt)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-baliHai">File:</span>
                <span className="text-white text-xs">{invoice.paymentProof.fileName}</span>
              </div>
            </div>
          </div>
        )}

                 {/* Payment Upload Link */}
         {!invoice.paymentProof && invoice.status === 'Pending' && (
           <div className="mt-4 pt-4 border-t border-darkAccent">
             <h4 className="text-sm font-medium text-white mb-2">Payment Upload</h4>
             <p className="text-xs text-baliHai mb-3">
               Share this link with your client to upload payment proof:
             </p>
             <div className="bg-mirage p-3 rounded-lg">
               <code className="text-xs text-purple break-all">
                 {window.location.origin}/pay/{invoice.paymentProof?.paymentToken || 'TOKEN_NOT_FOUND'}
               </code>
             </div>
             <button
               onClick={() => navigator.clipboard.writeText(`${window.location.origin}/pay/${invoice.paymentProof?.paymentToken || 'TOKEN_NOT_FOUND'}`)}
               className="mt-2 text-xs text-purple hover:text-heliotrope transition-colors"
             >
               Copy Link
             </button>
           </div>
         )}
         

      </div>
    </div>
  );
};

export default EmailTrackingDashboard;
