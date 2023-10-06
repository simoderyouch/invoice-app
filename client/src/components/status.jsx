import { useEffect, useState } from 'react';
export default function Status({status}) {
    const [color, setColor] = useState({
        second: "rgba(255,143,0,.0571)",
        main: "#ff8f00",
    })
    useEffect(()=>{
       
        if (status === "Pending") {
            setColor({
              second: "rgba(255,143,0,.0571)",
              main: "#ff8f00",
            });
          } else if (status === "Paid") {
            setColor({
              second: "rgba(51,214,159,.0571)",
              main: "#33d69f",
            });
          } else if (status=== "Draft") {
            setColor({
              second: "rgba(223,227,250,.0571)",
              main: "#fff",
            });
        }
    },[status])
    
    const stateStyle = {
        position: "relative",
        backgroundColor: color.second,
        color: color.main,
        fontSize: ".80rem",
        fontWeight: "bold",
        display:"flex",
        height: "2.8rem",
        minWidth: "7rem",
        gap: "0.6rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius:" 0.4rem",
      };
    
      const stateIndicatorStyle = {
        content: '',
       
        width: '0.6rem',
        height: '0.6rem',
        borderRadius: '50%',
        backgroundColor: color.main,
        
      };
    return (
        <div style={stateStyle} className='state'> 
        <span style={stateIndicatorStyle}></span>
          <p>{status}</p>
      
        </div>
    );

}