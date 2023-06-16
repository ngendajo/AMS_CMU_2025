import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Missing from './components/Missing';
import MainDashboard from './pages/MainDashboard';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home/Home';
import Dashboard from './pages/dashboardpages/Dashboard';
import Events from './pages/dashboardpages/Events';
import Chats from './pages/dashboardpages/Chats';
import Opportunities from './pages/dashboardpages/Opportunities';
import Schedule from './pages/dashboardpages/Schedule';
import Gallery from './pages/dashboardpages/Gallery';
import Alumni from './pages/dashboardpages/Alumni';
import Staff from './pages/dashboardpages/Staff';
import Profile from './pages/dashboardpages/Profile';
import Help from './pages/dashboardpages/Help';
import Register from './components/DashboardComponents/Register';
import StaffDetails from './components/DashboardComponents/Staffpart/StaffDetails';
import EditStaffUser from './components/DashboardComponents/Staffpart/EditStaffUser';
import useRefreshToken from './hooks/useRefreshToken';
import { useEffect } from 'react';
import useAuth from './hooks/useAuth';
import Deleteuser from './components/DashboardComponents/Staffpart/Deleteuser';
import EditPosition from './components/DashboardComponents/Staffpart/EditPosition';
import ChangePassword from './components/DashboardComponents/Staffpart/ChangePassword';
import Registera from './components/DashboardComponents/Alumnipart/Registera';
import { Grades } from './components/DashboardComponents/Alumnipart/Grades';
import AddGrade from './components/DashboardComponents/Alumnipart/AddGrade';
import EditGrade from './components/DashboardComponents/Alumnipart/EditGrade';
import { Combinations } from './components/DashboardComponents/Alumnipart/Combinations';
import Addcombination from './components/DashboardComponents/Alumnipart/Addcombination';
import Editcombination from './components/DashboardComponents/Alumnipart/Editcombination';
import Deletecombination from './components/DashboardComponents/Alumnipart/Deletecombination';
import { Eps } from './components/DashboardComponents/Alumnipart/Eps';
import AddEp from './components/DashboardComponents/Alumnipart/AddEp';
import EditEp from './components/DashboardComponents/Alumnipart/EditEp';


function App() {
  const refresh = useRefreshToken();
  const {auth} = useAuth();

  useEffect(()=> {
    let fourMinutes = 1000 * 60 * 4

    let interval =  setInterval(()=> {
        
            if(auth?.accessToken){
              refresh()
            }
    }, fourMinutes)
    return ()=> clearInterval(interval)

}, [refresh,auth])
  return (
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* public routes*/}
                <Route path='home' element={<Home />}/>

                {/* we want to protect these routes*/}
                <Route element={<RequireAuth />}>
                  <Route path='/' element={<MainDashboard />}>
                    <Route path='/' element={<Dashboard />}/>
                    <Route path='events' element={<Events />}/>
                    <Route path='chats' element={<Chats />}/>
                    <Route path='opportunities' element={<Opportunities />}/>
                    <Route path='schedule' element={<Schedule />}/>
                    <Route path='gallery' element={<Gallery />}/>
                    <Route path='alumni' element={<Alumni />}/>
                    <Route path='staff' element={<Staff />}/>
                    <Route path='profile' element={<Profile />}/>
                    <Route path='help' element={<Help />}/>
                    {/* crc crud */}
                    <Route path='add-crc' element={<Register />}/>
                    <Route path='add-crc/:id' element={<EditStaffUser />}/>
                    <Route path='view-crc/:id' element={<StaffDetails />}/>
                    <Route path='delete-user/:id' element={<Deleteuser/>}/>
                    <Route path='add-crc/p/:id' element={<EditPosition/>}/>
                    <Route path='add-crc/ps/:id' element={<ChangePassword/>}/>
                    {/* alumni crud */}
                    <Route path='add-alumni' element={<Registera />}/>
                    <Route path='grades' element={<Grades />}/>
                    <Route path='add-grade' element={<AddGrade />}/>
                    <Route path='add-grade/:id' element={<EditGrade />}/>
                    <Route path='combinations' element={<Combinations />}/>
                    <Route path='add-comb' element={<Addcombination />}/>
                    <Route path='add-comb/:id' element={<Editcombination/>}/>
                    <Route path='delete-comb/:id' element={<Deletecombination/>}/>
                    <Route path='eps' element={<Eps />}/>
                    <Route path='add-ep' element={<AddEp />}/>
                    <Route path='add-ep/:id' element={<EditEp />}/>
                  </Route>
                </Route>

                {/* catch all */}
                <Route path='*' element={<Missing />} />
            </Route>
          </Routes>
  );
}

export default App;
