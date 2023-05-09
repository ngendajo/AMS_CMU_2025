import { useRef,useState, useEffect } from "react"
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

import axios from "../api/axios";
const LOGIN_URL = '/token/';

const Login = () => {
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
        emailRef.current.focus();
    },[])

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
                const user =jwtDecode(accessToken);
                const roles = user.is_superuser ? "superuser" : user.is_crc ? "crc" : user.is_alumni ? "alumni": null
                console.log(roles)
                setAuth({user,roles,email, pwd, accessToken });
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
        errRef.current.focus();
    }

    return (
        
            <div>
                <p ref={errRef} className={errMsg ? "errmsg":
            "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        ref={emailRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />

                    <label htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />

                    <button>Sign In</button>

                </form>
                <p>
                    Need an Account?<br/>
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </p>
            </div>
    )
}

export default Login