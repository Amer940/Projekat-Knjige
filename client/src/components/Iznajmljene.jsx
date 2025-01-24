import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Iznajmljene = () => {
  const [iznajmljene, setIznajmljene] = useState([]);

  const handleDelete = async (id) => {
    try{
      await axios.delete("http://localhost:8800/api/iznajmljeno/obrisi/"+id, {withCredentials: true});
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
      const uzmiIznajmljene = async () => {
        try{
          const sevIznajmljene = await axios.get("http://localhost:8800/api/iznajmljeno/sve", {withCredentials: true});
          setIznajmljene(sevIznajmljene.data);
        }catch(err){
          console.log(err);
        }
      }
  
      uzmiIznajmljene();
    }, [])

  return (
    <>
        <table>
              <tr>
                <th>Ime i Prezime</th>
                <th>Iznajmljena Knjiga</th>
                <th>Datum Iznajmljivanja</th>
                <th>Datum Vraćanja</th>
              </tr>
              {iznajmljene?.map((iznajmljena) => {
                return(
                  <tr className='relative'>
                    <td>{iznajmljena.fullName}</td>
                    <td>{iznajmljena.name}</td>
                    <td>{iznajmljena.rentDate.split("T")[0]}</td>
                    <td>{iznajmljena.rentExpireDate.split("T")[0]}</td>
                    <div className="flex gap-2 absolute right-2 bottom-[-1.5px]">
                      <button className="bg-[#FF0004] rounded-lg w-[32px] h-[32px] flex items-center justify-center my-1 "><img className="w-[16px]" src="../src/assets/dashboardIcons/delete.png" alt="" onClick={() => handleDelete(iznajmljena.id)}/></button>
                    </div>
                  </tr>
                )
              })}
        </table>
    </>
  )
}

export default Iznajmljene