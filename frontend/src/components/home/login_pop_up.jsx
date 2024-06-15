import { React, useState, useEffect } from "react"
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import axios from "../../api/axios";

const LOGIN_URL = '/token/';

export default function LoginPopUp({showLogin, toggleLoginPopup}) {

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

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
                const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": "visitor"
                console.log(user)
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
        
    }

    return (
        <div>
            <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            {showLogin && (
                <div className="PopUpWindow">
                    <div className="PopUpContent">
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
                            <div className="ConfirmButtons">
                                <button type="submit">Login</button>
                                <button type="button" onClick={toggleLoginPopup}>Close</button>
                            </div>
                            <Link to="/home" className="ForgetPassword">Forgot Password?</Link>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )}