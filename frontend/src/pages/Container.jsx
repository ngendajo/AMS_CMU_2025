import { Outlet } from "react-router-dom"
import Header from '../components/dashboard/dashboard-header';
import Sidebar from '../components/dashboard/dashboard-sidebar';
import useAuth from '../hooks/useAuth';

const Container= () => {
    const {auth} = useAuth();
    if(auth.user.is_alumni){
        return (
            <>
            <Header />
            <Sidebar />
            <div class="MarginContainer">
            <Outlet />
            </div>
            </>
        );
    }
    else if(auth.user.is_student){
        <div>
            <h1>
                Welcome students!
            </h1>
        </div> 
    }
    else{
        return (
            <>
            <Header />
            <Sidebar />
            <div class="MarginContainer">
            <Outlet />
            </div>
            </>
    )
  }
};

export default Container;