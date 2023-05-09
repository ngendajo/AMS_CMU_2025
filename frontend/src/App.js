import Login from './components/Login';
import Layout from './components/Layout';
import Admin from './components/Admin';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';
import Home from './components/Home';
import Editor from './components/Editor';
import Lounge from './components/Lounge';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';

const ROLES = {
  "admin":"superuser",
  "crc":"crc",
  "alumni":"alumni"
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes*/}
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register />}/>
          <Route path='linkpage' element={<LinkPage />}/>
          <Route path='unauthorized' element={<Unauthorized />}/>

          {/* we want to protect these routes*/}
          <Route element={<RequireAuth allowedRoles={[ROLES.alumni,ROLES.admin]} />}>
            <Route path='/' element={<Home />}/>
            <Route path='editor' element={<Editor />}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.admin]} />}>
            <Route path='admin' element={<Admin />}/>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.crc,ROLES.admin]} />}>
            <Route path='lounge' element={<Lounge />}/>
          </Route>

          {/* catch all */}
          <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
