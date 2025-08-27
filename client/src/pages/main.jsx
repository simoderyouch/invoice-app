
import plusIcon from "../assets/icon-plus.svg";
import useInvoiceAPI from "../context/useInvoiceAPI"
import { useState, useEffect, useContext } from "react";
import InvoiceForm from "../components/invoiceForm";
import InvoiceList from "../components/invoiceList";
import InvoiceContext from "../context/invoiceContext";
import { useToggle } from "../hooks/useToggle";
import { FilterDropdown } from "../components/FilterDropdown";
import { motion, AnimatePresence } from 'framer-motion';

function Main({ showNotification = () => {} }) {
  
  const [isFormModalOpen, setFormModalOpen] = useToggle(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { fetchInvoices } = useInvoiceAPI();
  const { invoices, state } = useContext(InvoiceContext);

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter and sort invoices
  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedInvoices = filteredInvoices?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createAt) - new Date(a.createAt);
      case 'oldest':
        return new Date(a.createAt) - new Date(b.createAt);
      case 'amount-high':
        return b.total - a.total;
      case 'amount-low':
        return a.total - b.total;
      case 'name':
        return a.clientName?.localeCompare(b.clientName);
      default:
        return 0;
    }
  });

  const getStatusCounts = () => {
    const counts = { Draft: 0, Pending: 0, Paid: 0 };
    invoices?.forEach(invoice => {
      counts[invoice.status] = (counts[invoice.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="w-full overflow-y-scroll max-[944px]:h-[100vh] bg-mirage2 text-white relative">
      <div className="m-auto" style={{ width: "clamp(20rem,87.5%,1000px)" }}>
        {/* Header Section */}
        <motion.div 
          className="flex justify-between items-center mt-[5.5rem]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-whisper text-sm">
              There are {invoices?.length || 0} total invoices
            </p>
            {/* Status Summary Cards */}
            <div className="flex gap-4 mt-4">
              <div className="bg-ebony rounded-lg p-3 min-w-[80px] text-center">
                <div className="text-2xl font-bold text-purple">{statusCounts.Draft}</div>
                <div className="text-xs text-whisper">Draft</div>
              </div>
              <div className="bg-ebony rounded-lg p-3 min-w-[80px] text-center">
                <div className="text-2xl font-bold text-orange-400">{statusCounts.Pending}</div>
                <div className="text-xs text-whisper">Pending</div>
              </div>
              <div className="bg-ebony rounded-lg p-3 min-w-[80px] text-center">
                <div className="text-2xl font-bold text-green-400">{statusCounts.Paid}</div>
                <div className="text-xs text-whisper">Paid</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 items-center relative">
            <button
              className="bg-purple text-white flex justify-center items-center gap-4 p-3 rounded-3xl hover:bg-purple/90 transition-colors duration-200 shadow-lg"
              onClick={setFormModalOpen.toggle}
            >
              <div className="flex justify-center items-center bg-white rounded-full p-2">
                <img src={plusIcon} alt="" className="w-4 h-4" />
              </div>
              <h4 className="mr-2 font-semibold">New Invoice</h4>
            </button>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="flex flex-col gap-4 mt-8 p-6 bg-ebony rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search invoices by client name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-mirage2 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple focus:outline-none transition-colors duration-200"
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-mirage2 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-purple focus:outline-none transition-colors duration-200 appearance-none cursor-pointer pr-10"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
                <option value="name">Client Name</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Filter Dropdown */}
            <FilterDropdown />
          </div>

          {/* Active Filters Display */}
          {(searchTerm || sortBy !== 'newest') && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-whisper">Active filters:</span>
              {searchTerm && (
                <span className="bg-purple/20 text-purple px-3 py-1 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {sortBy !== 'newest' && (
                <span className="bg-purple/20 text-purple px-3 py-1 rounded-full text-sm">
                  Sort: {sortBy.replace('-', ' ')}
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Invoices List */}
        <div className="flex flex-col mt-8 gap-4">
          {state.isLoading ? (
            <motion.div 
              className="flex justify-center items-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
            </motion.div>
          ) : sortedInvoices?.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">No invoices found</h3>
              <p className="text-whisper">
                {searchTerm ? `No invoices match "${searchTerm}"` : 'Create your first invoice to get started'}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {sortedInvoices?.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <InvoiceList data={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Invoice Form Modal */}
        <InvoiceForm
          isEditing={false}
          isOpen={isFormModalOpen}
          handleClose={setFormModalOpen.off}
          showNotification={showNotification}
        />
      </div>
    </div>
  );
}

export default Main;
