
import Header from '../components/Header/Header';
import { Sidebar, SidebarItem } from "react-responsive-sidebar";

import { Outlet } from 'react-router-dom';

import Sidebarpart from '../components/DashboardComponents/Sidebarpart/Sidebarpart';

import './dashboard.css'

const MainDashboard = () => {
    
  return (
    <div className='dashboard'> 
        <Header/>
        <div className="linksonmobile">
            <Sidebar
            content={[
              <SidebarItem>
                <Sidebarpart/>
              </SidebarItem>
            ]}
          ></Sidebar>
          <div className='mainbody'>
            <Outlet/>
          </div>
        </div>
          <div className="linksoncomputer">
          <Sidebarpart/>
          <div className='mainbody'>
            <Outlet/>
          </div>
        </div>
       
    </div>
  )
}

export default MainDashboard