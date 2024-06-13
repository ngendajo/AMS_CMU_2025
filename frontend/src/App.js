
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



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
