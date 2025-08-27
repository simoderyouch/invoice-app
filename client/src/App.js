import InvoiceDetails from "./pages/invoiceDetails";
import Main from "./pages/main";
import SideBar from "./components/sideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Notification from "./components/Notification";
import { useState } from "react";

import RequireAuth from "./utils/requireAuth";
import Login from "./pages/login";
import PersistLogin from "./utils/persistLogin";
import Register from "./pages/register";
import PaymentUploadNew from "./pages/PaymentUploadNew";


function App() {
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showNotification = (message, type = 'success') => {
    setNotification({
      isVisible: true,
      message,
      type
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  return (
    <div className="bg-mirage2 w-full h-full">
      <Router>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={
                <div className="full-page h-[100vh] w-full flex bg-mirage2 max-[944px]:flex-col">
                  <SideBar />
                  <Main showNotification={showNotification} />
                </div>
              } />
              <Route path="/invoices/:id" element={
                <div className="full-page h-[100vh] w-full flex bg-mirage2 max-[944px]:flex-col">
                  <SideBar />
                  <InvoiceDetails showNotification={showNotification} />
                </div>
              } />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pay/:paymentToken" element={<PaymentUploadNew />} />
        </Routes>
      </Router>
      
      <Notification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

export default App;
