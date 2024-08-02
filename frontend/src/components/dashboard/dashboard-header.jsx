import React from 'react';
import {useNavigate} from 'react-router-dom';
import Logo from '../../static/images/logo.png';

import useLogout from '../../hooks/useLogout';

const DashboardHeader = () => {
   
  const navigate = useNavigate();
  const logout = useLogout();
  const handleLogout = async () => {
      await logout();
      navigate('/home');
  }
  return (
    <div className="DashboardHeader">
        <div className="DashboardHeaderLeft">
            <img src={Logo} alt="ASYV Logo"/>
            <p>Agahozo-Shalom Youth Village Alumni Platform</p>
        </div>

        <div className="DashboardHeaderRight">
            <div className="DashboardHeaderLogout">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    </div>
    
    );
  };
  
  export default DashboardHeader;