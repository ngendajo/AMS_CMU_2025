import Layout from './components/Layout';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Missing from './components/Missing';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home/Home';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes*/}
          <Route path='home' element={<Home />}/>
          <Route path='register' element={<Register />}/>

          {/* we want to protect these routes*/}
          <Route element={<RequireAuth />}>
            <Route path='/' element={<Dashboard />}/>
          </Route>

          {/* catch all */}
          <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
