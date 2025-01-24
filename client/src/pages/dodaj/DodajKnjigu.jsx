import React, { useState } from 'react'
import { Link } from 'react-router'
import axios from "axios"

const DodajKnjigu = () => {
  const [img, setImg] = useState(null);
  const [knjiga, setKnjiga] = useState({
    name: "",
    quantity: ""
  })
  const [odgovor, setOdgovor] = useState();

  const handleChange = (e) => {
    setKnjiga(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const upload = async (file) => {
    try{
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("http://localhost:8800/api/upload", formData, {withCredentials: true});
        return res.data;
    }catch(err){
        console.log(err);
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let knjigaUrl;

    try{
      knjigaUrl = await upload(img);
      const apiOdgovor = await axios.post("http://localhost:8800/api/knjige/dodaj", {knjiga, knjigaUrl}, {withCredentials: true});
      setOdgovor(apiOdgovor.data)
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <div className='container flex items-center justify-center h-screen'>
        <div className='bg-white rounded-[18px] p-12 flex flex-col min-w-[570px]'>
          <span className='text-2xl mb-10'>Dodavanje knjige</span>
          <form onSubmit={handleSubmit}>
            <div className='relative'>
              <span className='left-[8px] top-[-5px] absolute px-0.5 leading-none bg-white text-[12px]'>Ime Knjige</span>
              <input className='border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="name" onChange={handleChange}/>
            </div>
            <div className='relative'>
              <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Stanje</span>
              <input className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' type="number" name="quantity" onChange={handleChange}/>
            </div>
            <div className='relative'>
              <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Dodaj sliku</span>
              <input required className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' type="file" onChange={e=>setImg(e.target.files[0])}/>
            </div>
            <button className='text-white mt-10 border bg-[#081225] rounded-lg p-2 w-full'>Dodaj Knjigu</button>
          </form>
          <Link to="/dashboard/knjige"><button className='text-[#081225] mt-2 border border-[#081225] rounded-lg p-2 w-full'>Vrati se na dashboard</button></Link>
          <p className='mt-2 text-red-600'>
            {odgovor}
          </p>
        </div>
      </div>
    </>
  )
}

export default DodajKnjigu