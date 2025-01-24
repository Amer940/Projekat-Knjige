import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import axios from "axios";

const Korisnici = () => {
  const [korisnici, setKorisnici] = useState([]);
  const [ans, setAns] = useState();

  const handleDelete = async (id) => {
    try{
      const apiOdgovor = await axios.delete("http://localhost:8800/api/korisnici/obrisi/"+id, {withCredentials: true});
      window.location.reload();
    }catch(err){
      console.log(err);
      setAns(err.response.data);
    }
  }

  useEffect(() => {
      const uzmiKorisnike = async (e) => {
        try{
          const sviKorisnici = await axios.get("http://localhost:8800/api/korisnici/svi", {withCredentials: true});
          setKorisnici(sviKorisnici.data);
        }catch(err){
          console.log(err);
        }
      }
  
      uzmiKorisnike();
    }, [])
    console.log(ans)
  return (
    <div>
        
        {ans && 
          <p className='mt-2 text-red-600 text-sm'>
            {ans}
          </p>}
        <table>
              <tr>
                <th>Ime i Prezime</th>
                <th>Korisničko ime</th>
                <th>Email</th>
                <th>Organizacija</th>
                <th>Datum Rođenja</th>
                <th>Permisija</th>
              </tr>
              {korisnici?.map((korisnik) => {
                return (
                  <tr key={korisnik.id}>
                    <td>{korisnik.fullName}</td>
                    <td>{korisnik.username}</td>
                    <td>{korisnik.email}</td>
                    <td>{korisnik.organisation}</td>
                    <td>{korisnik.birthdate.split("T")[0]}</td>
                    <td>{korisnik.role}</td>
                    <div className="flex gap-2 ">
                      <Link to={`/dashboard/korisnici/edit/${korisnik.id}`}><button className="bg-[#4169E1] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1"><img className="w-[16px]" src="../src/assets/dashboardIcons/edit.png" alt="" /></button></Link>
                      <button className="bg-[#FF0004] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1 "><img className="w-[16px]" src="../src/assets/dashboardIcons/delete.png" alt="" onClick={() => handleDelete(korisnik.id)}/></button>
                    </div>
                  </tr>
                  )
              })}
        </table> 
      
    </div>
  )
}

export default Korisnici