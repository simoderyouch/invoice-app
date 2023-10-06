import React, { createContext, useState } from 'react';
import axios from '../utils/axios';


const InvoiceContext = createContext();

export const  InvoiceContextProvider = ({ children }) => {
 
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [state, setState] = useState({
    isLoading : false,
    error : null
  });
  const invoiceContextValue = {
   invoices,setInvoices,
   invoice, setInvoice,
   state, setState
  };

  return (
    <InvoiceContext.Provider value={invoiceContextValue}>
      {children}
    </InvoiceContext.Provider>
  );
}


export default InvoiceContext;