import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './pages/Layout';
import './App.css';
import Missing from './pages/Missing';
import RequireAuth from './pages/RequireAuth';
import useRefreshToken from './hooks/useRefreshToken';
import useAuth from './hooks/useAuth';
import Error from './pages/Error';
//import AuthCheck from './context/AuthCheck';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/dashboard/Dashboard';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Events from './pages/events/Events';



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
//
}, [refresh,auth])
  return (
          <Routes>
            <Route path='/' element={<Layout />}>
              {/* public routes*/}
                <Route path='home' element={<Home />}/>
                <Route path='error' element={<Error />}/>
                <Route path='unauthorized' element={<Unauthorized />}/>
             

                {/* we want to protect these routes*/}
                <Route element={<RequireAuth />}>
                  <Route path='/' element={<Dashboard />}/>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/events" element={<Events />} />
               
                </Route>

                {/* catch all */}
                <Route path='*' element={<Missing />} />
            </Route>
          </Routes>
  );
}

export default App;