
import { Navigate, Outlet, useLocation } from "react-router-dom";
import  useInvoiceContext  from "../context/authContext";
import { useContext } from "react";
import InvoiceContext from "../context/authContext";
function RequireAuth() {
  const {auth} = useContext(InvoiceContext);
  const location = useLocation()
  
 
  return auth?.accessToken   ?
  <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default RequireAuth;