import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { Card } from "../../components/Card";
import axios from "../../api/axios";
import './Home.css'
import HomeHeader from '../../components/home/home_header'
import HomeFooter from '../../components/home/home_footer'
import { News } from "../../components/News";

const LOGIN_URL = '/token/';

export default function Home() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [ pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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
            const user = jwtDecode(accessToken); 
            const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": "visitor"
            console.log(user)
            setAuth({user, roles, email, pwd, accessToken, refresh });
            setEmail('');
            setPwd('');
            navigate(from, { replace:true });
        } catch(err) {
            if(!err?.response){
                setErrMsg("Missing Email or Password");
            } else if (err.response?.status === 401){
                setErrMsg('Unauthorised');
            } else {
                setErrMsg('Login Failed: ' + err);
            }
            setErrMsg('Login Failed');
        }
    }

    return (
        <div>
            <HomeHeader />
            <HomeFooter />
            <h3>Welcome back to our alumni system! Enter your credentials to log in.</h3>
            <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
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
                <center><button>Login</button></center>
            </form>

            <section className="alumni-stories">
        
        <h1>NEWS & EVENTS</h1>
        <p>Stay Updated with the Latest News and Upcoming Events</p>

        </section>
            <div className="cards-wrapper">
            <News  imgSrc="https://www.colorhexa.com/957967.png"
                        imgAlt="Card Image 1"
                        description="Honoring the 30 the Commemoration of the 1994 Genocide Against the Tutsi"
                        date="10th September 2024"
                        link="card1"/>
            <News  imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="Card Image 1"
                    description="On the 10th Anniversary of Anne Heyman’s Passing"
                    date="10th September 2024"
                    link="card2"/>

        <News  imgSrc="https://www.colorhexa.com/957967.png"
                            imgAlt="Card Image 1"
                            description="An ASYV Kid Launches Rwanda’s First Sign Language Club"
                            date="10th September 2024"
                            link="card3"/>

            </div>
    
      
            <section className="alumni-stories">
                
                <h1>ALUMNI STORIES</h1>
                <p>Discover the Inspiring Journeys of Our Alumni</p>

                </section>
              
                <div className="cards-wrapper">
                    <Card
                        imgSrc="https://www.colorhexa.com/957967.png"
                        imgAlt="Card Image 1"
                        title="A Story of Transformation"
                        description="Salem Isezerano ’23"
                        buttonText="Read More"
                        link="card1"
                    />
                    <Card
                        imgSrc="https://www.colorhexa.com/957967.png"
                        imgAlt="Card Image 2"
                        title="Anne’s Vision for Me, and All of Rwanda"
                        description="Emmanuel Nkundunkundiye ’12"
                        buttonText="Read More"
                        link="card2"
                    />
                    <Card
                        imgSrc="https://www.colorhexa.com/957967.png"
                        imgAlt="Card Image 3"
                        title="What ASYV Means to Me"
                        description="This is the card description section"
                        buttonText="Read More"
                        link="card3"
                    />
                </div>
           
        </div>
    );
}