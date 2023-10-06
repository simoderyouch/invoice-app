import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../components/input";
import { Dropdown } from "./Dropdown";
import "react-calendar/dist/Calendar.css";
import "../global.css";
import CalendarComponents from "./Calender";
import ItemList from "./ItemList";
import { useEffect, useState } from "react";
import useInvoiceAPI from "../context/useInvoiceAPI";
import { createID } from "../utils/createId";
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object().shape({
  clientName: yup.string().required("Name is required"),
  clientEmail: yup
    .string()
    .email("Please enter a valid email format !")
    .required("Email is required please !"),
  senderAddress: yup.object().shape({
    Address: yup.string().required("Can't be empty"),
    City: yup.string().required("Can't be empty"),
    PostCode: yup.string().required("Can't be empty"),
    Country: yup.string().required("Can't be empty"),
  }),
  clientAddress: yup.object().shape({
    Address: yup.string().required("Can't be empty"),
    City: yup.string().required("Can't be empty"),
    PostCode: yup.string().required("Can't be empty"),
    Country: yup.string().required("Can't be empty"),
  }),
  description: yup.string().required("Description is required"),
});

function InvoiceForm({ defaultValues, isEditing, isOpen, handleClose }) {
 
  
  const {  createInvoice ,updateInvoice} = useInvoiceAPI();
  const [otherData, setOtherData] = useState({});
  const [resetItems, setResetItems] = useState(false);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  const {
    formState: { isValid },
  
  } = methods;

  const handleChange = (field, option) => {
    setOtherData((prevState) => ({
      ...prevState,
      [field]: option,
    }));

    console.log(otherData);
  };
  const handleSaveChanges = async () => {
    const data = methods.getValues();
    console.log(data);
  
  const updateData = {  ...data,

        status: "Pending",}

  if (defaultValues.status === "Draft") {
    methods.trigger().then((isValid) => {
      if (isValid) {
        Promise.all([
          updateInvoice(defaultValues.id, updateData),
        
        ])
          .then(() => {
            handleClose();
          })
          .catch((error) => {
            console.log("Failed to update invoice:", error.message);
          });
      }
    });
  } else {
    try {
      await Promise.all([
        updateInvoice(defaultValues.id, updateData),
      
      ]);
      handleClose();
    } catch (error) {
      console.log("Failed to update invoice:", error.message);
    }
  } 
  };

  const onSubmit = (data) => {
    if (isValid) {
      createInvoice({
        ...data,
        id: createID(),
        createAt: otherData.createAt,
        status: "Pending",
      });
      setResetItems(true);
      handleClose();

  
    }
  };

  const handlePaymentTerm = (PaymentTerm) => {
    methods.setValue("paymentTerm", PaymentTerm.term);
    methods.setValue("paymentDue", PaymentTerm.date);
  };
  const handleItems = (itemsparam) => {
    methods.setValue("ItemList", itemsparam);
    let total = itemsparam?.reduce((sum, obj) => sum + obj.total, 0);
    methods.setValue("total", total);
  };

  const handleDraft = () => {
    const data = methods.getValues();

    console.log(data);
    createInvoice({
      ...data,
      id: createID(),
      createAt: otherData.createAt,
      status: "Draft",
    });
    setResetItems(true);
    handleClose();
 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal bg-mirage2  z-10 fixed left-0 top-0 max-[944px]:w-full max-[944px]:h-full max-[944px]:pt-[8.4rem] max-[944px]:-left-[14%] overflow-y-auto  p-[3rem] w-[660px] h-full"
          initial={{ opacity: 1, x: "-121%" }}
          animate={{ opacity: 1, x: "14%" }}
          exit={{ opacity: 1, x: "-121%" }}
          transition={{ duration: 0.5, ease: 'linear' }}
        >
          <FormProvider {...methods}>
      <div
        className={`bg-mirage2 `}
      >
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <h4 className="text-purple">Bill From</h4>
            <Input name="senderAddress.Address" label="Street Address"  defaultValue={defaultValues?.senderAddress?.Address}/>
            <div className="flex gap-6">
              <Input name="senderAddress.City" label="City"   defaultValue={defaultValues?.senderAddress?.City}/>
              <Input name="senderAddress.PostCode" label="Post Code"  defaultValue={defaultValues?.senderAddress?.PostCode}/>
              <Input name="senderAddress.Country" label="Country"  defaultValue={defaultValues?.senderAddress?.Country}/>
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-[4rem]">
            <h4 className="text-purple">Bill To</h4>
            <Input name="clientName" label="Client's Name"  defaultValue={defaultValues?.clientName}/>

            <Input name="clientEmail" label="Client's Email"  defaultValue={defaultValues?.clientEmail} />
            <Input name="clientAddress.Address" label="Street Address"  defaultValue={defaultValues?.clientAddress?.Address} />
            <div className="flex gap-6">
              <Input name="clientAddress.City" label="City" defaultValue={defaultValues?.clientAddress?.City}/>
              <Input name="clientAddress.PostCode" label="Post Code" defaultValue={defaultValues?.clientAddress?.PostCode} />
              <Input name="clientAddress.Country" label="Country"  defaultValue={defaultValues?.clientAddress?.Country}/>
            </div>
          </div>

          <div className="mt-[3rem] flex flex-col gap-6">
            <div className="flex gap-6 items-center">
              <CalendarComponents
                disable={isEditing}
                handleDate={handleChange}
                initialDate={defaultValues?.createAt}
                reset={resetItems}
              />
              <Dropdown
                initialTerm={defaultValues?.paymentTerm}
                reset={resetItems}
                label="Payment Terms"
                createdAt={otherData.createAt}
                handlePaymentDue={handlePaymentTerm}
              />
            </div>
            <Input
              name="description"
              label="Project Description"
              placeholder="e.g. Graphic Design Service"
              defaultValue={defaultValues?.description}
            />
          </div>
          <ItemList
            handleItems={handleItems}
            reset={resetItems}
            initialItems={defaultValues && defaultValues.ItemList}
          />
          {!isEditing ? (
            <div className="flex mt-[4rem] justify-between [&>button]:pt-4 [&>button]:pb-3 [&>button]:rounded-3xl    text-selago text-[12px] font-[600] tracking-tighter">
              <button
                type="button"
                className="bg-white  w-[6rem] text-purple"
                onClick={handleClose}
              >
                Discard
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="bg-otherDark rounded-3xl w-[8rem]"
                  onClick={handleDraft}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="bg-purple w-[8rem] rounded-3xl"
                >
                  Save & Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex mt-[4rem] justify-end gap-4 [&>button]:pt-4 [&>button]:pb-3 [&>button]:rounded-3xl    text-selago text-[12px] font-[600] tracking-tighter">
              <button
                type="button"
                className="bg-ebony rounded-3xl w-[6rem]"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-purple w-[8rem] rounded-3xl"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
        </motion.div>
      )}
    </AnimatePresence>
   
  );
}

export default InvoiceForm;
