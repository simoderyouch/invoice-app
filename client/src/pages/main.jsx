
import plusIcon from "../assets/icon-plus.svg";
import useInvoiceAPI from "../context/useInvoiceAPI"
import { useState, useEffect, useContext } from "react";
import InvoiceForm from "../components/invoiceForm";
import InvoiceList from "../components/invoiceList";
import InvoiceContext from "../context/invoiceContext";
import { useToggle } from "../hooks/useToggle";
import { FilterDropdown } from "../components/FilterDropdown";
function Main() {
  
  const [isFormModalOpen, setFormModalOpen] = useToggle(false);

  const {  fetchInvoices } = useInvoiceAPI();
  const {invoices,state} = useContext(InvoiceContext)

  useEffect(()=>{
    fetchInvoices()
  },[])
  return (
    <div className="w-full overflow-y-scroll  max-[944px]:h-[100vh] bg-mirage2 text-white relative ">
      {
  <div className="m-auto" style={{ width: "clamp(20rem,87.5%,730px)" }}>
        <div className="flex justify-between items-center mt-[5.5rem]">
          <div className="flex flex-col gap-2">
            <h1>Invoices</h1>
            <p className="text-whisper font-sm  text-[.8rem]">
              There are {invoices?.length} total Invoices
            </p>
          </div>
          <div className="flex gap-9 items-center relative">
           
         
             <FilterDropdown />
          
            <button
              className="bg-purple text-white flex justify-center items-center gap-4 p-2 rounded-3xl"
              onClick={setFormModalOpen.toggle}
            >
              <div className="flex justify-center items-center bg-white rounded-full p-3 ">
                <img src={plusIcon} alt="" className="" />
              </div>
              <h4 className="mr-2">New Invoice</h4>
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-[4rem]">
          {   state.isLoading ? <p>Loading....</p> :
          invoices?.map((item, index) => {
            return <InvoiceList key={index} data={item} />;
          })}
        </div>
        <InvoiceForm
          isEditing={false}
          isOpen={isFormModalOpen}
          handleClose={setFormModalOpen.off}
        />
      </div>
      }
      
    </div>
  );
}
export default Main;
