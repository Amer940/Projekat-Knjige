import React, { useEffect } from "react";
import { useState } from "react";
import Korisnici from "../../components/Korisnici.jsx";
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try{
        await axios.post("http://localhost:8800/api/auth/logout", {}, {withCredentials: true});
        navigate("/login");
    }catch(err){
        console.log(err);
    }
}

  return (
    <>
      <div className="container flex gap-8 py-8">
        <div className="flex flex-col gap-[24px] w-full">
          <div className="flex gap-4 justify-end w-full">
            <Link to="/dashboard/korisnici/dodaj"><button className="flex align-middle justify-center p-4 w-[180px] bg-[#081225] rounded-[18px] text-white">Dodaj Korisnika</button></Link>
            <button className="flex align-middle justify-center p-4 w-[180px] bg-white rounded-[18px] text-[#081225]" onClick={handleLogout}>Log Out</button>
          </div>
          <div className="w-full rounded-[18px] bg-white p-8 h-full">
             <Korisnici />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
