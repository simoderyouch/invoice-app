import axios from "../utils/axios";
import { useContext } from "react";
import AuthContext from "../context/authContext";
import InvoiceContext from "../context/invoiceContext";

const useLogout = () => {
    const { setAuth } = useContext(AuthContext);
    const { setInvoices,setInvoice } = useContext(InvoiceContext);
    const logout = async () => {
        setAuth({});
        setInvoices([])
        setInvoice([])
        try {
            const response = await axios('/api/auth/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout