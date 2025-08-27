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

function InvoiceForm({ defaultValues, isEditing, isOpen, handleClose, showNotification = () => {} }) {
 
  
  const { createInvoice, updateInvoice } = useInvoiceAPI();
  const [otherData, setOtherData] = useState({});
  const [resetItems, setResetItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  
  const {
    formState: { isValid, errors },
    watch,
    trigger,
  } = methods;

  // Watch form values for progress calculation
  const watchedValues = watch();
  
  // Calculate form progress
  useEffect(() => {
    const requiredFields = [
      'clientName', 'clientEmail', 'description',
      'senderAddress.Address', 'senderAddress.City', 'senderAddress.PostCode', 'senderAddress.Country',
      'clientAddress.Address', 'clientAddress.City', 'clientAddress.PostCode', 'clientAddress.Country'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], watchedValues)
        : watchedValues[field];
      return value && value.trim() !== '';
    });
    
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    setFormProgress(progress);
  }, [watchedValues]);

  const handleChange = (field, option) => {
    setOtherData((prevState) => ({
      ...prevState,
      [field]: option,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const data = methods.getValues();
      const updateData = { ...data, status: "Pending" };

      if (defaultValues.status === "Draft") {
        const isValid = await trigger();
        if (isValid) {
          await updateInvoice(defaultValues.id, updateData);
          handleClose();
          showNotification('Invoice updated successfully!', 'success');
        }
      } else {
        await updateInvoice(defaultValues.id, updateData);
        handleClose();
        showNotification('Invoice updated successfully!', 'success');
      }
    } catch (error) {
      console.log("Failed to update invoice:", error.message);
      showNotification('Failed to update invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (isValid) {
        await createInvoice({
          ...data,
          id: createID(),
          createAt: otherData.createAt,
          status: "Pending",
        });
        setResetItems(true);
        handleClose();
        showNotification('Invoice created and sent successfully!', 'success');
      }
    } catch (error) {
      console.log("Failed to create invoice:", error.message);
      showNotification('Failed to create invoice', 'error');
    } finally {
      setIsSubmitting(false);
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

  const handleDraft = async () => {
    setIsSubmitting(true);
    try {
      const data = methods.getValues();
      await createInvoice({
        ...data,
        id: createID(),
        createAt: otherData.createAt,
        status: "Draft",
      });
      setResetItems(true);
      handleClose();
      showNotification('Draft invoice saved successfully!', 'success');
    } catch (error) {
      console.log("Failed to save draft:", error.message);
      showNotification('Failed to save draft', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal bg-mirage2 z-10 fixed left-0 top-0 max-[944px]:w-full max-[944px]:h-full max-[944px]:pt-[8.4rem] max-[944px]:-left-[14%] overflow-y-auto p-[3rem] w-[660px] h-full"
          initial={{ opacity: 1, x: "-121%" }}
          animate={{ opacity: 1, x: "14%" }}
          exit={{ opacity: 1, x: "-121%" }}
          transition={{ duration: 0.5, ease: 'linear' }}
        >
          <FormProvider {...methods}>
            <div className="bg-mirage2">
              {/* Header with Progress */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Invoice' : 'New Invoice'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-whisper">Form Progress</span>
                  <span className="text-sm text-purple font-medium">{formProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-purple h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${formProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="space-y-8">
                  {/* Bill From Section */}
                  <motion.div 
                    className="bg-ebony rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-purple font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Bill From
                    </h4>
                    <div className="space-y-4">
                      <Input name="senderAddress.Address" label="Street Address" defaultValue={defaultValues?.senderAddress?.Address} />
                      <div className="grid grid-cols-3 gap-4">
                        <Input name="senderAddress.City" label="City" defaultValue={defaultValues?.senderAddress?.City} />
                        <Input name="senderAddress.PostCode" label="Post Code" defaultValue={defaultValues?.senderAddress?.PostCode} />
                        <Input name="senderAddress.Country" label="Country" defaultValue={defaultValues?.senderAddress?.Country} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Bill To Section */}
                  <motion.div 
                    className="bg-ebony rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <h4 className="text-purple font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Bill To
                    </h4>
                    <div className="space-y-4">
                      <Input name="clientName" label="Client's Name" defaultValue={defaultValues?.clientName} />
                      <Input name="clientEmail" label="Client's Email" defaultValue={defaultValues?.clientEmail} />
                      <Input name="clientAddress.Address" label="Street Address" defaultValue={defaultValues?.clientAddress?.Address} />
                      <div className="grid grid-cols-3 gap-4">
                        <Input name="clientAddress.City" label="City" defaultValue={defaultValues?.clientAddress?.City} />
                        <Input name="clientAddress.PostCode" label="Post Code" defaultValue={defaultValues?.clientAddress?.PostCode} />
                        <Input name="clientAddress.Country" label="Country" defaultValue={defaultValues?.clientAddress?.Country} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Invoice Details Section */}
                  <motion.div 
                    className="bg-ebony rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h4 className="text-purple font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Invoice Details
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                  </motion.div>

                  {/* Items List Section */}
                  <motion.div 
                    className="bg-ebony rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <h4 className="text-purple font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Item List
                    </h4>
                    <ItemList
                      handleItems={handleItems}
                      reset={resetItems}
                      initialItems={defaultValues && defaultValues.ItemList}
                    />
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {!isEditing ? (
                    <>
                      <button
                        type="button"
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 font-medium"
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        Discard
                      </button>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium flex items-center gap-2"
                          onClick={handleDraft}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                          )}
                          Save as Draft
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors duration-200 font-medium flex items-center gap-2"
                          disabled={isSubmitting || !isValid}
                        >
                          {isSubmitting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          )}
                          Save & Send
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-3 w-full justify-end">
                      <button
                        type="button"
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 font-medium"
                        onClick={handleClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-purple/90 transition-colors duration-200 font-medium flex items-center gap-2"
                        onClick={handleSaveChanges}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </motion.div>
              </form>
            </div>
          </FormProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InvoiceForm;
