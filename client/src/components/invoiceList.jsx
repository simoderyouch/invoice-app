
import rightArrow from '../assets/icon-arrow-right.svg'

import { useNavigate } from 'react-router-dom';
import Status from './status';
import {getDate} from '../utils/dateUtils';

function InvoiceList({data}) {
   
    const navigate = useNavigate();



  
    const handleNavigateToInvoice = () => {
        const invoiceId = data.id;
        navigate(`/invoices/${invoiceId}`);
      };
   
    
    return (
        <div onClick={handleNavigateToInvoice} className="flex justify-between text-white border border-transparent hover:border hover:border-purple items-center w-full rounded-xl h-auto py-[1.5rem] mb-6 bg-mirage px-[2rem] cursor-pointer" style={  { boxShadow: "0 10px 10px -10px rgba(72,84,159,.1004)"} }>
         <div className='flex gap-[2rem]'>
         <p className='font-bold text-[.86rem]'><span className='text-purple  text-[.86rem]'>#</span>{data?.id}</p> 
           <p className='text-whisper text-[.7rem] font-sm'>Due {getDate(data.createAt) }</p>
         </div>
         <div className='flex items-center justify-between w-[60%]'>
          <div className='flex w-full justify-between'>
          <p className='text-whisper font-sm  text-[.7rem] '>
            {data.clientName}
           </p>
           <p className='font-bold '>
           ${data?.total?.toLocaleString("en-US")}
           </p>
          </div>
          <div className='flex gap-6 items-center ml-[2rem]'>
           <Status status={data.status}/>
           <img src={rightArrow}  alt="arrow"/>
          </div>
         </div>
          
         
        </div>
    )

}




export default InvoiceList;