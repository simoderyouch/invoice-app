import { useParams } from "react-router-dom";
import Status from "../components/status";
import useInvoiceAPI from "../context/useInvoiceAPI";
import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import InvoiceForm from "../components/invoiceForm";
import ComfirmationModel from "../components/comfirmationModel";
import EmailModal from "../components/EmailModal";
import PaymentProofUpload from "../components/PaymentProofUpload";
import PaymentProofReview from "../components/PaymentProofReview";
import EmailTrackingDashboard from "../components/EmailTrackingDashboard";
import { useContext } from "react";
import InvoiceContext from "../context/invoiceContext";
import { useToggle } from '../hooks/useToggle';
function InvoiceDetails({ showNotification = () => {} }) {
  const {  fetchInvoice ,updateInvoice, downloadInvoicePDF, markInvoiceAsPaid} = useInvoiceAPI();
  const {invoice,state} = useContext(InvoiceContext)
  const { id } = useParams();
 
  const [openEditingModal, setEditingModalHandler] = useToggle(false);
  const [comfirmationModel, setComfirmationModel] = useToggle(false);
  const [emailModal, setEmailModal] = useToggle(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);

  const markAsPaid = async () => {
    try {
      await markInvoiceAsPaid(id);
      showNotification('Invoice marked as paid successfully!', 'success');
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      showNotification('Failed to mark invoice as paid', 'error');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadInvoicePDF(id);
      showNotification('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      showNotification('Failed to download PDF', 'error');
    }
  };

  useEffect(() => {
    fetchInvoice(id)
    
  }, []);

  return (
    <div className="w-full bg-mirage2 text-white relative h-[100vh] overflow-y-scroll ">
      { state.isLoading ? <p>Loading.....</p> : (
        <div
          className="m-auto relative  mt-[5.5rem]  mb-[5.5rem]"
          style={{ width: "clamp(20rem,87.5%,1000px)" }}
        >
          <Link
            to={"/"}
            className="flex mb-6  items-center gap-4 font-bold text-[.76rem]"
          >
            <svg
              width="7"
              className="mb-[.2rem]"
              height="10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.342.886L2.114 5.114l4.228 4.228"
                stroke="#9277FF"
                strokeWidth="2"
                fill="none"
                fillRule="evenodd"
              />
            </svg>
            Go back
          </Link>

          <div className="flex justify-between items-center bg-mirage p-[2rem] rounded-lg mb-4">
            <div className="flex items-center gap-9">
              <p className="text-[.75rem]">Status</p>
              <Status status={invoice?.status} />
            </div>
            <div className="flex text-[.75rem] gap-2 font-bold [&>button]:h-[3rem]  [&>button]:rounded-3xl  [&>button]:px-[1.5rem]">
              <button
                className="bg-ebony "
                onClick={setEditingModalHandler.on}
              >
                {" "}
                Edit
              </button>
              <button
                className="bg-burntSienna "
                onClick={setComfirmationModel.on}
              >
                Delete
              </button>
              <button
                className="bg-green "
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
              <button
                className="bg-purple "
                onClick={setEmailModal.on}
              >
                Send Email
              </button>
              {invoice?.status === "Pending" && (
                <button
                  className="bg-orange whitespace-nowrap "
                  onClick={markAsPaid}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          <div className="bg-mirage p-[2rem] rounded-lg">
            <div>
              <div className="flex justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[.86rem]">
                    <span className="text-purple  text-[.86rem]">#</span>
                    {invoice?.id}
                  </p>
                  <p className="text-[.75rem]">{invoice?.description}</p>
                </div>

                <p className="flex flex-col [&>span]:text-[.6875rem] gap-1">
                  <span>{invoice?.senderAddress?.Address}</span>
                  <span>{invoice?.senderAddress?.City}</span>
                  <span>{invoice?.senderAddress?.PostCode}</span>
                  <span>{invoice?.senderAddress?.Country}</span>
                </p>
              </div>
              <div className="flex ">
                <div className="flex flex-col gap-8 mr-[5rem]">
                  <div className="flex flex-col gap-4">
                    <p className="text-[.75rem]">Invoice Date</p>
                    <h4 className="text-[1rem]  whitespace-nowrap">
                      {invoice?.createAt}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-4">
                    <p className="text-[.75rem]">Payment Due</p>

                    <h4 className="text-[1rem]  whitespace-nowrap">
                      {invoice?.paymentDue}
                    </h4>
                  </div>
                </div>
                <div className="flex flex-col mr-[8rem] gap-4">
                  <p className="text-[.75rem]">Bill To</p>
                  <h4 className="text-[1rem]  whitespace-nowrap">
                    {invoice?.clientName}
                  </h4>
                  <p className="flex flex-col [&>span]:text-[.6875rem] gap-1">
                    <span>{invoice?.clientAddress?.Address}</span>
                    <span>{invoice?.clientAddress?.City}</span>
                    <span>{invoice?.clientAddress?.PostCode}</span>
                    <span>{invoice?.clientAddress?.Country}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-[.75rem]"> Send To</p>
                  <h4 className="text-[1rem]">{invoice?.clientEmail}</h4>
                </div>
              </div>
              <div className="mt-[4rem] bg-ebony w-full p-[2rem] rounded-t-lg">
                <table className=" w-full ">
                  <thead>
                    <tr className="[&>td]:text-[.6875rem] mb-5 after:content-[''] after:table-row after:w-full after:h-[4rem]">
                      <td>Item Name</td>
                      <td className="text-right">QTY.</td>
                      <td className="text-right">Price</td>
                      <td className="text-right">Total</td>
                    </tr>
                  </thead>

                  <tbody>
                    {invoice?.ItemList?.map((item, key) => {
                      return (
                        <tr
                          key={key}
                          className="[&>td]:text-[.75rem] font-bold after:content-[''] after:table-row after:w-full after:h-[3rem]"
                        >
                          <td>{item.name}</td>
                          <td className="text-right">{item.quantity}</td>
                          <td className="text-right">{item.price}</td>
                          <td className="text-right">{item.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between p-[2rem] bg-vulcan rounded-b-lg">
                <p className="text-[.6875rem]">Amount Due</p>
                <h4 className="text-[1.3rem]">${invoice?.total?.toFixed(2)}</h4>
              </div>
            </div>
          </div>
          
          {/* Email Tracking Dashboard */}
          <div className="mt-6">
            <EmailTrackingDashboard invoice={invoice} />
          </div>
          
          {/* Payment Proof Section */}
          {invoice?.paymentProof && (
            <>
              <PaymentProofReview 
                paymentProof={invoice.paymentProof}
                invoiceId={invoice.id}
                onReview={() => {
                  fetchInvoice(id);
                  showNotification('Payment proof reviewed successfully!', 'success');
                }}
              />
</>          )}
          
          {/* Payment Proof Upload for Clients */}
          {!invoice?.paymentProof && invoice?.status === 'Pending' && (
            <div className="mt-6">
              <PaymentProofUpload 
                invoiceId={invoice.id}
                clientEmail={invoice.clientEmail}
                onSuccess={() => {
                  fetchInvoice(id);
                  showNotification('Payment proof uploaded successfully!', 'success');
                }}
              />
            </div>
          )}
        </div>
      ) }

      <InvoiceForm
        defaultValues={invoice}
        isEditing={true}
        isOpen={openEditingModal}
        handleClose={setEditingModalHandler.off}
        showNotification={showNotification}
      />
      {comfirmationModel && (
        <ComfirmationModel
          id={invoice?.id}
          handleClose={setComfirmationModel}
        />
      )}
      <EmailModal
        isOpen={emailModal}
        onClose={setEmailModal.off}
        invoiceId={invoice?.id}
        clientEmail={invoice?.clientEmail}
        clientName={invoice?.clientName}
        invoice={invoice}
      />
    </div>
  );
}

export default InvoiceDetails;
