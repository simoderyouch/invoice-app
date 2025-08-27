import React, { useEffect, useState } from "react";
import useInvoiceAPI from "../context/useInvoiceAPI";
import { useToggle } from "../hooks/useToggle";
import { motion, AnimatePresence } from 'framer-motion';

export const FilterDropdown = ({}) => {
    
  const { fetchInvoices } = useInvoiceAPI();
  const [filterDropMenu, filterDropMenuHandler] = useToggle(false);
  const [filterParams, setFilterParams] = useState([]);

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const checkboxName = event.target.name;

    if (event.target.checked) {
      // Checkbox is checked, add to filterParams
      setFilterParams([...filterParams, checkboxName]);
    } else {
      // Checkbox is unchecked, remove from filterParams
      setFilterParams(filterParams.filter((param) => param !== checkboxName));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterParams([]);
  };
  
  useEffect(() => {
    fetchInvoices(filterParams);
  }, [filterParams]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'text-gray-400';
      case 'Pending':
        return 'text-orange-400';
      case 'Paid':
        return 'text-green-400';
      default:
        return 'text-white';
    }
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

  return (
    <div className="relative h-full">
      <button
        className="flex gap-3 items-center h-full cursor-pointer bg-mirage2 text-white px-4 py-3 rounded-lg border border-gray-600 hover:border-purple focus:outline-none transition-colors duration-200"
        onClick={filterDropMenuHandler.toggle}
      >
        <svg width="16" height="16" className="text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm font-medium">Filter by status</span>
        {filterParams.length > 0 && (
          <span className="bg-purple text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
            {filterParams.length}
          </span>
        )}
        <svg 
          width="11" 
          className={`w-4 transition-transform duration-200 ${filterDropMenu ? 'rotate-180' : 'rotate-0'}`} 
          height="7" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>
      
      <AnimatePresence>
        {filterDropMenu && (
          <motion.div 
            className="absolute top-full left-0 z-20 w-64 bg-ebony shadow-2xl mt-2 p-4 rounded-lg border border-gray-600"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Filter by Status</h3>
              {filterParams.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-purple hover:text-purple/80 transition-colors duration-200"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              {['Draft', 'Pending', 'Paid'].map((status) => (
                <motion.label
                  key={status}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-mirage2 transition-colors duration-200"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      name={status}
                      checked={filterParams.includes(status)}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                      filterParams.includes(status) 
                        ? 'border-purple bg-purple' 
                        : 'border-gray-500'
                    }`}>
                      {filterParams.includes(status) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{getStatusIcon(status)}</span>
                    <span className={`text-sm font-medium ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </div>
                  {filterParams.includes(status) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-purple rounded-full"
                    />
                  )}
                </motion.label>
              ))}
            </div>

            {/* Active filters summary */}
            {filterParams.length > 0 && (
              <motion.div 
                className="mt-4 pt-4 border-t border-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xs text-whisper mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-1">
                  {filterParams.map((param) => (
                    <span
                      key={param}
                      className="bg-purple/20 text-purple px-2 py-1 rounded text-xs"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
