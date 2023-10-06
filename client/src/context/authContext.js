import React, { createContext, useState } from 'react';
import axios from '../utils/axios';


const AuthContext = createContext();

export const  AuthContextProvider = ({ children }) => {
 
  const [auth, setAuth] = useState({});
  const [state, setState] = useState({
    isLoading : false,
    error : null
  });
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
  const Register =  async({username,email, password}) => {try {
    const response = await  axios.post("/api/auth/register", {username, email, password });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
  
    
    console.log(data)
      return data
    
    // ...
  } catch (error) {
  
    console.log(error);
  }}
  
 
  const invoiceContextValue = {
    auth,
    state, setState,
    setAuth,
    persist, setPersist,
    Register
  };

  return (
    <AuthContext.Provider value={invoiceContextValue}>
      {children}
    </AuthContext.Provider>
  );
}


export default AuthContext;