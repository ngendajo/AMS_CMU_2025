
import React from 'react'
import Logo from './Logo.jpg'
import './hearder.css'
import useAuth from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import useLogout from '../../hooks/useLogout';

function Header() {
     const navigate = useNavigate();
     const { auth } = useAuth();
     const logout = useLogout();
     const signOut = async () => {
          await logout();
          navigate('/home');
      }
  return (
    <center className='Header'>
        <div className="asyvlogo">
            <img className='logo' src={Logo} alt="AsyvLogo" />
       </div>
       <div className="headertitle">
            <h1>Library Management System</h1>
       </div>
       {auth?.accessToken
        ?
       <div className="logoutbutton">
            <span onClick={signOut}>LOG ME OUT</span>
       </div>:
       <span>

       </span>
          }
    </center>
  )
}

export default Header

