import {useRef, useState, useEffect} from "react";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import "../forms.css";
import Dropzone from "react-dropzone"; 

const EMAIL_REGIX =/\S+@\S+\.\S+/;
const PHONE_REGIX = /^[0-9]{10}$/;
const USER_REGIX = /^[a-zA-Z- ']{2,50}$/;

const Registera = () => {
    const {auth} = useAuth()
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const current = new Date();
    const [file, setFile] = useState();

    const [selectedFiles, setSelectedFiles] = useState(undefined);

      const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            setFile(URL.createObjectURL(files[0]));
        }
      };

    const errRef = useRef();
    const emailRef = useRef();
    const first_nameRef = useRef();
    const last_nameRef = useRef();
    const phone1Ref = useRef();

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

    const [errMsg, setErrMsg] = useState('');
    
    useEffect(() => {
        emailRef.current.focus();
        first_nameRef.current.focus();
        last_nameRef.current.focus();
        phone1Ref.current.focus();
    },[])
    useEffect(() => {
        const email_result = EMAIL_REGIX.test(email);

        setValidEmail(email_result);
    },[email])
    useEffect(() => {
        const first_name_result = USER_REGIX.test(first_name);

        setValidFirst_name(first_name_result);
    },[first_name])

    useEffect(() => {
        const last_name_result = USER_REGIX.test(last_name);

        setValidLast_name(last_name_result);
    },[last_name])

    useEffect(() => {
        const phone1_result = PHONE_REGIX.test(phone1);

        setValidPhone1(phone1_result);
    },[phone1])


    useEffect(() => {
        setErrMsg('');
    },[email,first_name,last_name,phone1])


   const handleSubmit = async (e) =>{
    e.preventDefault();
    if (selectedFiles && selectedFiles[0].name){
        var imgname=email+current+".jpeg"
    const file = new File(selectedFiles, imgname);
          setImage({
            image_url:file,
        });
    }else{
        setErrMsg("Select file")
        return;
    }
    if(!image){
        return;
    }
    
    const v1 = EMAIL_REGIX.test(email);
    const v3 = USER_REGIX.test(first_name);
    const v4 = USER_REGIX.test(last_name);
    if (!v1 || !v3 || !v4){
        setErrMsg("Invalid Entry");
        return;
    }
    try{
        let formData = new FormData();
        
        formData.append('email',email);
        formData.append('first_name',first_name);
        formData.append('last_name',last_name);
        formData.append('phone1',phone1);
        formData.append('password',"Agahozo@12");
        formData.append('image_url',image.image_url);
        const response = await axios.post("http://127.0.0.1:8000/api/alumni/",
            formData,{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            navigate("/alumni")
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
                <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
               <center> <h1>Add Alumni</h1></center>
                <form onSubmit={handleSubmit}>
                <center>
                <img className="img-for-profile" src={file} alt="" />
                <Dropzone onDrop={onDrop} multiple={false}>
                            {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                {selectedFiles && selectedFiles[0].name ? (
                                    <div className="selected-file">
                                    {selectedFiles && selectedFiles[0].name}
                                    </div>
                                ) : (
                                    <span><strong className="browse">Browse</strong> <strong>photo</strong><br/> or drag and drop</span>
                                )}
                                </div>
                            </section>
                            )}
                        </Dropzone>
                        </center>
                    <div className="form-content">
                        <div className="formpart">
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
                        </div>
                        <div className="formpart">
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
                        </div>
                        <div className="formpart">
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
                        </div>
                        <div className="formpart">
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

                        </div>

                        
                    </div>

                    <center>
                    <button disabled={!validFirst_name || !validEmail || !validLast_name || !validPhone1 ? true : false }
                    >Register</button>
                    </center>
                </form>
                <p>
                    <Link className="line" to="/alumni">Go back</Link>
                </p>
            </section>
  )
}

export default Registera