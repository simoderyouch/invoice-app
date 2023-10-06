import React, { useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import  InvoiceContext  from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"

import axios from "../utils/axios";

const Login = () => {
  const methods = useForm();
  const { setAuth, state, setState} =  useContext(InvoiceContext);
  
 
  const [error , setError] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const { email, password } = data;
      setState({isLoading: true})
      const response = await axios.post('/api/auth/login',
        JSON.stringify({ email, password }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
    console.log(JSON.stringify(response?.data));
  
    setAuth(response?.data);
    localStorage.setItem("persist", true);
    setState({isLoading: false })
      if (response?.data) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("Login failed", error);
      setState({isLoading: false ,error : error})
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000);
    }
  };

  return (
    <div className="z-40 left-0 bg-mirage2 w-full h-full absolute flex  flex-col justify-center items-center">
       <div className="bg-purple overflow-hidden  w-[6.4rem] mb-5  relative h-[6.4rem] max-[944px]:h-[5.4rem]  max-[944px]:w-[5.4rem] overlay rounded-[1.3rem] flex justify-center items-center">
          <img src={logo} alt="" className='w-[2.4rem]  z-10'/>
          </div>
      <div className="bg-ebony p-9 text-white rounded-lg flex flex-col justify-center w-[400px]">
        <h1 className="mb-8 text-[1.4rem] text-center">Welcome !</h1>
        {error && <p className="text-[12px] text-monaLisa text-center ">email or password is not valid </p> }
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleLogin)} className="flex flex-col  gap-5">
            <Input
              name="email"
              label="Email"
              rules={{
                required: "Email is required",
                 pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: " 8 characters long",
                }, 
              }}
            />

            <button type="submit" className=" py-3 text-[12px]  h-auto text-center font-semibold text-ebony w-full  rounded-3xl bg-offWhite">Login</button>
            
          </form>
          
          <p className="text-[12px] text-center mt-4">Dont have an account? <Link to={"/register"} className="font-bold  text-center text-[13px]">Sign up</Link></p>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
