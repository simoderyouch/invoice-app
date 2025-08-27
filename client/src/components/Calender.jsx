import {getDate ,formatDate} from "../utils/dateUtils";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

function CalendarComponents({ handleDate, initialDate, disable,reset }) {
  const [date, setDate] = useState( new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const handleDateChange = (date) => {
    setDate(date);
    handleDate("createAt",getDate(date));
    setShowCalendar(false);
  };
  useEffect(() => {
  
    handleDate("createAt",getDate(date));
  }, []);
  useEffect(() => {
    if (reset) {
      setDate(new Date());
      handleDate("createAt",getDate(date));
    }

  }, [reset])
  return (
    <div className="relative w-full">
      <div
        onClick={() => setShowCalendar(!showCalendar)}
        className={`opacity-${disable ? "50" : "100"}  ${
          disable && "pointer-events-none"
        } cursor-pointer w-full relative`}
      >
        <div className="flex  flex-col gap-2 ">
          <label
            htmlFor={"invoiceDate"}
            className="text-selago text-[12px] font-[400] tracking-tighter"
          >
            Invoice Date
          </label>

          <p
            style={{ opacity: disable ? 0.5 : 1 }}
            className={`  rounded-md border border-[#373c5e] rounded-md bg-ebony text-[12px] h-auto text-start font-semibold w-full p-[.8rem] pl-4  pt-[.9rem]
        text-offWhite`}
          >
            {initialDate && initialDate !== "" ? initialDate : formatDate(getDate(date))}
          </p>
        </div>
        <svg
          className="absolute top-[40px] right-4"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z"
            fill="#7E88C3 "
            fillRule="nonzero"
            opacity={disable ? ".5" : "1"}
          />
        </svg>
      </div>
      {showCalendar && (
        <div
          className="absolute z-10  rounded shadow border rounded-md border border-[#373c5e] top-full left-[-20px] mt-2"
          style={{ width: "calc(100% + 40px)" }}
        >
          <Calendar onChange={handleDateChange} value={date} />
        </div>
      )}
    </div>
  );
}

export default CalendarComponents;
