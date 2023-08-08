import images from '../../Static/Images/images.png';
import { MdCancel } from "react-icons/md";

import { AiFillPlayCircle} from "react-icons/ai";
import AlumniBig from "../../Static/Images/AlumniBig.png"
import AlumniSmall from "../../Static/Images/creen3.jfif"
import "./hellosection.css"

import { React,useRef,useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

import axios from "../../api/axios";
import baseUrl from '../../api/baseUrl';
import Modal from 'react-modal';
const LOGIN_URL = '/token/';

// Define MobileMenu component

Modal.setAppElement('#root'); // Define application root

export default function HomeMenuBar() {
    const [seen, setSeen] = useState(false)

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef =useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [ pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [videoIsOpen, setVideoIsOpen] = useState(false);

    useEffect(() => {
        if(seen){
          emailRef.current.focus();
        }
    }, [seen])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
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
            navigate('/error');
        }
        if(seen) {
            errRef.current.focus();
        }
    }

    function togglePop () {
        setSeen(!seen);
    };
    const [isShown, setIsShown] = useState(false);
        const toggleMobileMenu = () => {
          setIsShown(!isShown);
        };
        const MobileMenu = () => {
            return (
                <div className={'mobile-menu'}>
                    <a onClick={toggleMobileMenu} className="active" href='https://www.asyv.org/'>Home</a>
                    <a onClick={toggleMobileMenu} href='https://www.asyv.org/mission'>About Us</a>
                    <a onClick={toggleMobileMenu} href='https://www.asyv.org/partners-supporters'>Resources</a>
                    <a onClick={toggleMobileMenu} href='https://www.asyv.org/blog'>News</a>
                    <a onClick={toggleMobileMenu} href='https://www.asyv.org/contact-us'>Contact</a>
                </div>
            );
        };

    function AlumniCount() {
        const [alumniCount, setAlumniCount] = useState(0);

        useEffect(() => {
            axios.get(baseUrl+'/alumni_count')
                .then(response => {
                    setAlumniCount(response.data.count);
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }, []);

        return alumniCount;
    }
    const alumniCount = AlumniCount();

    return (
        <>
            {/* --------------------- 1. Top Navigation Bar --------------------- */}
            <div className='HomeMenuBar topbarWrapper'> {/* container of top navigation bar*/}
                <div className="left-menu">
                    <img src={images} alt="logo" />
                </div>

                <div>
                    {/* Desktop Menu, which only appears on large screens */}
                    <div className='menu'>
                        <a className="active" href='https://www.asyv.org/'>Home</a>
                        <a href='https://www.asyv.org/mission'>About Us</a>
                        <a href='https://www.asyv.org/partners-supporters'>Resources</a>
                        <a href='https://www.asyv.org/blog'>News</a>
                        <a href='https://www.asyv.org/contact-us'>Contact</a>
                    </div>

                    {/* This button only shows up on small screens. It is used to open the mobile menu */}
                    <button className='show-mobile-menu-button' onClick={toggleMobileMenu}>
                        &#8801;
                    </button>

                    {/* The mobile menu and the close button */}
                    {isShown && <MobileMenu />}
                    {isShown && (
                        <button className='close-mobile-menu-button' onClick={toggleMobileMenu}>
                            &times;
                        </button>
                    )}
                </div>

                <div className="right-menu">
                    <button onClick={togglePop} className="log logsmall">Login</button>
                    {seen ?
                        <div className="popup" id="closeLogin">
                            <div className="popup-inner">
                                <MdCancel className='cancellogin' onClick={togglePop} />
                                <div className="left-menu">
                                    <center>  <img src={images} alt="logo" /></center>
                                </div>
                                <h3 className="welcomemessage">Welcome back to our alumni system! Enter your credentials to log in.</h3>
                                <p ref={errRef} className={errMsg ? "errmsg" :
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

            {/* --------------------- 2. Middle Hello Section --------------------- */}
            <section id="home" className="hellosection">
                <div className="left">
                    <div className="hellolefttop">
                        <h1>
                            Be part of the massive connection of ASYV Alumni Association!
                        </h1>
                        <br/>
                        <p>
                            More than you may realize exists in the ASYV Alumni Association. Make the world better by joining the change-makers. Join us and take in the lovely changes we are bringing about!
                        </p>
                        <br/>
                    </div>

                    <div className="helloleftbottom">
                        <div className="right-menu">
                            <button onClick={togglePop} className="log">Get Started</button>
                        </div>

                        <div className="introvideo">
                            <button onClick={() => setVideoIsOpen(true)}>
                                <AiFillPlayCircle className="icon" />
                                <span className="introvideoplay">Play Video</span>
                            </button>
                        </div>

                    </div>
                </div>
                <div className="right">
                    <div className="alumniSmall">
                        <img src={AlumniSmall} alt="AlumniSmall" />
                    </div>
                    <div className="alumniBig">
                        <img src={AlumniBig} alt="AlumniBig" />
                    </div>
                    <div className="rightalumninumber">
                        <span>{alumniCount} Alumni</span>
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
            </section>

            {/* Use Modal to show video window */}
            <Modal
                isOpen={videoIsOpen}
                onRequestClose={() => setVideoIsOpen(false)}
                overlayClassName="modal-overlay"
                className="modal-content"
            >
                <iframe

                    src="https://www.youtube.com/embed/jxT6EIAYbJA"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
                <button onClick={() => setVideoIsOpen(false)} className="close-video-button">Close</button>
            </Modal>


            {/* --------------------- 3. Bottom Transition Part --------------------- */}
            <div className="knowmore">
                <div className="school">
                    Liquid-net-Family High School
                </div>
                <div className="infull">
                    Liquidnet Family High School education doesn't end after graduation. LFHS offers
                    programs & resources to alumni at every phase of their career.
                </div>
                <div className="rightlink">
                    <button onClick={togglePop} className="log" style={{ border: 'none', fontSize: '20px', background: 'transparent' }}>Learn more →</button>
                </div>
                {/* <BiMessageRoundedDots className="sendsms" /> */}
            </div>

        </>
    );

}
