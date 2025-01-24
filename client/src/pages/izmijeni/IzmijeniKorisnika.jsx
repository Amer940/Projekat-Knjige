import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import axios from "axios";

const IzmijeniKorisnika = () => {
  const id = useParams();
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

    useEffect(() => {
      const uzmiOrganizacije = async () => {
        try{
          const organizacije = await axios.get("http://localhost:8800/api/organizacije/sve", {withCredentials: true});
          setSveOrg(organizacije.data);
        }catch(err){
          console.log(err);
        }
      }

      const getKorisnika = async () => {
        try{
          const ans = await axios.get("http://localhost:8800/api/korisnici/dohvati/"+id.id, {withCredentials: true});
          setKorisnik({
            fullName: ans.data.fullName,
            username: ans.data.username,
            email: ans.data.email,
            password: "",
            birthdate: "",
            organisation: ans.data.organisation,
            role: ans.data.role
          })
        }catch(err){
          console.log(err);
        }
      }

      getKorisnika();
      uzmiOrganizacije();
    }, [])
  
    const handleChange = (e) => {
      setKorisnik(prev => ({...prev, [e.target.name]: e.target.value}));
      console.log(korisnik);
    }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const apiOdgovor = await axios.put("http://localhost:8800/api/korisnici/edit/"+id.id, korisnik, {withCredentials: true});
      setOdgovor(apiOdgovor.data);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <div className='container flex items-center justify-center h-screen'>
        <div className='bg-white rounded-[18px] p-12 flex flex-col min-w-[570px]'>
          <span className='text-2xl mb-10'>Promijeni informacije korisnika</span>
          <form onSubmit={handleSubmit}>
          <div className='relative'>
            <span className='left-[8px] top-[-5px] absolute px-0.5 leading-none bg-white text-[12px]'>Ime i Prezime</span>
            <input placeholder={`${korisnik.fullName}`} className='border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="fullName" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Korisničko ime</span>
            <input placeholder={`${korisnik.username}`} className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="text" name="username" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Email</span>
            <input placeholder={`${korisnik.email}`} className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="email" name="email" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Organizacija</span>
            <select required className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' name="organisation" onChange={handleChange} defaultValue={korisnik.organisation}>
              {sveOrg?.map((organizacija) => {
                return (
                  <option key={organizacija.id} value={organizacija.id}>{organizacija.name}</option> 
                )
              })}
            </select>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Datum Rođenja</span>
            <input placeholder={`${korisnik.birthdate}`} className='mt-4 border border-[#081225] rounded-lg  pt-2 pl-2 p-1 w-full' type="date" name="birthdate" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Šifra</span>
            <input className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' type="password" name="password" onChange={handleChange}/>
          </div>
          <div className='relative'>
            <span className='left-[8px] top-[10px] absolute px-0.5 leading-none bg-white text-[12px]'>Permisija</span>
            <select placeholder={`${korisnik.role}`} className='mt-4 border border-[#081225] rounded-lg pt-2 pl-2 p-1 w-full' name="role" id="" onChange={handleChange} >
                <option value="admin">Admin</option>
                <option value="korisnik">Korisnik</option>
            </select>
          </div>
          <button className='text-white mt-10 border bg-[#081225] rounded-lg p-2 w-full'>Promijeni</button>
          </form>
          <Link to="/dashboard/korisnici"><button className='text-[#081225] mt-2 border border-[#081225] rounded-lg p-2 w-full'>Vrati se na dashboard</button></Link>
          <p className='mt-2 text-red-600'>
            {odgovor}
          </p>
        </div>
      </div>
    </>
  )
}

export default IzmijeniKorisnika