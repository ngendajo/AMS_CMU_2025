import { Outlet } from "react-router-dom"
import DashboardHeader from './dashboard/Dashboard-header';
import Sidebar from './dashboard/Sidebar';
import useAuth from '../hooks/useAuth';

const Container= () => {
    const  {auth}  = useAuth();
   if(auth.user.is_alumni){
    return (
        <>
        <DashboardHeader />
        <Sidebar />
        <div>
          <Outlet />
        </div>
        </>
      );
   }
   else if(auth.user.is_student){
    <div>
        <h1>
            Wecome student
        </h1>
   </div> 
   }
   else{
    return(
       <div>
        <h1>
            Wecome staff
        </h1>
       </div> 
    )
  }
};

export default  Container;