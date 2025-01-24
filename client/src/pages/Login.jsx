import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({
      username: "",
      password: ""
    })

    const handleChange = (e) => {
      setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try{
        const token = await axios.post("http://localhost:8800/api/auth/login", inputs, {withCredentials: true});
        localStorage.setItem("token", token.data)        
      }catch(err){
        console.log(err);
      }

      try{
        const admin = await axios.get("http://localhost:8800/api/korisnici/logged", {
          withCredentials: true,
      });
        if(admin.data[0]) {
          navigate("/dashboard/korisnici")
        }else navigate("/");
      }catch(err){
        console.log(err);
      }
    }

  return (
    <>
      <div className='container flex items-center justify-center h-screen'>
        <div className='bg-white rounded-[18px] p-12 flex flex-col min-w-[570px]'>
          <span className='text-2xl mb-10'>Log In</span>
          <form onSubmit={handleSubmit}>
            <div className='relative'>
              <span className='left-[8px] top-[-5px] absolute px-0.5 leading-none bg-white text-[12px]'>Korisničko ime</span>
              <input required className='border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="username" onChange={handleChange}/>
            </div>
            <div className='relative'>
              <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Šifra</span>
              <input required className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' type="password" name="password" onChange={handleChange} />
            </div>
            <button type="submit" className='text-white mt-10 border bg-[#081225] rounded-lg p-2 w-full'>Submit</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login