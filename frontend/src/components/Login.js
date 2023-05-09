import { useRef,useState, useEffect, useContext } from "react"
import AuthContext from "../context/AuthProvider";

import axios from "../api/axios";
const LOGIN_URL = '/token/';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const emailRef =useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [ pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState('');

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
                setAuth({email, pwd, accessToken });
                setEmail('');
                setPwd('');
                console.log(accessToken)
                setSuccess(true);
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
        <>
        {success ? (
            <section>
                <h1>You are logged in!</h1>
                <p>
                    <p>Go to Home</p>
                </p>
            </section>
        ):(
            <section>
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
                        <p>Sign Up</p>
                    </span>
                </p>
            </section>
        )}
        </>
    )
}

export default Login