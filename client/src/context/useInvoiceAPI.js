import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useContext } from "react"
import InvoiceContext from "./invoiceContext"

function useInvoiceAPI() { 
const axiosInstance = useAxiosPrivate()
const {setInvoices,setInvoice,setState} = useContext(InvoiceContext)

const fetchInvoices = async (params) => {
  try {
    setState({isLoading: true})
    const response = await axiosInstance.get('/api/invoices',{ params: params });
    console.log(response)
    setInvoices(response.data)
    setState({isLoading: false })
   return response.data
  } catch (error) {
    console.log(error)
    setState({isLoading: false ,error : error})
  }
}

const fetchInvoice = async (invoiceId) => {
    try {
      setState({isLoading: true})
      const response = await axiosInstance.get(`/api/invoices/${invoiceId}`);
     
      console.log(response)
      setInvoice(response.data.invoice)
      setState({isLoading: false })
      return response.data.invoice
    } catch (error) {
      setState({isLoading: false ,error : error})
      console.log(error)
    }
  };

  const createInvoice = async (invoiceData) => {
    try {
      setState({isLoading: true})
      const response = await axiosInstance.post('/api/invoices', invoiceData);
     
      fetchInvoices()
      setState({isLoading: false })
      return response.data;
    } catch (error) {
      setState({isLoading: false ,error : error})
      console.log(error)
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      setState({isLoading: true})
      await axiosInstance.delete(`/api/invoices/${invoiceId}`);
   
      setState({isLoading: false })
      fetchInvoices()
    } catch (error) {
      setState({isLoading: false ,error : error})
      console.log(error)
    }
  };

  const updateInvoice = async (invoiceId, updatedInvoice) => {
    try {
      setState({isLoading: true})
      const response = await axiosInstance.put(`/api/invoices/${invoiceId}`, updatedInvoice);
     
      fetchInvoice(invoiceId)
      setState({isLoading: false })
      return response.data;
    } catch (error) {
      setState({isLoading: false ,error : error})
      console.log(error);
    }
  };
   
   

  
  
  return {
    axiosInstance,
    fetchInvoices,
    updateInvoice,
    deleteInvoice,
    fetchInvoice,
    createInvoice,
   

  };
}
export default useInvoiceAPI;