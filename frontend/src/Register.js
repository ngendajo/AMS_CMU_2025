import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FntAwesomeIcon, FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

const EMAIL_REGIX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const PHONE_REGIX = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i;
const USER_REGIX = /^[a-zA-Z][a-zA-z0-9-_]{2,50}$/;
const PWD_REGIX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/registercrc/';

const Register = () => {
    const emailRef = useRef();
    const first_nameRef = useRef();
    const last_nameRef = useRef();
    const phone1Ref = useRef();
    const phone2Ref = useRef();
    const positionRef = useRef();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [EmailFocus, setEmailFocus] = useState(false);

    const [first_name, setFirst_name] = useState('');
    const [validFirst_name, setValidFirst_name] = useState(false);
    const [first_nameFocus, setFirst_nameFocus] = useState(false); 

    const [last_name, setLast_name] = useState('');
    const [validLast_name, setValidLast_name] = useState(false);
    const [last_nameFocus, setLast_nameFocus] = useState(false); 

    const [phone1, setPhone1] = useState('');
    const [validPhone1, setValidPhone1] = useState(false);
    const [phone1Focus, setPhone1Focus] = useState(false); 

    const [phone2, setPhone2] = useState('');
    const [validPhone2, setValidPhone2] = useState(false);
    const [phone2Focus, setPhone2Focus] = useState(false); 

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false); 

    const [position, setPosition] = useState('');
    const [validPosition, setValidPosition] = useState(false);
    const [positionFocus, setPositionFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false); 

    const [errMsg, setErrMsg] = useState('');
    const [sucess, setSucess] = useState(false);
    
    useEffect(() => {
        emailRef.current.focus();
        first_nameRef.current.focus();
        last_nameRef.current.focus();
        phone1Ref.current.focus();
        phone2Ref.current.focus();
        positionRef.current.focus();
    },[])
    useEffect(() => {
        const email_result = EMAIL_REGIX.test(email);

        console.log(email_result);
        console.log(email);
        setValidEmail(email_result);
    },[email])
    useEffect(() => {
        const first_name_result = USER_REGIX.test(first_name);

        console.log(first_name_result);
        console.log(first_name);
        setValidFirst_name(first_name_result);
    },[first_name])

    useEffect(() => {
        const last_name_result = USER_REGIX.test(last_name);

        console.log(last_name_result);
        console.log(last_name);
        setValidLast_name(last_name_result);
    },[last_name])

    useEffect(() => {
        const phone1_result = PHONE_REGIX.test(phone1);

        console.log(phone1_result);
        console.log(phone1);
        setValidPhone1(phone1_result);
    },[phone1])

    useEffect(() => {
        const phone2_result = PHONE_REGIX.test(phone2);

        console.log(phone2_result);
        console.log(phone2);
        setValidPhone2(phone2_result);
    },[phone2])

    useEffect(() => {
        const position_result = USER_REGIX.test(position);

        console.log(position_result);
        console.log(position);
        setValidPosition(position_result);
    },[position])

    useEffect(() => {
        const result = PWD_REGIX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    },[pwd,matchPwd])

    useEffect(() => {
        setErrMsg('');
    },[user,pwd,matchPwd])

   const handleSubmit = async (e) =>{
    e.preventDefault();
    const v1 = EMAIL_REGIX.test(email);
    const v2 = PWD_REGIX.test(pwd);
    const v3 = USER_REGIX.test(first_name);
    const v4 = USER_REGIX.test(last_name);
    const v5 = USER_REGIX.test(phone1);
    const v6 = USER_REGIX.test(phone2);
    const v7 = USER_REGIX.test(position);
    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7){
        setErrMsg("Invalid Entry");
        return;
    }
    try{
        const response = await axios.post(REGISTER_URL,
            JSON.stringify({username:user,password:pwd}),
            {
                headers:{'content-Type':'application/json'},
                withCredentials:true
            }
            );
            console.log(response.data);
            console.log(response.access);
            console.log(JSON.stringify(response));
            setSucess(true);
            //clear input fields
    }catch(err){
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 404) {
            setErrMsg('Username Taken');
        } else{
            setErrMsg("Registration Failed")
        }
        errRef.current.focus(); 
    }
   }

    return (
        <>
            {sucess ? (
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="#">Sign In</a>
                        </p>
                    </section>
                ) :(
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Username
                        <span className={validName ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validName || !user ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName? "false":"true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    />
                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        4 to 24 characters. <br/>
                        Must begin with a letter. <br />
                        Letters, numbers, underscoresw, hyphens allowed.
                    </p>

                    <label htmlFor="password">
                        Password:
                        <span className={validPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validPwd || !pwd ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="password"
                    id="password"
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd? "false":"true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        8 to 24 characters. <br/>
                        Must include uppercase and lowercase letters, a number and a special character. <br />
                        Allowed special characters:<span aria-label="exclamation mark">!</span>
                        <span aria-label="at symbol">@</span>
                        <span aria-label="hashtag">#</span>
                        <span aria-label="dollar sign">$</span>
                        <span aria-label="percent">%</span>.
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <span className={validMatch && matchPwd ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validMatch || !matchPwd ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="password"
                    id="confirm_pwd"
                    autoComplete="off"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch? "false":"true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        Must match the password input field.
                    </p>

                    <button disabled={!validName || !validPwd || !validMatch ? true : false }
                    >Sign Up</button>

                </form>
                <p>
                    Already registered?<br/>
                    <span className="line">
                        <a href="#">Sign In</a>
                    </span>
                </p>
            </section>
            )
            
            }
        </>
  )
}

export default Register