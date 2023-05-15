import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Missing from './components/Missing';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home/Home';
import { AboutUs, OurAim, OurVision } from "./pages/dashoardpages/AboutUs";
import {
  Services,
  ServicesOne,
  ServicesTwo,
  ServicesThree,
} from "./pages/dashoardpages/Services";
import { Events, EventsOne, EventsTwo } from "./pages/dashoardpages/Events";
import Contact from "./pages/dashoardpages/ContactUs";
import Support from "./pages/dashoardpages/Support";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes*/}
          <Route path='home' element={<Home />}/>
          <Route path='register' element={<Register />}/>

          {/* we want to protect these routes*/}
          <Route element={<RequireAuth />}>
            <Route path='/' element={<Dashboard />}>
              <Route path='about-us' element={<AboutUs/>} />
              <Route path='about-us/aim' element={<OurAim/>} />
              <Route path='about-us/vision' element={<OurVision/>} />
              <Route path='services' element={<Services/>} />
              <Route path='services/services1' element={<ServicesOne/>} />
              <Route path='services/services2' element={<ServicesTwo/>} />
              <Route path='services/services3' element={<ServicesThree/>} />
              <Route path='contact' element={<Contact/>} />
              <Route path='events' element={<Events/>} />
              <Route path='events/events1' element={<EventsOne/>} />
              <Route path='events/events2' element={<EventsTwo/>} />
              <Route path='support' element={<Support/>} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
