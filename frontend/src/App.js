import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Missing from './components/Missing';
import MainDashboard from './pages/MainDashboard';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home/Home';
import Dashboard from './pages/dashboardpages/Dashboard';
import Events from './pages/dashboardpages/Events';
import AddEvent from './components/EventComponents/AddEvent';
import EditEvent from './components/EventComponents/EditEvent';
import EventDetail from './components/EventComponents/EventDetail';
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
import AddMoreInfoAlumni from './components/DashboardComponents/Alumnipart/AddMoreInfoAlumni';
import EditAlumini from './components/DashboardComponents/Alumnipart/EditAlumini';
import DeleteAlumni from './components/DashboardComponents/Alumnipart/DeleteAlumni';
import Employment from './components/DashboardComponents/Alumnipart/alumnireport/Employment';
import ASYVInfo from './components/DashboardComponents/Alumnipart/alumnireport/ASYVInfo';
import AddASYVInfo from './components/DashboardComponents/Alumnipart/AddASYVInfo';
import AddGallery from './components/GalleryComponents/AddGalleryPhoto'
import AddEmployment from './components/DashboardComponents/Alumnipart/alumnireport/AddEmployment';
import DeleteEmployment from './components/DashboardComponents/Alumnipart/DeleteEmployment';
import Studies from './components/DashboardComponents/Alumnipart/alumnireport/Studies';
import AddStudie from './components/DashboardComponents/Alumnipart/alumnireport/AddStudie';
import Deletestudy from './components/DashboardComponents/Alumnipart/Deletestudy';
import UpdateASYVInfo from './components/DashboardComponents/Alumnipart/UpdateASYVInfo';
import UpdateStudie from './components/DashboardComponents/Alumnipart/alumnireport/UpdateStudie';
import UpdateEmployment from './components/DashboardComponents/Alumnipart/alumnireport/UpdateEmployment';
import Stories from './components/DashboardComponents/Alumnipart/alumnireport/Stories';
import AddStory from './components/DashboardComponents/Alumnipart/alumnireport/AddStory';
import UpdateStory from './components/DashboardComponents/Alumnipart/alumnireport/UpdateStory';
import DeleteStory from './components/DashboardComponents/Alumnipart/alumnireport/DeleteStory';
import DisplayStory from './components/DashboardComponents/Alumnipart/alumnireport/DisplayStory';
import AlumnProfile from './components/ProfileComponents/AlumnProfile';
import EditGallery from './components/GalleryComponents/EditDeleteGalleryPhoto';
import AddBulkASYVInfo from './components/DashboardComponents/Alumnipart/alumnireport/AddBulkASYVInfo';
import Password from './pages/dashboardpages/Password';
import Error from './pages/dashboardpages/Error';
import ResetPassword from './components/DashboardComponents/Staffpart/ResetPassword';
import ResetPasswordofAlumn from './components/DashboardComponents/Alumnipart/ResetPasswordofAlumn';



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
                <Route path='error' element={<Error />}/>

                {/* we want to protect these routes*/}
                <Route element={<RequireAuth />}>
                  <Route path='/' element={<MainDashboard />}>
                    <Route path='/' element={<Dashboard />}/>
                    <Route path='events' element={<Events />}/>
                    <Route path='add-event' element={<AddEvent />}/>
                    <Route path='edit-event/:id' element={<EditEvent />}/>
                    <Route path='event/:id' element={<EventDetail/>}/>
                    <Route path='chats' element={<Chats />}/>
                    <Route path='opportunities' element={<Opportunities />}/>
                    <Route path='schedule' element={<Schedule />}/>
                    <Route path='gallery' element={<Gallery />}/>
                    <Route path='password' element={<Password />}/>
                    <Route path='alumni' element={<Alumni />}>
                      <Route path='' element={<ASYVInfo />}/>
                      <Route path='employment' element={<Employment />}/>
                      <Route path='deleteemployment/:id' element={<DeleteEmployment />}/>
                      <Route path='deletestudy/:id' element={<Deletestudy />}/>
                      <Route path='grades' element={<Grades />}/>
                      <Route path='combinations' element={<Combinations />}/>
                      <Route path='eps' element={<Eps />}/>
                      <Route path='studie' element={<Studies />}/>
                      <Route path='story' element={<Stories />}/>
                      <Route path='updateasyvinfo/:id' element={<UpdateASYVInfo />}/>
                      <Route path='updatestudie/:id' element={<UpdateStudie />}/>
                      <Route path='updateemployement/:id' element={<UpdateEmployment />}/>
                      <Route path='updatestory/:id' element={<UpdateStory />}/>
                      <Route path='deletestory/:id' element={<DeleteStory />}/>
                      <Route path='displaystory/:id' element={<DisplayStory />}/>
                      <Route path='bulkalumni' element={<AddBulkASYVInfo />}/>
                    </Route>
                    <Route path='staff' element={<Staff />}/>
                    <Route path='profile' element={<Profile />}/>
                    <Route path='help' element={<Help />}/>
                    {/* crc crud */}
                    <Route path='add-crc' element={<Register />}/>
                    <Route path='add-crc/:id' element={<EditStaffUser />}/>
                    <Route path='staffprofile/:id' element={<StaffDetails />}/>
                    <Route path='alumniprofile/:id' element={<AlumnProfile />}/>
                    <Route path='delete-user/:id' element={<Deleteuser/>}/>
                    <Route path='reset-password/:id' element={<ResetPassword/>}/>
                    <Route path='reset-alumn-password/:id' element={<ResetPasswordofAlumn/>}/>
                    <Route path='add-crc/p/:id' element={<EditPosition/>}/>
                    {/* alumni crud */}
                    <Route path='add-alumni' element={<Registera />}/> 
                    <Route path='add-alumni/info/:id' element={<AddMoreInfoAlumni />}>
                      <Route path='' element={<AddASYVInfo />}/>
                      <Route path='addemployment' element={<AddEmployment />}/>
                      <Route path='study' element={<AddStudie />}/>
                      <Route path='story' element={<AddStory />}/>
                    </Route>
                    <Route path='add-alumni/:id' element={<EditAlumini />}/>
                    <Route path='delete-alumni/:id' element={<DeleteAlumni />}/>
                    <Route path='add-grade' element={<AddGrade />}/>
                    <Route path='add-grade/:id' element={<EditGrade />}/>
                    <Route path='add-comb' element={<Addcombination />}/>
                    <Route path='add-comb/:id' element={<Editcombination/>}/>
                    <Route path='delete-comb/:id' element={<Deletecombination/>}/>
                    <Route path='add-ep' element={<AddEp />}/>
                    <Route path='add-ep/:id' element={<EditEp />}/>
                     {/* gallery route */}
                    <Route path='add-gallery' element={<AddGallery />}/>
                    <Route path='edit-gallery' element={<EditGallery />}/>
                  </Route>
                </Route>

                {/* catch all */}
                <Route path='*' element={<Missing />} />
            </Route>
          </Routes>
  );
}

export default App;
