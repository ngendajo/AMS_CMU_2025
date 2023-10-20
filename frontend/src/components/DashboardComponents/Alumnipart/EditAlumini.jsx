import {useRef, useState, useEffect} from "react";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import "../forms.css";
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropzone from "react-dropzone"; 
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../api/baseUrl";
import baseUrlforImg from "../../../api/baseUrlforImg";


const EMAIL_REGIX =/\S+@\S+\.\S+/;
const PHONE_REGIX = /^[0-9]{10}$/;
const USER_REGIX = /^[a-zA-Z- ']{2,50}$/;

export default function EditAlumini() {
    const { auth } = useAuth();
    const params = useParams();
    const navigate = useNavigate();
    const [currentfile, setCurrentfile] = useState();
    const [msg, setMsg] = useState("");
    const [alum, setAlum] = useState(0);

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



    useEffect(() =>{
    
        const getuser = async () =>{
            try{
                const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                data.forEach((result)=>{
                    setEmail(result.email);
                    setFirst_name(result.first_name);
                    setLast_name(result.last_name);
                    setPhone1(result.phone1);
                    setCurrentfile(result.image_url);
                    setAlum(result.alumn?.id);
                })
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getuser();
    
    },[auth,params])
    const current = new Date();
    const [file, setFile] = useState();
    const [disiplayfile, setDisplayifile] = useState(true);

    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const generateUniqueFilename = () => {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(7);
        return `${timestamp}_${randomString}`;
      };

      const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
            setFile(URL.createObjectURL(files[0]));
                
            setDisplayifile(false)
            try{
                let formData = new FormData();
                formData.append('image_url',files[0], uniqueFilename);
                const response = axios.post(baseUrl+"/updateuserimage/"+params.id,
                    formData,{
                        headers: {
                            "Authorization": 'Bearer ' + String(auth.accessToken),
                            "Content-Type": 'multipart/form-data'
                        },
                        withCredentials:true
                    }
                    );
                    console.log(response.data)
                    setMsg("Image updated successfully");
                    //clear input fields
            }catch(err){
                if (!err?.response) {
                    setErrMsg('No Server Response'+err);
                } else if (err.response?.status === 404) {
                    setErrMsg('problem with saving');
                } else{
                    setErrMsg("update image Failed"+err)
                    console.log(err)
                }
                errRef.current.focus(); 
                navigate('/error');
            }
        }
      };

    const errRef = useRef();
    const emailRef = useRef();
    const first_nameRef = useRef();
    const last_nameRef = useRef();
    const phone1Ref = useRef();

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

   //update user
  const updateEmail =()=>{
    
    if(!(EMAIL_REGIX.test(email)) || !(USER_REGIX.test(first_name)) || !(USER_REGIX.test(first_name))){
        setErrMsg("Enter a valid user data.")
    }
    try{
        let formData = new FormData();
        formData.append('email',email);
        formData.append('first_name',first_name);
        formData.append('last_name',last_name);
        formData.append('phone1',phone1);
        const response = axios.post(baseUrl+"/updateuser/"+params.id,
            formData,{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            if(alum>0){
                navigate(`/alumni/updateasyvinfo/${params.id}`)
            }else{
                navigate(`/add-alumni/info/${params.id}`)
            }
            setMsg("user data updated successfully");
            //clear input fields
    }catch(err){
        if (!err?.response) {
            setErrMsg('No Server Response'+err);
        } else if (err.response?.status === 404) {
            setErrMsg('problem with saving');
        } else{
            setErrMsg("update image Failed"+err)
            console.log(err)
        }
        errRef.current.focus(); 
        navigate('/error');
    }

  }
    console.log(file)
  return (
     <section className="form">
        <div className="updateactivities">
            <p>
            <Link className="lines" to={auth.user.is_alumni?"/":"/alumni"}>Go back</Link>
            </p>
            {/* <p>
                <Link className="lines" to={'/add-crc/ps/'+params.id}>Update Password</Link>
            </p> */}
        </div>
     <p ref={errRef} className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
         {errMsg}
     </p>
     <center className="updatemsg">{msg}</center>
    <center> <h1>Update Alumni Info</h1></center>
     <form>
     <center>
     {disiplayfile ? <img className="img-for-profile" src={baseUrlforImg+currentfile} alt="" />:
     <img className="img-for-profile" src={file} alt="" />
     }
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
                         "Drag and drop image here, or click to select it"
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
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 aria-invalid={validEmail? "false":"true"}
                 aria-describedby="emailnote"
                 onFocus={() => setEmailFocus(true)}
                 onBlur={() => setEmailFocus(false)}
                 disabled={auth.user.is_alumni?true:false}
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
                 value={first_name}
                 ref={first_nameRef}
                 autoComplete="off"
                 onChange={(e) => setFirst_name(e.target.value)}
                 required
                 aria-invalid={validFirst_name? "false":"true"}
                 aria-describedby="first_namenote"
                 onFocus={() => setFirst_nameFocus(true)}
                 onBlur={() => setFirst_nameFocus(false)}
                 disabled={auth.user.is_alumni?true:false}
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
                 value={last_name}
                 ref={last_nameRef}
                 autoComplete="off"
                 onChange={(e) => setLast_name(e.target.value)}
                 required
                 aria-invalid={validLast_name? "false":"true"}
                 aria-describedby="last_namenote"
                 onFocus={() => setLast_nameFocus(true)}
                 onBlur={() => setLast_nameFocus(false)}
                 disabled={auth.user.is_alumni?true:false}
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
             value={phone1}
             ref={phone1Ref}
             autoComplete="off"
             onChange={(e) => setPhone1(e.target.value)}
             required
             aria-invalid={validPhone1? "false":"true"}
             aria-describedby="phone1note"
             onFocus={() => setPhone1Focus(true)}
             onBlur={() => setPhone1Focus(false)}
             disabled={auth.user.is_alumni?true:false}
             />
             <p id="phone1note" className={phone1Focus && phone1 && !validPhone1 ? "instructions" : "offscreen"}>
                 <FontAwesomeIcon icon={faInfoCircle}/>
                 Only 10 digits allowed. <br/>
             </p>

             </div>
         </div>
        {auth.user.is_alumni?null:
         <center>
         {((EMAIL_REGIX.test(email)) && (USER_REGIX.test(first_name)) && (USER_REGIX.test(first_name)) && (PHONE_REGIX.test(phone1)))?<center onClick={updateEmail}><h1 className="saveemail">Update</h1></center>:null}
         
         </center>
         }
     </form>
 </section>
  )
}
