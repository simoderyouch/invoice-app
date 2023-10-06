import React from 'react';

import { createRoot } from 'react-dom/client';


import { AuthContextProvider } from './context/authContext';
import { InvoiceContextProvider } from './context/invoiceContext';
import App from './App';



const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render( <React.StrictMode>
  
      
      <AuthContextProvider>
      <InvoiceContextProvider>
        <App />
        </InvoiceContextProvider>
        </AuthContextProvider>
   
</React.StrictMode>);