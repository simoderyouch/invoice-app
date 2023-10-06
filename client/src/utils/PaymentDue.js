import  {getDate}  from "./dateUtils";

function calculatePaymentDue(invoiceDate, paymentTerms) {
  switch (paymentTerms) {
    case "Net 1 Day":
      return {date : getDate(invoiceDate, 1) , term : 1};
    case "Net 7 Days":
      return {date : getDate(invoiceDate, 7) , term : 7};
    case "Net 14 Days":
      return {date : getDate(invoiceDate, 14) , term : 14};
    case "Net 30 Days":
      return {date : getDate(invoiceDate, 30) , term : 30};
    default:
      return "";
  }
}

export default calculatePaymentDue;
