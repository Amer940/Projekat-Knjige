import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import axios from "axios";

const Knjige = () => {
  const [knjige, setKnjige] = useState([]);
  const [odgovor, setOdgovor] = useState();

  const handleDelete = async (id) => {
    try{
      const apiOdgovor = await axios.delete("http://localhost:8800/api/knjige/obrisi/"+id, {withCredentials: true});
      if(apiOdgovor.status == 200) window.location.reload();
    }catch(err){
      console.log(err);
      setOdgovor(err.response.data);
    }
  }
  console.log(odgovor)
  useEffect(() => {
      const uzmiKnjige = async (e) => {
        try{
          const sveKnjige = await axios.get("http://localhost:8800/api/knjige/sve", {withCredentials: true});
          setKnjige(sveKnjige.data);
        }catch(err){
          console.log(err);
        }
      }
  
      uzmiKnjige();
    }, [])
  
  return (
    <>
        <p className='mt-2 text-red-600 text-sm'>
            {odgovor}
        </p>
        <table>
              <tr>
                <th>Ime Knjige</th>
                <th>Na Stanju</th>
                <th>Iznajmljenih</th>
              </tr>
              {knjige?.map((knjiga) => {
                return (
                  <tr key={knjiga.id} className='relative'>
                    <td>{knjiga.name}</td>
                    <td>{knjiga.quantity}</td>
                    <td>{knjiga.rentedNum}</td>
                    <div className="flex gap-2 absolute right-2 bottom-[-1.5px]">
                    <Link to={`/dashboard/knjige/edit/${knjiga.id}`}><button className="bg-[#4169E1] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1"><img className="w-[16px]" src="../src/assets/dashboardIcons/edit.png" alt="" /></button></Link>
                      <button className="bg-[#FF0004] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1 "><img className="w-[16px]" src="../src/assets/dashboardIcons/delete.png" alt="" onClick={() => handleDelete(knjiga.id)}/></button>
                    </div>
                  </tr>
                )
              })}
        </table>
    </>
  )
}

export default Knjige