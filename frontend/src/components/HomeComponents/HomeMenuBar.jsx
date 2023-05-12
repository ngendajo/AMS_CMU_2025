import { AiOutlineMenu } from "react-icons/ai";
import images from '../../Static/Images/images.png';
import { MdCancel } from "react-icons/md"; 

import { AiFillPlayCircle } from "react-icons/ai";
import screen1 from "../../Static/Images/screen1.png"
import screen2 from "../../Static/Images/creen3.jfif"
import "./hellosection.css"

import { React,useRef,useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

import axios from "../../api/axios";
const LOGIN_URL = '/token/';

export default function HomeMenuBar() {
    const [seen, setSeen] = useState(false)
    const [nav, setNav] = useState(false)

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef =useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [ pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() =>{
        if(seen){
          emailRef.current.focus();
        }
    },[seen])

    useEffect(() =>{
        setErrMsg('');
    },[email,pwd])

    const handleSubmit = async (e) =>{
        e.preventDefault();

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
                const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": null
                console.log(roles)
                setAuth({user,roles,email, pwd, accessToken,refresh });
                setEmail('');
                setPwd('');
                navigate(from, {replace:true})
        }catch(err){
            if(!err?.response){
                setErrMsg("Missing Email or Password");
            }else if (err.response?.status === 404){
                setErrMsg('Unauthorised');
            }else{
                setErrMsg('Login Failed');
            }
            setErrMsg('Login Failed')
        }
        if(seen){
          errRef.current.focus();
        }
    }

    function togglePop () {
        setSeen(!seen);
    };
    function showmenu(){
      setNav(!nav)
      const menu = document.querySelectorAll('.link');
      menu.forEach(men => {
        if(nav){
          men.style.display = 'block';
        }else{
          men.style.display = 'none';
        }
        
      });
    }
  return (
    <>
    <div className='HomeMenuBar topbarWrapper'>
                <div className="left-menu">
                    <img src={images} alt="logo" />
                </div>
                <div className="center-menu">
                  <div className="topnav" id="myTopnav">
                    <AiOutlineMenu className='icon links' onClick={showmenu}/>
                    <Link to="#home" className="active links link">Home</Link>
                    <Link to="#about" className="links link">About us</Link>
                    <Link to="#resources" className="links link">Resources</Link>
                    <Link to="#news" className="links link">News</Link>
                    <Link to="#contact" className="links link">Contact</Link>
                  </div>
                </div>
                <div className="right-menu">
                  <button onClick={togglePop} className="log logsmall">Login</button>
                  {seen ? 
                    <div className="popup" id="closeLogin">
                      <div className="popup-inner">
                          <MdCancel className='cancellogin' onClick={togglePop}/>
                          <div className="left-menu">
                            <center>  <img src={images} alt="logo" /></center>
                          </div>
                          <h3 className="welcomemessage">Welcome back To our alumni system enter your credentials to log in</h3>
                          <p ref={errRef} className={errMsg ? "errmsg":
                              "offscreen"} aria-live="assertive">
                              {errMsg}
                          </p>
                          <form onSubmit={handleSubmit}>
                          <label htmlFor="email">
                                Email:
                            
                            <input
                                type="email"
                                id="email"
                                ref={emailRef}
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                          </label>

                          <label htmlFor="password">
                                Password:
                            
                            <input
                                type="password"
                                id="password"
                                autoComplete="off"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                          </label>
                          <Link to="/home" className="forgetpass">Forgot password?</Link>
                          <center><button>Login</button></center>
                          </form>
                      </div>
                    </div>
                  : null}
                </div>
    </div>
    <div className="hellosection">
                <div className="left">
                    <div className="hellolefttop">
                        <h1>
                            Be part of the massive connection of the ASYV alumni association.
                        </h1>
                        <p>
                        More than you may realize exists in the ASYV Alumni Association. Make the world better than you found it by joining the change-makers. Join us and take in the lovely changes we are bringing about.
                        </p>
                    </div>
                    <div className="helloleftbottom">
                        <div className="right-menu">
                            <button onClick={togglePop} className="log">Get started</button>
                        </div>
                        <div className="introvideo">
                            <AiFillPlayCircle className="icon"/>
                            <span className="introvideoplay">Play video</span>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="rightimg2">
                        <img src={screen2} alt="logo" />
                    </div>
                    <div className="rightimg1">
                        <img src={screen1} alt="logo" />
                    </div>
                    <div className="rightalumninumber">
                        <span>1200 + Alumni</span>
                    </div>
                    <div className="rightleftbars1">
                    </div>
                    <div className="rightleftbars2">
                    </div>
                    <div className="rightbars1">
                    </div>
                    <div className="rightbars2">
                    </div>
                </div>
            </div>
            </>
  )
}
