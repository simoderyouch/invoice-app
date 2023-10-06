import { useFormContext } from "react-hook-form";

function Input({ name, label, rules, defaultValue, ...other }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
   // Split the field name into nested levels
  const fieldNames = name.split(".");
  let error = null;

  // Traverse the errors object to find the corresponding error message
  let currentErrorObject = errors;
  for (const fieldName of fieldNames) {
    if (currentErrorObject && fieldName in currentErrorObject) {
      currentErrorObject = currentErrorObject[fieldName];
    } else {
      // If any level of the field is undefined in errors, set error to null
      error = null;
      break;
    }
  }

  // If currentErrorObject is a string, it contains the error message
 
    error = currentErrorObject;
  
  
  return (
    <div className="flex  flex-col gap-2">
      <div className="flex justify-between">
        <label
          htmlFor={name}
          className="text-selago text-[12px] font-[400] tracking-tighter"
        >
          {label}
        </label>

        {error && (
          <span className="text-[12px] text-monaLisa">
            {error.message}
          </span>
        )}
      </div>
      <input
        className={`  rounded-md bg-ebony text-[12px] h-auto text-start font-semibold w-full p-[.8rem] pl-4  pt-[.9rem]
        text-offWhite`}
        defaultValue={defaultValue}
        id={name}
        {...register(name, rules)}
        {...other}
      />
    </div>
  );
}

export default Input;
