import { React,useRef,useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth";
import './home.css';
import Header from '../Header/Header';
import Footer from '../Footer';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import axios from "../../api/axios";
import Modal from 'react-modal';
const LOGIN_URL = '/token/';


Modal.setAppElement('#root'); // Define application root

export default function Home() {

  const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef =useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [ pwd, setPwd] = useState('');
    const [ vercode, setVercode] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
      setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
      e.preventDefault();

      if(vercode.toString() === captcha.toString()){
        try{
          const response = await axios.post(LOGIN_URL,
              JSON.stringify({
                  email:email,password:pwd
              }),
              {
                  headers: { 'Content-Type': 'application/json' },
                  withCredentials:true
              }
              );
              const accessToken = response?.data.access;
              const refresh = response?.data.refresh;
              const user =jwtDecode(accessToken); 
              const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": user.is_librarian ? "librarian": user.is_teacher ? "teacher": user.is_student ? "student": "visitor"
              
              setAuth({user,roles,email, pwd, accessToken,refresh });
              setEmail('');
              setPwd('');
              navigate(from, {replace:true})
      } catch(err) {
          if(!err?.response){
              setErrMsg("Missing Email or Password");
          }else if (err.response?.status === 401){
              setErrMsg('Unauthorised');
          }else{
              setErrMsg('Login Failed: ' + err);
          }
          setErrMsg('Login Failed');
      }
      }else{
        setErrMsg("Write the verification code!")
      }
      
  }


  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 90000) + 10000;
  };
  
  // Destructure captcha and setCaptcha from the state
  const [captcha, setCaptcha] = useState(generateRandomNumber());

  // Function to update captcha when needed
  const regenerateCaptcha = () => {
    setCaptcha(generateRandomNumber());
  };

  return (
    <div className='home'>
       <Header/>
       <div className="loginform">
        <h2>Login Form</h2>
        <p ref={errRef} className= "errmsg">
                                    {errMsg}</p>
        <form className='formelement' onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email</label>
          <input 
            className='credentials' 
            type="email"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <label htmlFor="password">Enter Password</label>
          <input 
            className='credentials' 
            type="password" 
            id="password"
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
          />
          <label htmlFor="vercode">Verification code:
            <input className='vercode' onChange={(e) =>setVercode(e.target.value)} type="text" />
            {/* Display the current captcha value */}
            
            {/* Button to regenerate captcha */}
            <button className='captcha' type="button" onClick={regenerateCaptcha}>{captcha}</button>
          </label>
          <label htmlFor="loginbutton">
            <button className='submitbuton'>Login</button> 
          </label>
          <label htmlFor="create new">
            <Link to="/signup" className="forgetpass">New Student? Create your Account Here!</Link>
          </label>
        </form>
        
        
       </div>
       <Footer/>
    </div>
  )
}
