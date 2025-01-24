import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from "axios";

const DodajKorisnika = () => {
  const [korisnik, setKorisnik] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    birthdate: "",
    organisation: "",
    role: "korisnik"
  })
  const [sveOrg, setSveOrg] = useState();
  const [odgovor, setOdgovor] = useState();
  //stavi prvi u mapi organisation da je default
  useEffect(() => {
    const uzmiOrganizacije = async () => {
      try{
        const organizacije = await axios.get("http://localhost:8800/api/organizacije/sve", {withCredentials: true});
        setKorisnik(prev => ({...prev, organisation: organizacije.data[0].id}))
        setSveOrg(organizacije.data);
      }catch(err){
        console.log(err);
      }
    }
    
    uzmiOrganizacije();
  }, [])
  const handleChange = (e) => {
    setKorisnik(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const apiOdgovor = await axios.post("http://localhost:8800/api/korisnici/dodaj", korisnik, {withCredentials: true});
      setOdgovor(apiOdgovor.data); 
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <div className='container flex items-center justify-center h-screen'>
        <div className='bg-white rounded-[18px] p-12 flex flex-col min-w-[570px]'>
          <span className='text-2xl mb-10'>Dodavanje korisnika</span>
          <form onSubmit={handleSubmit}>
          <div className='relative'>
            <span className='left-[8px] top-[-5px] absolute px-0.5 leading-none bg-white text-[12px]'>Ime i Prezime</span>
            <input className='border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="fullName" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Korisničko ime</span>
            <input className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="username" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Email</span>
            <input className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="email" name="email" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Organizacija</span>
            <select required className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' name="organisation" onChange={handleChange} defaultValue={sveOrg?.[0]?.name}>
              {sveOrg?.map((organizacija) => {
                return (
                  <option key={organizacija.id} value={organizacija.id}>{organizacija.name}</option> 
                )
              })}
            </select>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Datum Rođenja</span>
            <input className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="date" name="birthdate" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Šifra</span>
            <input className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' type="password" name="password" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Permisija</span>
            <select className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' name="role" onChange={handleChange}>
                <option value="admin">Admin</option>
                <option selected value="korisnik">Korisnik</option>
            </select>
          </div>
          <button className='text-white mt-10 border bg-[#081225] rounded-lg p-2 w-full'>Dodaj Korisnika</button></form>
          <Link to="/dashboard/korisnici"><button className='text-[#081225] mt-2 border border-[#081225] rounded-lg p-2 w-full'>Vrati se na dashboard</button></Link>
          <p className='mt-2 text-red-600'>
            {odgovor}
          </p>
        </div>
      </div>
    </>
  )
}

export default DodajKorisnika