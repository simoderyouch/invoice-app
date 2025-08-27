
import rightArrow from '../assets/icon-arrow-right.svg'
import { useNavigate } from 'react-router-dom';
import Status from './status';
import { getDate } from '../utils/dateUtils';
import { motion } from 'framer-motion';

function InvoiceList({ data }) {
   
    const navigate = useNavigate();

    const handleNavigateToInvoice = () => {
        const invoiceId = data.id;
        navigate(`/invoices/${invoiceId}`);
    };
   
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Draft':
                return '';
            case 'Pending':
                return '';
            case 'Paid':
                return '';
            default:
                return '';
        }
    };

    const getEmailStatusIcon = (emailTracking) => {
        if (!emailTracking) return null;
        
        if (data?.emailOpened) {
            return (
                <div className="flex items-center gap-1 bg-green/10 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                    <span className="text-green text-xs font-medium">Opened</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1 bg-orange/10 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-orange rounded-full"></div>
                    <span className="text-orange text-xs font-medium">Sent</span>
                </div>
            );
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };
   
    return (
        <motion.div 
            onClick={handleNavigateToInvoice} 
            className="group flex justify-between text-white border border-transparent hover:border-purple/50 items-center w-full rounded-xl h-auto py-6 mb-4 bg-ebony px-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple/10 hover:scale-[1.02]"
            style={{ boxShadow: "0 10px 10px -10px rgba(72,84,159,.1004)" }}
            whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <div className='flex items-center gap-6'>
                {/* Invoice ID */}
                <div className="flex items-center gap-0">
                    <span className="text-purple font-bold text-lg">#</span>
                    <p className='font-bold text-lg'>{data?.id}</p>
                </div>

                {/* Status Icon */}
                <div className="text-2xl">
                    {getStatusIcon(data.status)}
                </div>

                {/* Due Date */}
                <div className="flex flex-col">
                    <p className='text-whisper text-sm'>Due</p>
                    <p className='text-white font-medium'>{getDate(data.createAt)}</p>
                </div>

                {/* Email Status */}
                {getEmailStatusIcon(data?.emailTracking)}
            </div>

            <div className='flex items-center justify-between w-[60%]'>
                <div className='flex w-full justify-between items-center'>
                    {/* Client Name */}
                    <div className="flex flex-col">
                        <p className='text-whisper text-sm'>Client</p>
                        <p className='text-white font-semibold text-lg'>
                            {data.clientName}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col items-end">
                        <p className='text-whisper text-sm'>Amount</p>
                        <p className='font-bold text-xl text-white'>
                            {formatAmount(data?.total)}
                        </p>
                    </div>
                </div>

                {/* Status and Arrow */}
                <div className='flex gap-4 items-center ml-6'>
                    <Status status={data.status}/>
                    <motion.img 
                        src={rightArrow} 
                        alt="arrow"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        whileHover={{ x: 4 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default InvoiceList;