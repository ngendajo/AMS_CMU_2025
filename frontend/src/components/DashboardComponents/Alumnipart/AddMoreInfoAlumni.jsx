import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRef, useState, useEffect} from "react";
import '../../Header/header.css';
import '../../Header/searchBar.css';
import '../../Header/searchResultsList.css';
import '../Staffpart/staff.css';
import '../Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "../forms.css";


const USER_REGIX = /^[a-zA-Z- ]{2,50}$/;


export default function Alumni() {
  const [category, setCategory] = useState(6);
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const params = useParams();

  const fatherRef = useRef();
  const motherRef = useRef();

  const [father, setFather] = useState('');
    const [validFather, setValidFather] = useState(false);
    const [fatherFocus, setFatherFocus] = useState(false);

    const [mother, setMother] = useState('');
    const [validMother, setValidMother] = useState(false);
    const [motherFocus, setMotherFocus] = useState(false);  

    /* const [place_of_birth, setPlace_of_birth] = useState('');
    
    const [currResidence, setCurrResidence] = useState(''); 

    const [errMsg, setErrMsg] = useState(''); */
    
    useEffect(() => {
        fatherRef.current.focus();
        motherRef.current.focus();
    },[])

    useEffect(() => {
      const father_result = USER_REGIX.test(father);

      setValidFather(father_result);
  },[father])

  useEffect(() => {
    const mother_result = USER_REGIX.test(mother);

    setValidMother(mother_result);
},[mother])

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/registera/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setUserid(response.data)
              console.log(response.data)
          }catch(err) {
              console.log(err);
          }
      }
  
      getuser();
  
  },[auth,params])

  const handleSubmit = async (e) =>{
    e.preventDefault();

  }


  return (
    <div>
        <div className='alumni-list-heading'>

        <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <span>ASYV Info</span>
          </div>
         
          <div className={category===1? "displayed":"notdisplayed"} onClick={()=>setCategory(1)}>
            <span>Higher Institutions</span>
          </div>

          <div className={category===2? "displayed":"notdisplayed"} onClick={()=>setCategory(2)}>
            <span>Employed</span>
          </div>

          <div className={category===3? "displayed":"notdisplayed"} onClick={()=>setCategory(3)}>
            <span>Scholarship</span>
          </div>

          <div className={category===4? "displayed":"notdisplayed"} onClick={()=>setCategory(4)}>
            <span>Dropout</span>
          </div>

          <div className={category===5? "displayed":"notdisplayed"} onClick={()=>setCategory(5)}>
            <Link className='grades-link' to="/alumni">Go Back</Link>
          </div>

        </div>
        <div className='alumni-list-body'>
          <center>
          {
          userid.map((result, id)=>{
              return <div key={id} className="delete-message"> <h1>Add ASYV Info for  {result.first_name} {result.last_name} with {result.email} as 
              email
              </h1>
              </div>
          }
          )}

        
            <form onSubmit={handleSubmit}>
               
                    <div className="form-content">
                        
                        <div className="formpart">
                            <label htmlFor="first_name">
                                Father Name
                                <span className={validFather ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                                <span className={validFather || !father ? "hide":"invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                            </label>
                            <input
                            type="text"
                            id="father"
                            ref={fatherRef}
                            autoComplete="off"
                            onChange={(e) => setFather(e.target.value)}
                            required
                            aria-invalid={validFather? "false":"true"}
                            aria-describedby="fathernote"
                            onFocus={() => setFatherFocus(true)}
                            onBlur={() => setFatherFocus(false)}
                            />
                            <p id="first_namenote" className={fatherFocus && father && !validFather ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                2 to 50 characters. <br/>
                                Letters allowed.
                            </p>
                        </div>
                        <div className="formpart">
                            <label htmlFor="last_name">
                                Mother Name
                                <span className={validMother ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                                <span className={validMother || !mother ? "hide":"invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                            </label>
                            <input
                            type="text"
                            id="mother"
                            ref={motherRef}
                            autoComplete="off"
                            onChange={(e) => setMother(e.target.value)}
                            required
                            aria-invalid={validMother? "false":"true"}
                            aria-describedby="last_namenote"
                            onFocus={() => setMotherFocus(true)}
                            onBlur={() => setMotherFocus(false)}
                            />
                            <p id="last_namenote" className={motherFocus && mother && !validMother ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle}/>
                                2 to 50 characters. <br/>
                                Letters allowed.
                            </p>
                        </div>
                        
                    </div>

                    <center>
                    <button disabled={!validMother ||  !validMother ? true : false }
                    >Register</button>
                    </center>
                </form>
                </center>
      </div>
        
    </div>
  )
}

