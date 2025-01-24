import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from "axios";

const Organizacije = () => {
  const [organizacije, setOrganizacije] = useState([]);

  const handleDelete = async (id) => {
    try{
      await axios.delete("http://localhost:8800/api/organizacije/obrisi/"+id, {withCredentials: true});
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
      const uzmiOrganizacije = async (e) => {
        try{
          const sveOrganizacije = await axios.get("http://localhost:8800/api/organizacije/sve", {withCredentials: true});
          setOrganizacije(sveOrganizacije.data);
        }catch(err){
          console.log(err);
        }
      }
  
      uzmiOrganizacije();
    }, [])

  return (
    <>
        <table>
              <tr>
                <th>Ime Organizacije</th>
              </tr>
              {organizacije?.map((organizacija) => {
                return (
                  <tr className='flex justify-between' key={organizacija.id}>
                    <td>{organizacija.name}</td>
                    <div className="flex gap-2">
                    <Link to={`/dashboard/organizacije/edit/${organizacija.id}`}><button className="bg-[#4169E1] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1"><img className="w-[16px]" src="../src/assets/dashboardIcons/edit.png" alt="" /></button></Link>
                      <button className="bg-[#FF0004] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1 "><img className="w-[16px]" src="../src/assets/dashboardIcons/delete.png" alt="" onClick={() => handleDelete(organizacija.id)} /></button>
                    </div>
                  </tr>
                )
              })}
        </table>
    </>
  )
}

export default Organizacije