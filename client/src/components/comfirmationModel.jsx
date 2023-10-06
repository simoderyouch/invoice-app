
import useInvoiceAPI from '../context/useInvoiceAPI';
import { useNavigate } from 'react-router-dom';

export default function ComfirmationModel({ id ,handleClose}) {
    
  const navigate = useNavigate();
  const {  deleteInvoice} = useInvoiceAPI();
  const handleDelete = () => {
     deleteInvoice(id)
    handleClose.off()
    navigate("/");
  }
  return (
    
      <div className="bg-[rgba(0,0,0,.45)] h-[100vh] flex justify-center items-center z-40 fixed w-[100%] top-0 right-0  ">
      <div className="absolute bg-mirage  w-[30rem] m-auto p-[3rem] rounded-lg">
        <h1>Confirm Deletion</h1>
        <p  className="text-baliHai text-[.75rem] mt-2">
          Are you sure you want to delete invoice #{id}? This action cannot be
          undone.
        </p>
        <div className="flex text-[.75rem] gap-2 justify-end mt-4 font-bold [&>button]:h-[3rem]  [&>button]:rounded-3xl  [&>button]:px-[1.5rem]">
            <button
              className=" bg-ebony "
              onClick={handleClose.off}
            >
          
              Cancel
            </button>
            <button
              className="bg-burntSienna "
             onClick={handleDelete}
            >
              Delete
            </button>
            
          </div>
        
      </div>
      </div>
      
  
  );
}
