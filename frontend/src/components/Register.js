import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";

const EMAIL_REGIX =/\S+@\S+\.\S+/;
const PHONE_REGIX = /^[0-9]{10}$/;
const USER_REGIX = /^[a-zA-Z- ]{2,50}$/;
const PWD_REGIX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/registercrc/';

const Register = () => {
    const errRef = useRef();
    const emailRef = useRef();
    const first_nameRef = useRef();
    const last_nameRef = useRef();
    const phone1Ref = useRef();
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
    },[email,first_name,last_name,phone1,position,pwd,matchPwd])

   const handleSubmit = async (e) =>{
    e.preventDefault();
    const v1 = EMAIL_REGIX.test(email);
    const v2 = PWD_REGIX.test(pwd);
    const v3 = USER_REGIX.test(first_name);
    const v4 = USER_REGIX.test(last_name);
    const v5 = USER_REGIX.test(position);
    if (!v1 || !v2 || !v3 || !v4 || !v5){
        setErrMsg("Invalid Entry");
        return;
    }
    try{
        const response = await axios.post(REGISTER_URL,
            JSON.stringify({
                email:email,
                first_name:first_name,
                last_name:last_name,
                phone1:phone1,
                password:pwd,
                profile:{
                    position:position
                }
            }),
            {
                headers:{'content-Type':'application/json'},
                withCredentials:true
            }
            );
            console.log(response.data);
            console.log(response.access);
            setSucess(true);
            //clear input fields
    }catch(err){
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 404) {
            setErrMsg('problem with registration');
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
                            <Link to="/home">Sign In</Link>
                        </p>
                    </section>
                ) :(
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">
                        Email
                        <span className={validEmail ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validEmail || !email ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="email"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={validEmail? "false":"true"}
                    aria-describedby="emailnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    />
                    <p id="emailnote" className={EmailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        Provide valid email. 
                    </p>

                    <label htmlFor="first_name">
                        First Name
                        <span className={validFirst_name ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validFirst_name || !first_name ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="text"
                    id="first_name"
                    ref={first_nameRef}
                    autoComplete="off"
                    onChange={(e) => setFirst_name(e.target.value)}
                    required
                    aria-invalid={validFirst_name? "false":"true"}
                    aria-describedby="first_namenote"
                    onFocus={() => setFirst_nameFocus(true)}
                    onBlur={() => setFirst_nameFocus(false)}
                    />
                    <p id="first_namenote" className={first_nameFocus && first_name && !validFirst_name ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        2 to 50 characters. <br/>
                        Letters allowed.
                    </p>

                    <label htmlFor="last_name">
                        Last Name
                        <span className={validLast_name ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validLast_name || !last_name ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="text"
                    id="last_name"
                    ref={last_nameRef}
                    autoComplete="off"
                    onChange={(e) => setLast_name(e.target.value)}
                    required
                    aria-invalid={validLast_name? "false":"true"}
                    aria-describedby="last_namenote"
                    onFocus={() => setLast_nameFocus(true)}
                    onBlur={() => setLast_nameFocus(false)}
                    />
                    <p id="last_namenote" className={last_nameFocus && last_name && !validLast_name ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        2 to 50 characters. <br/>
                        Letters allowed.
                    </p>

                    <label htmlFor="phone1">
                        Phone Number
                        <span className={validPhone1 ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validPhone1 || !phone1 ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="text"
                    id="phone1"
                    ref={phone1Ref}
                    autoComplete="off"
                    onChange={(e) => setPhone1(e.target.value)}
                    required
                    aria-invalid={validPhone1? "false":"true"}
                    aria-describedby="phone1note"
                    onFocus={() => setPhone1Focus(true)}
                    onBlur={() => setPhone1Focus(false)}
                    />
                    <p id="phone1note" className={phone1Focus && phone1 && !validPhone1 ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        Only 10 digits allowed. <br/>
                    </p>

                    <label htmlFor="position">
                        Position
                        <span className={validPosition ? "valid" : "hide"}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </span>
                        <span className={validPosition || !position ? "hide":"invalid"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </span>
                    </label>
                    <input
                    type="text"
                    id="position"
                    ref={positionRef}
                    autoComplete="off"
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    aria-invalid={validPosition? "false":"true"}
                    aria-describedby="positionnote"
                    onFocus={() => setPositionFocus(true)}
                    onBlur={() => setPositionFocus(false)}
                    />
                    <p id="positionnote" className={positionFocus && position && !validPosition ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        2 to 50 characters. <br/>
                        Letters allowed.
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

                    <button disabled={!validFirst_name || !validEmail || !validLast_name || !validPhone1 || !validPosition || !validPwd || !validMatch ? true : false }
                    >Sign Up</button>

                </form>
                <p>
                    Already registered?<br/>
                    <span className="line">
                    <Link to="/home">Sign In</Link>
                    </span>
                </p>
            </section>
            )
            
            }
        </>
  )
}

export default Register