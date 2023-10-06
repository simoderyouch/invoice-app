import InvoiceDetails from "./pages/invoiceDetails";
import Main from "./pages/main";
import SideBar from "./components/sideBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import RequireAuth from "./utils/requireAuth";
import Login from "./pages/login";
import PersistLogin from "./utils/persistLogin";
import Register from "./pages/register";


function App() {
  return (
   
      <div className="full-page h-[100vh] w-full flex bg-mirage2 max-[944px]:flex-col">
        <Router>
          <SideBar />
          <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Main />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
            </Route>
            </Route>
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </div>
   
  );
}

export default App;
