import {useRef, useState, useEffect} from "react";
import { useParams } from 'react-router'
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import "../forms.css";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const USER_REGIX = /^[a-zA-Z- ]{2,50}$/;

export default function EditPosition() {
    const { auth } = useAuth();
    const params = useParams();
    const [msg, setMsg] = useState("");

    const [position, setPosition] = useState('kkj');
    const [validPosition, setValidPosition] = useState(false);
    const [positionFocus, setPositionFocus] = useState(false);


    useEffect(() =>{
    
        const getuser = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/registeradmin/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                data.forEach((result)=>{
                    setPosition(result.profile ? result.profile.position:"Owner");
                })
            }catch(err) {
                console.log(err);
            }
        }
    
        getuser();
    
    },[auth,params])

      
    const errRef = useRef();
    const positionRef = useRef();

    const [errMsg, setErrMsg] = useState('');
    
    useEffect(() => {
        positionRef.current.focus();
    },[])
    
    useEffect(() => {
        const position_result = USER_REGIX.test(position);

        setValidPosition(position_result);
    },[position])

    
    useEffect(() => {
        setErrMsg('');
    },[position])


   const handleSubmit = async (e) =>{
    e.preventDefault();
    
    
    const v5 = USER_REGIX.test(position);
    if (!v5){
        setErrMsg("Invalid Entry");
        return;
    }
    try{
        let formData = new FormData();
        
        formData.append('posotion',position);
        const response = await axios.post("http://127.0.0.1:8000/api/registercrc/",
            formData,{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            setMsg("First name updated successfully");
            //clear input fields
    }catch(err){
        if (!err?.response) {
            setErrMsg('No Server Response'+err);
        } else if (err.response?.status === 404) {
            setErrMsg('problem with registration');
        } else{
            setErrMsg("Registration Failed"+err)
            console.log(err)
        }
        errRef.current.focus(); 
    }
   }


    return (
        <section className="form">
            <div className="updateactivities">
                <p>
                    <Link className="lines" to={'/add-crc/'+params.id}>Go Back</Link>
                </p>
                <p>
                    <Link className="lines" to={'/add-crc/ps/'+params.id}>Update Password</Link>
                </p>
            </div>
        <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
            {errMsg}
        </p>
        <center className="updatemsg">{msg}</center>
        <center> <h1>Update Staff Info</h1></center>
        <form onSubmit={handleSubmit}>
        <center>
                <div className="formpart">
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
                value={position}
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

                </div>
                </center>
            <center>
            <button>Register</button>
            </center>
        </form>
    </section>
    )
}
