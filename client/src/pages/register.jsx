import React, { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import Input from "../components/input";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"
import AuthContext from "../context/authContext";
const Login = () => {
  const methods = useForm();
  const { Register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      const {username, email, password } = data;
    
      const response = await Register({username,email, password});
        console.log(response)

        navigate("/login", { replace: true });
      
    } catch (error) {
      console.log("Register failed", error);
    }
  };

  return (
    <div className="z-40 left-0 bg-mirage2 w-full h-full absolute flex  flex-col justify-center items-center">
       <div className="bg-purple overflow-hidden  w-[6.4rem] mb-5  relative h-[6.4rem] max-[944px]:h-[5.4rem]  max-[944px]:w-[5.4rem] overlay rounded-[1.3rem] flex justify-center items-center">
          <img src={logo} alt="" className='w-[2.4rem]  z-10'/>
          </div>
      <div className="bg-ebony p-9 text-white rounded-lg flex flex-col justify-center w-[400px]">
        <h1 className="mb-4 text-[1.4rem] text-center">Sign Up</h1>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleRegister)} className="flex flex-col  gap-5">
          <Input
              name="username"
              label="Username"
            
              rules={{
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: " 4 characters long",
                }, 
              }}
            />
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
            <button type="submit" className=" py-3 text-[12px]  h-auto text-center font-semibold text-ebony w-full  rounded-3xl bg-offWhite">CREATE ACCOUNT</button>
            
          </form>
          <p className="text-[12px] text-center mt-4">Already have an account? <Link to={"/login"} className="font-bold  text-center text-[13px]">Sign in</Link></p>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
