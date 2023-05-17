import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
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


function App() {
  return (
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* public routes*/}
                <Route path='home' element={<Home />}/>
                <Route path='register' element={<Register />}/>

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
                  </Route>
                </Route>

                {/* catch all */}
                <Route path='*' element={<Missing />} />
            </Route>
          </Routes>
  );
}

export default App;
