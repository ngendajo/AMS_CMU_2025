import {useRef, useState, useEffect} from "react";
import { useParams } from 'react-router'
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import "../forms.css";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PWD_REGIX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function ChangePassword() {
    const { auth } = useAuth();
    const params = useParams();
   // const [currentPwd, setCurrentPwd] = useState('');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false); 

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();
    const [msg, setMsg] = useState("");
   
    useEffect(() => {
        const result = PWD_REGIX.test(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
    },[pwd,matchPwd])

    useEffect(() => {
        setErrMsg('');
    },[pwd,matchPwd])

   //update user
  const updatePassword =()=>{
    
    if( !(PWD_REGIX.test(pwd))){
        setErrMsg("Enter a valid password.")
    }
    try{
        let formData = new FormData();
        formData.append('password',pwd);
        const response = axios.post("http://127.0.0.1:8000/api/updateuser/"+params.id,
            formData,{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            setMsg("user data updated successfully");
            //clear input fields
    }catch(err){
        if (!err?.response) {
            setErrMsg('No Server Response'+err);
        } else if (err.response?.status === 404) {
            setErrMsg('problem with saving');
        } else{
            setErrMsg("update password Failed"+err)
            console.log(err)
        }
        errRef.current.focus(); 
    }

  }
  
  return (
     <section className="form">
        <div className="updateactivities">
            <p>
                <Link className="lines" to={'/add-crc/'+params.id}>Go back</Link>
            </p>
        </div>
     <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
         {errMsg}
     </p>
     <center className="updatemsg">{msg}</center>
    <center> <h1>Update Staff Info</h1></center>
     <form onSubmit={updatePassword}>
     <center>
     
             <div className="formpart">
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

             <div className="formpart">

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
             </center>
         <center>
         <button>Register</button>
         </center>
     </form>
 </section>
  )
}
