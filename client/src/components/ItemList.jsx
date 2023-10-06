import { useEffect, useState } from "react";

function ItemList({ handleItems, initialItems, reset }) {



  const [items, setItems] = useState([{ name: "New Item", quantity: 0, total: 0, price: 0 }])
  const handleItemAdd = () => {
    setItems((prev) => [
      ...prev,
      { name: "New Item", quantity: 0, total: 0, price: 0 },
    ]);
  };

  useEffect(() => {

    setItems((initialItems && initialItems.length !== 0) ? initialItems : [{ name: "New Item", quantity: 0, total: 0, price: 0 }])
  }, [initialItems])
  useEffect(() => {

    handleItems(items);

  }, [handleItems, items])
  useEffect(() => {
    if (reset) {
      setItems([{ name: "New Item", quantity: 0, total: 0, price: 0 }])
    }

  }, [reset])
  const handleNameChange = (e, index) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (index === i) {
          return {
            ...item,
            name: e.target.value,
          };
        }
        return item;
      })
    );
  };
  const handleItemDelete = (i) => {
    if (items.length !== 1) {
      setItems((prev) => prev.filter((item, index) => index !== i));
    } else {
      setItems([{ name: "New Item", quantity: 0, total: 0, price: 0 }])
    }

  };

  const handleQuantityChange = (e, i) => {
    const value = +e.target.value;
    if (isNaN(value)) return;
    setItems((prev) =>
      prev.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            quantity: value,
            total: value * item.price,
          };
        } else {
          return item;
        }
      })
    );
  };

  const handlePriceChange = (e, i) => {
    const value = +e.target.value;
    if (isNaN(value)) return;
    setItems((prev) =>
      prev.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            price: value,
            total: value * item.quantity,
          };
        }

        return item;
      })
    );
  };



  return (
    <div className="w-full mt-8">
      <h1 className="text-shipCove text-[1.2rem]">Item List</h1>
      <div>
        <div className="mb-4 mt-4 flex w-full gap-4 items-center text-selago text-[12px] font-[400] tracking-tighter">
          <p className="w-full">Item Name</p>
          <p className=" w-[20%]">Qty</p>
          <p className="w-[35%]">Price</p>
          <p className="w-[35%]">Total</p>
        </div>
        <div className="flex gap-4 flex-col w-full">

          {items.map((item, i) => {
            return <div key={i} className="flex w-full  gap-4 items-center">
              <input type="text" className="w-full rounded-md bg-ebony text-[12px] h-auto text-start font-semibold  p-[.8rem] pl-4  pt-[.9rem]
       text-offWhite" value={item.name} onChange={(e) => handleNameChange(e, i)} />
              <input type="text" className=" w-[14%] rounded-md bg-ebony text-[12px] h-auto text-center font-semibold  p-[.8rem] pl-4  pt-[.9rem]
       text-offWhite" value={item.quantity} onChange={(e) => handleQuantityChange(e, i)} />
              <input type="text" className=" w-[35%] rounded-md bg-ebony text-[12px] h-auto text-start font-semibold  p-[.8rem] pl-4  pt-[.9rem]
       text-offWhite" value={item.price} onChange={(e) => handlePriceChange(e, i)} />
              <p className=" w-[20%] text-[12px] h-auto text-start font-semibold text-offWhite">{item.total}</p>
              <button onClick={() => handleItemDelete(i)}>
                <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z" fill="#888EB0" fillRule="nonzero" /></svg>
              </button>
            </div>
          })}
        </div>
        <div className=" mt-5 py-3 text-[12px] gap-2 h-auto text-start font-semibold text-offWhite w-full flex items-center justify-center rounded-3xl bg-ebony" onClick={handleItemAdd}>
          <svg width="11" fill="white" height="11" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
              fillRule="nonzero"
            />
          </svg>
          Add New Item
        </div>

      </div>
    </div>
  );
}

export default ItemList