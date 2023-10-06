import { useEffect, useState } from "react";
import { getDate } from "../utils/dateUtils";
const options = [
  { term: 1, label: "Net 1 Day" },
  { term: 7, label: "Net 7 Days" },
  { term: 14, label: "Net 14 Days" },
  { term: 30, label: "Net 30 Days" },
];

export function Dropdown({
  label,
  createdAt,
  handlePaymentDue,
  initialTerm,
  reset
}) {
  
  const [selectedOption, setSelectedOption] = useState(1);
  const [show, setShow] = useState(false);
 
  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setShow(false);
  };
  useEffect(() => {
    
    if (initialTerm) {
      setSelectedOption(initialTerm);
    }
  }, [initialTerm]);
  
  useEffect(() => {
    const dueDate =  {date : getDate(createdAt,selectedOption ) , term : selectedOption};
    handlePaymentDue(dueDate);
  }, [handlePaymentDue, selectedOption, createdAt]);
  useEffect(() => {
    if (reset) {
      setSelectedOption(1);
    }

  }, [reset])
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-selago text-[12px] font-[400] tracking-tighter">
        {label}
      </label>

      <div className="relative">
        <div
          onClick={() => setShow(!show)}
          readOnly
          className="bg-ebony text-offWhite  h-auto text-start font-semibold text-[12px] w-full rounded-md p-[.8rem] pl-4 pt-[.9rem] cursor-pointer"
        >
          {options.find((option) => option.term === selectedOption)?.label}
        </div>

        <div
          className={`absolute transition right-4 ${
            show ? "rotate-180" : "rotate-30"
          } top-[20px] pointer-events-none`}
        >
          <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1l4.228 4.228L9.456 1"
              stroke="#7C5DFA"
              strokeWidth="2"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
        </div>

        <ul
          className={`absolute rounded-md  shadow-md bg-ebony mt-4  w-full ${
            show ? "block" : "hidden"
          }  py-2  z-10`}
        >
          {options.map((option) => (
            <li
              key={option.term}
              className="p-[.9rem] pl-[1.5rem] cursor-pointer text-offWhite font-semibold text-[12px] hover:text-purple"
              onClick={() => handleOptionChange(option.term)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


