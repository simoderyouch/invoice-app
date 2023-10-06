
import moonSvg from '../assets/icon-moon.svg'
import logo from '../assets/logo.svg'
import profile from '../assets/image-avatar.jpg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from "../hooks/useLogout"
import { useToggle } from '../hooks/useToggle';
function SideBar() {
  const [isOpen, setOpen] = useToggle(false)
  const logout = useLogout()
  const navigate = useNavigate()
   const handleLogout = () => {
        logout()
         navigate("/login")
         setOpen.off()
   }
    return ( 
        <div className="w-[6.4rem]  bg-ebony  h-[100vh] min-[944px]:rounded-r-[1.3rem] max-[944px]:w-full  max-[944px]:flex-row  flex flex-col max-[944px]:h-[5.4rem] justify-between z-30 relative">
          <div className="bg-purple overflow-hidden  w-[6.4rem]  relative h-[6.4rem] max-[944px]:h-[5.4rem]  max-[944px]:w-[5.4rem] overlay rounded-r-[1.3rem] flex justify-center items-center">
          <img src={logo} alt="" className='w-[2.4rem]  z-10'/>
          </div>
          <div className='flex flex-col max-[944px]:flex-row justify-center items-center'>
           
            <div className='br'></div>
            <button className=' min-[944px]:py-6 px-6' onClick={setOpen.toggle} >
            <img src={profile} alt="" className='rounded-full w-10 max-[944px]:w-8'/>
            
            </button> 
           {isOpen && <button onClick={handleLogout} className='text-offWhite font-medium text-[12px] py-3 px-[2rem] rounded-lg absolute bg-ebony min-[944px]:-right-[8rem] max-[944px]:top-[6rem]  max-[944px]:right-[3rem] min-[944px]:bottom-9 z-40'>Logout</button>
           }
          </div>
        </div>
      );
    }
export default SideBar
