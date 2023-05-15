import Crc from '../components/Crc';
import Alumni from '../components/Alumini';
import Admin from '../components/Admin';
import useAuth from '../hooks/useAuth';
import jwtDecode from "jwt-decode";
import Header from '../components/Header/Header';

import Sidebar from "../components/sidebar/Sidebar";
import {  Outlet } from "react-router-dom";
import './dashboard.css'

const Dashboard = () => {
    const { auth } = useAuth();
    const user= jwtDecode(auth.accessToken);
    console.log(user)
  return (
    <div className='dashboard'>
        <Header/>


        <Sidebar />
        <Outlet/>

       {user.is_superuser ? 
       <Admin />
       :user.is_crc && user.is_alumni ? 
       <p>You are both</p>
       :user.is_alumni ?
       <Alumni />
       : user.is_crc ?
       <Crc />
       :
       <p>Unauthorized user</p>
       }
    </div>
  )
}

export default Dashboard