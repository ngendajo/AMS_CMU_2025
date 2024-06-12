import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import baseUrl from "../../api/baseUrl";


const PWD_REGIX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Password() {
    const {auth} = useAuth()
    const navigate = useNavigate();

    const errRef = useRef();
    const [current_password, setCurrent_password] = useState('');
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false); 

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const result = PWD_REGIX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    },[pwd,matchPwd])

    useEffect(() => {
        setErrMsg('');
    },[pwd,matchPwd])
    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        
        const v2 = PWD_REGIX.test(pwd);
        if (!v2 ){
            setErrMsg("Invalid Password");
            return;
        }
        try{
            let formData = new FormData();

            formData.append('new_password',pwd);
            formData.append('current_password',current_password);
            const response = await axios.post(baseUrl+"/changepassword/",
                formData,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                }
                );
                console.log(response.data)
                navigate("/")
                //clear input fields
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response'+err);
            } else if (err.response?.status === 404) {
                setErrMsg('problem with Change Password');
            } else{
                setErrMsg("Change Password Failed"+err)
                console.log(err)
            }
            errRef.current.focus(); 
            navigate('/error');
        }
       }
  return (
    <div className='alumni-profile-personal-info'>
            
        <center> 
        <h1>
            Create a New Password
            </h1>
        </center>
            <center>
            <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
            </center>
                <form onSubmit={handleSubmit} className="form changepasswords">
                <div className="formpartpass">
                        <label htmlFor="password">
                            Current Password
                        </label>
                        <input
                        type="password"
                        id="current_password"
                        autoComplete="off"
                        onChange={(e) => setCurrent_password(e.target.value)}
                        required
                        />
                        </div>
                    <div className="formpartpass">
                        <label htmlFor="password">
                            New Password
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
                        </div>

                        <div className="formpartpass">

                        <label htmlFor="confirm_pwd">
                            Confirm Password
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
                        </div>
                        <div>
                            <button disabled={ !validPwd || !validMatch ? true : false }
                            >Create password</button>
                            </div>
                        </form>
            
        </div>
  )
}
