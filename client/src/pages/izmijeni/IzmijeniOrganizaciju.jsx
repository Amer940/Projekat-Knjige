import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import axios from "axios";

const IzmijeniOrganizaciju = () => {
  const id = useParams();
  const [organizacija, setOrganizacija] = useState({
    name: ""
  })

  const handleChange = (e) => {
    setOrganizacija(prev => ({...prev, [e.target.name]: e.target.value}));
  }
  
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await axios.put("http://localhost:8800/api/organizacije/edit/"+id.id, organizacija, {withCredentials: true});
      navigate("/dashboard/organizacije");
    }catch(err){
      console.log(err);
    }
  }

useEffect(() => {
  const getOrganizacija = async () => {
    try{
      const ans = await axios.get("http://localhost:8800/api/organizacije/dohvati/"+id.id, {withCredentials: true});
      setOrganizacija({
        name: ans.data.name
      })
    }catch(err){
      console.log(err);
    }
  }
  getOrganizacija();
},[])

  return (
    <>
      <div className='container flex items-center justify-center h-screen'>
        <div className='bg-white rounded-[18px] p-12 flex flex-col min-w-[570px]'>
          <span className='text-2xl mb-10'>Promijeni ime organizacije</span>
          <form onSubmit={handleSubmit}>
            <div className='relative'>
              <span className='left-[8px] top-[-5px] absolute px-0.5 leading-none bg-white text-[12px]'>Ime Organizacije</span>
              <input placeholder={`${organizacija.name}`} className='border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="name" onChange={handleChange}/>
            </div>
            <button className='text-white mt-10 border bg-[#081225] rounded-lg p-2 w-full'>Promijeni</button>
          </form>
          <Link to="/dashboard/organizacije"><button className='text-[#081225] mt-2 border border-[#081225] rounded-lg p-2 w-full'>Vrati se na dashboard</button></Link>
        </div>
      </div>
    </>
  )
}

export default IzmijeniOrganizaciju