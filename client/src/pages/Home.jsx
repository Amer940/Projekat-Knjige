import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';

const Home = () => {
    const [knjige, setKnjige] = useState([]);
    const [user, setUser] = useState();
    const [duration, setDuration] = useState();
    const [odgovor, setOdgovor] = useState();
    const [show, setShow] = useState(false);
    const [mojeKnjige, setMojeKnjige] = useState();

    useEffect(() => {
        const uzmiInfo = async (e) => {
          try{
            const sveKnjige = await axios.get("http://localhost:8800/api/knjige/sve", {
              withCredentials: true,
            });
            setKnjige(sveKnjige.data);
          }catch(err){
            console.log(err);
          }

          try{
            const userInfo = await axios.get("http://localhost:8800/api/korisnici/logged", {
              withCredentials: true,
            });
            setUser(userInfo.data);
          }catch(err){
            console.log(err);
          }
        }
    
        uzmiInfo();
      }, [])
    const navigate = useNavigate();
    const handleLogout = async () => {
        try{
            await axios.post("http://localhost:8800/api/auth/logout", {}, {withCredentials: true});
            navigate("/login");
        }catch(err){
          console.log(err);
        }
    }

    const handleSubmit = async (e, id) => {
      e.preventDefault();

      const dodajIznajmljeno = {
        bookid: id,
        dayDuration: duration
      }
      try{
        const apiOdgovor = await axios.post("http://localhost:8800/api/iznajmljeno/dodaj", dodajIznajmljeno, {withCredentials: true});
        setOdgovor(apiOdgovor.data)
      }catch(err){
        console.log(err);
      }
    }

    const handleKnjige = async () => {
      try{
        const mojeKnjige = await axios.get("http://localhost:8800/api/knjige/mojeknjige", {withCredentials: true});
        setMojeKnjige(mojeKnjige.data);
        setShow(true);
      }catch(err){
        console.log(err);
      }
    }

  return (
    <div className='h-screen' onClick={() => setShow(false)}>
        <div className='fixed bottom-[64px] left-[30vw] bg-white p-[40px] flex justify-between w-[40vw] mx-auto rounded-[22px]'>
            <span>{user && user[2]}</span>
            <span>{user && user[1]}</span>
            <button onClick={handleKnjige}>Moje Knjige</button>
            <button onClick={handleLogout}>Log Out</button>
        </div>

       {show && 
        <div className='absolute p-8 w-[80vw] top-20 bg-white z-[1000] left-[10vw] h-[70vh]'>
          <table>
              <tr>
                <th>Iznajmljena Knjiga</th>
                <th>Datum iznajmljivanja</th>
                <th>Datum vraćanja</th>
              </tr>
              {mojeKnjige?.map((knjiga) => {
                return (
                  <tr key={knjiga.id} className='relative'>
                    <td>{knjiga.name}</td>
                    <td>{knjiga.rentDate.split("T")[0]}</td>
                    <td>{knjiga.rentExpireDate.split("T")[0]}</td>
                  </tr>
                )
              })}
        </table>
        </div>
       }
        
        <div className='container pt-[128px] flex flex-row gap-[80px]'>
            <div className='bg-white px-8 pt-8 pb-[80px] flex-[2]'>
                <img src="./src/assets/homeimg.png" alt="" />
                {odgovor && 
                  <p className='mt-2 text-red-600 text-sm'>
                    {odgovor}
                  </p>}
            </div>
            
            <div className='knjigeGrid flex-[5]'>
                {knjige.map((knjiga) => {
                  if(knjiga.quantity !== 0){
                    return(
                        <div key={knjiga.id} className='max-w-[300px] w-full flex gap-3 p-3 bg-white min-h-0 items-start'>
                            <div className='w-[120px] h-[120px] overflow-hidden relative'>
                                <img className="absolute left-0 top-0 right-0 bottom-0 " src={`/upload/${knjiga.image}`} alt="" />
                            </div>
                            <div className='flex flex-col gap-2 flex-grow'>
                                <span className='text-lg text-black'>{knjiga.name}</span>
                                <form onSubmit={(e) => handleSubmit(e, knjiga.id)}>
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-xs text-[#00000050]'>Iznajmi na</span>
                                        <input required onChange={(e) => setDuration(e.target.value)} className='outline-0 border border-[#08122535]  pl-2 rounded-xl text-xs py-1 pr-2 w-full' type="number" min="1" max="7" placeholder="0"/>
                                    </div>
                                    <button className='border border-[#081225] rounded-xl px-8 text-xs py-1 w-full mt-2'>Iznajmi</button>
                                    
                                </form>
                            </div>
                        </div>
                    )
                  }
                })}                               
            </div>
        </div>
    </div>
  )
}

export default Home