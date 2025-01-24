import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';

const Leftbar = () => {
  const [user, setUser] = useState();

  useEffect(() => {
      const uzmiInfo = async (e) => {
        try{
          const userInfo = await axios.get("http://localhost:8800/api/korisnici/logged", {withCredentials: true});
          setUser(userInfo.data);
        }catch(err){
          console.log(err);
        }
      }
  
      uzmiInfo();
    }, [])

    let lokacija = window.location.href.split("/");
    lokacija = lokacija[lokacija.length-1];

    const korisnici = lokacija === "korisnici";
    const knjige = lokacija === "knjige";
    const iznajmljene = lokacija === "iznajmljene";
    const organizacije = lokacija === "organizacije";

  return (
    <div className="flex flex-col justify-between pb-[86px] px-8 pt-8 bg-white rounded-[18px] min-w-[280px] sticky top-8 bottom-8 h-[93vh]">
          <div>
          <div className="pb-4 border-b border-[#081225]">
            <img src="../src/assets/logo.png" alt="" />
          </div>
          <div className="mt-8 flex flex-col gap-4 w-full">
            {!korisnici ? (
              <Link reloadDocument to="/dashboard/korisnici" ><button
                className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#08122530]"
              >
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/korisniciDark.png"
                  alt=""
                />
                <span>Korisnici</span>
              </button></Link>
            ) : (
              <button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#081225] bg-[#081225]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/korisniciLight.png"
                  alt=""
                />
                <span className="text-white">Korisnici</span>
              </button>
            )}

            {!knjige ? (
              <Link reloadDocument to="/dashboard/knjige"><button
                className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#08122530]"
              >
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/knjigeDark.png"
                  alt=""
                />
                <span>Knjige</span>
              </button></Link>
            ) : (
              <button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#081225] bg-[#081225]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/knjigeLight.png"
                  alt=""
                />
                <span className="text-white">Knjige</span>
              </button>
            )}

            {!iznajmljene ? (
              <Link reloadDocument to="/dashboard/iznajmljene"><button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#08122530]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/iznajmljeneDark.png"
                  alt=""
                />
                <span>Iznajmljene Knjige</span>
              </button></Link>
            ) : (
              <button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#081225] bg-[#081225]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/iznajmljeneLight.png"
                  alt=""
                />
                <span className="text-white">Iznajmljene Knjige</span>
              </button>
            )}

            {!organizacije ? (
              <Link reloadDocument to="/dashboard/organizacije"><button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#08122530]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/structureDark.png"
                  alt=""
                />
                <span>Organizacije</span>
              </button></Link>
            ) : (
              <button className="flex gap-2 py-1 pl-4 w-full rounded-xl border border-[#081225] bg-[#081225]">
                <img
                  className="w-[24px]"
                  src="../src/assets/dashboardIcons/structureLight.png"
                  alt=""
                />
                <span className="text-white">Organizacije</span>
              </button>
            )}
          </div>
          </div>
          <div className="flex flex-col ">
            <span className="text-lg text-center">{user && user[2]}</span>
            <span className="text-xs text-[#00000060] text-center">{user && user[3]}</span>
          </div>
        </div>
  )
}

export default Leftbar