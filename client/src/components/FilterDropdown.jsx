import React, { useEffect, useState } from "react";
import useInvoiceAPI from "../context/useInvoiceAPI";
import { useToggle } from "../hooks/useToggle";

export const FilterDropdown = ({}) => {
    
  const {  fetchInvoices } = useInvoiceAPI();
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
  
useEffect(()=>{
    fetchInvoices(filterParams)
},[filterParams])
  return (
    <div className="relative h-full">
      <button
        className="flex gap-4 items-center h-full cursor-pointer"
        onClick={filterDropMenuHandler.toggle}
      >
        <h4 className="text-[0.84rem]">Filter by status</h4>
       
        <svg width="11" className={`w-3 ${filterDropMenu ? 'rotate-180' : 'rotate-0'}`} height="7" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>
      {filterDropMenu && (
        <div className="bg-ebony absolute  top-full justify-between   absolute  z-20 w-48 h-36 -translate-x-2/4 flex flex-col shadow-[0_10px_20px_rgba(0,0,0,0.25)] mt-6 p-6 rounded-lg left-[30%] top-full;
        ">
         <div className="root">
            <input
              type="checkbox"
              name="Draft"
              checked={filterParams.includes("Draft")}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="draft">Draft</label>
          </div>
          <div className="root">
            <input
              type="checkbox"
              name="Pending"
              checked={filterParams.includes("Pending")}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="pending">Pending</label>
          </div>
          <div className="root">
            <input
              type="checkbox"
              name="Paid"
              checked={filterParams.includes("Paid")}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="paid">Paid</label>
          </div>
        </div>
      )}
    </div>
  );
};
