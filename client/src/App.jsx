import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import DodajKnjigu from "./pages/dodaj/DodajKnjigu.jsx";
import DodajKorisnika from "./pages/dodaj/DodajKorisnika.jsx";
import IzmijeniKnjigu from "./pages/izmijeni/IzmijeniKnjigu.jsx";
import IzmijeniKorisnika from "./pages/izmijeni/IzmijeniKorisnika.jsx";
import Leftbar from "./components/Leftbar.jsx";
import DashboardKnjige from "./pages/dashboard/DashboardKnjige.jsx";
import DashboardIznajmljene from "./pages/dashboard/DashboardIznajmljene.jsx";
import DashboardOrganizacije from "./pages/dashboard/DashboardOrganizacije.jsx";
import IzmijeniOrganizaciju from "./pages/izmijeni/IzmijeniOrganizaciju.jsx";
import DodajOrganizaciju from "./pages/dodaj/DodajOrganizaciju.jsx";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [admin, setAdmin] = useState();
  const [homeAccess, setHomeAccess] = useState();
  const [error, setError] = useState();

    const userCheck = async () => {
      let korisnik;
      try{
        korisnik = await axios.get("http://localhost:8800/api/korisnici/logged", {withCredentials:true});
        korisnik = korisnik.data;
        setAdmin(korisnik[0]);
        if(korisnik) setHomeAccess(true);
      }catch(err){
        console.log(err);
        setError(err);
      }
      return korisnik;
    }

  

  const Layout = () => {
    userCheck();
    if(error){
      return <Navigate to="/login"/>
    }

    if (admin === undefined) {
      return <div>Loading...</div>; 
    }

    return(
      <div className="container flex gap-8 py-8">
        <Leftbar />
        <div className="w-full">
            {admin ? <Outlet /> : <Navigate to="/"/>}
        </div>
      </div>
    );
  };

  const Layout2 = () => {
    userCheck();
    if(error){
      return <Navigate to="/login"/>
    }

    if (admin === undefined) {
      return <div>Loading...</div>; 
    }

    return(
      <>
        {admin ? <Outlet /> : <Navigate to="/"/>}
      </>
    );
  };

  const HomeProtection = () => {
    userCheck();
    if(error){
      return <Navigate to="/login"/>
    }
    
    if (admin === undefined) {
      return <div>Loading...</div>; 
    }

    return(
      <>
        {homeAccess ? <Outlet /> : <Navigate to="/login"/>}
      </>
    );
  };

  const router = createBrowserRouter([
      {
        path:"/dashboard",
        element: <Layout/>, 
        children: [
          {
            path:"/dashboard/korisnici",
            element: <Dashboard />
          },
          {
            path:"/dashboard/knjige",
            element: <DashboardKnjige />
          },
          {
            path:"/dashboard/iznajmljene",
            element: <DashboardIznajmljene />
          },
          {
            path:"/dashboard/organizacije",
            element: <DashboardOrganizacije />
          }
        ]
      },
    {
      path: "/login",
      element: <Login />
    },
    {
      path:"/",
      element: <HomeProtection/>, 
      children: [
        {
          path: "/",
          element: <Home />
        },
      ]
    },
    {
      path:"/",
      element: <Layout2/>, 
      children: [
      {
        path: "/dashboard/knjige/edit/:id",
        element: <IzmijeniKnjigu />
      },
      {
        path: "/dashboard/korisnici/edit/:id",
        element: <IzmijeniKorisnika />
      },
      {
        path: "/dashboard/organizacije/edit/:id",
        element: <IzmijeniOrganizaciju />
      },
      {
        path: "/dashboard/knjige/dodaj",
        element: <DodajKnjigu />
      },
      {
        path: "/dashboard/korisnici/dodaj",
        element: <DodajKorisnika />
      },
      {
        path: "/dashboard/organizacije/dodaj",
        element: <DodajOrganizaciju />
      },]
    },  
  ]);  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
