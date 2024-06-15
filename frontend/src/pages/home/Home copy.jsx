import { React, useState, useEffect } from "react"
// import useAuth from "../../hooks/useAuth";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from 'jwt-decode';

// import axios from "../../api/axios";

import './Home.css'
import HomeHeader from '../../components/home/home_header'
import HomeBanner from '../../components/home/home_banner'
import { News } from "../../components/home/home_news";
import { Alumni } from "../../components/home/home_alumni";
import HomeFooter from '../../components/home/home_footer'
import LoginPopUp from '../../components/home/login_pop_up'

// const LOGIN_URL = '/token/';

export default function Home() {
    // const { setAuth } = useAuth();

    // const navigate = useNavigate();
    // const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    // const [email, setEmail] = useState('');
    // const [pwd, setPwd] = useState('');
    // const [errMsg, setErrMsg] = useState('');
    const [showLogin, setShowLogin] = useState(false);


    // useEffect(() => {
    //     setErrMsg('');
    // }, [email, pwd])

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try{
    //         const response = await axios.post(LOGIN_URL,
    //             JSON.stringify({
    //                 email:email,password:pwd
    //             }),
    //             {
    //                 headers: { 'Content-Type': 'application/json' },
    //                 withCredentials:true
    //             }
    //             );
    //             const accessToken = response?.data.access;
    //             const refresh = response?.data.refresh;
    //             const user =jwtDecode(accessToken); 
    //             const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": "visitor"
    //             console.log(user)
    //             setAuth({user,roles,email, pwd, accessToken,refresh });
    //             setEmail('');
    //             setPwd('');
    //             navigate(from, {replace:true})
    //     } catch(err) {
    //         if(!err?.response){
    //             setErrMsg("Missing Email or Password");
    //         }else if (err.response?.status === 401){
    //             setErrMsg('Unauthorised');
    //         }else{
    //             setErrMsg('Login Failed: ' + err);
    //         }
    //         setErrMsg('Login Failed');
    //     }
        
    // }

    const toggleLoginPopup = () => {
        setShowLogin(!showLogin);
    };

    return (
    <div>
        {/* 1. header: */}
        <HomeHeader onLoginClick={toggleLoginPopup}/>
        
        {/* 2. banner: */}
        <HomeBanner/>
        
        {/* 3. info: */}

        {/* 4. gallery: */}

        {/* 5. news: */}
        <div className="cards">
            <section className="cards-title">
                <h1>NEWS & EVENTS</h1>
                <p>Stay Updated with the Latest News and Upcoming Events</p>
            </section>
            <div className="cards-wrapper">
                <News
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image1"
                    description="Honoring the 30th Commemoration of the 1994 Genocide Against the Tutsi"
                    date="Apr 30, 2024"
                    link="card1"
                />
                <News
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image2"
                    description="On the 10th Anniversary of Anne Heyman's Passing"
                    date="Jan 31, 2024"
                    link="card2"
                />
                <News
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image3"
                    description="An ASYV Kid Launches Rwanda's First Sign Language Club"
                    date="Feb 29, 2024"
                    link="card3"
                />
            </div>
        </div>

        {/* 6. alumni: */}
        <div className="cards">
            <section className="cards-title">
                <h1>ALUMNI STORIES</h1>
                <p>Discover the Inspiring Journeys of Our Alumni</p>
            </section>
            <div className="cards-wrapper">
                <Alumni
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image1"
                    title="A Story of Transformation"
                    description="Salem Isezerano '23"
                    buttonText="READ MORE"
                    link="card1"
                />
                <Alumni
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image2"
                    title="Anne's Vision for Me, and All of Rwanda"
                    description="Emmanuel Nkundunkundiye '12"
                    buttonText="READ MORE"
                    link="card2"
                />
                <Alumni
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="image3"
                    title="What ASYV Means to Me"
                    description="Pacifique Rutamu '13"
                    buttonText="READ MORE"
                    link="card3"
                />
            </div>
        </div>

        {/* 7. footer: */}
        <HomeFooter/>

        {/* 8. login: */}
        <LoginPopUp showLogin={showLogin} toggleLoginPopup={toggleLoginPopup}/>
        {/* <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
        </p>
        {showLogin && (
            <div className="popup-overlay">
                <div className="popup-content">
                    <div className="LoginTitle">Agahozo-Shalom Youth Village Alumni Platform</div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">
                            Email:
                            <input
                                type="email"
                                id="email"
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
                        <center><button type="submit">Login</button></center> //chat
                        <center><button type="button" onClick={toggleLoginPopup}>Close</button></center> //chat
                    </form>
                </div>
            </div>
        )} */}
    </div>
  )
}
