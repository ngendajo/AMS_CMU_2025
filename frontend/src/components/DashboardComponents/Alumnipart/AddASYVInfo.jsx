import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRef, useState, useEffect} from "react";
import '../../Header/header.css';
import '../../Header/searchBar.css';
import '../../Header/searchResultsList.css';
import '../Staffpart/staff.css';
import '../Alumnipart/alumni.css';
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "../forms.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../api/baseUrl";
import baseUrlforImg from "../../../api/baseUrlforImg";


const USER_REGIX = /^[a-zA-Z- ']{2,50}$/;

export default function AddASYVInfo() {
  const [userid, setUserid]=useState([]);
  const [gradeSelected, setGradeSelected]=useState(false);
  const { auth } = useAuth();
  const params = useParams();
  let [combination, setCombination] = useState([]);
  let [grades, setGrades] = useState([]);
  let [families, setFamilies] = useState([]);
  let [eps, setEps] = useState([]);
    let [epsdone, setEpsdone] = useState([]);
    const navigate = useNavigate();
    const [marital_status, setMarital_status] = useState('');
    const [gender, setGender] = useState('')
    const [kids, setKids] = useState('')
    const [decision, setDecision] = useState('')
    const [life_status, setLife_status] = useState('')
    

    const [s4marks, setS4marks] = useState('');
      const [s5marks, setS5marks] = useState('');
      const [s6marks, setS6marks] = useState('');
      const [ne, setNe] = useState('0.0');
      const [maxforne, setMaxforne] = useState('');

    useEffect(() =>{
    
        const getgrades = async () =>{
            try{
                const response = await axios.get(baseUrl+'/grades/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setGrades(response.data)
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getgrades();
    
    },[auth])
    const getfamilies = (event) => {
        const id = event.target.value;
        grades.forEach((grade)=>{
            if(parseInt(grade.id,10) === parseInt(id,10)){
                setFamilies(grade.families);
                setGradeSelected(true);
            }
        })
        
    }

    var handleChangeofEp = (selectedOption) => {
      setEpsdone(selectedOption);
    };

    useEffect(() =>{
    
      const geteps = async () =>{
          try{
              const response = await axios.get(baseUrl+'/ep/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              var eplist=[]
              response.data.forEach(element => {
                eplist.push(
                  { value: element.id, label: element.title }
                )
              });
              setEps(eplist)
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      geteps();
  
  },[auth])

    useEffect(() =>{
    
      const getcombinations = async () =>{
          try{
              const response = await axios.get(baseUrl+'/combination/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setCombination(response.data);
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getcombinations();
  
  },[auth])

  const fatherRef = useRef();
  const motherRef = useRef();

  const [father, setFather] = useState('NN');
    const [validFather, setValidFather] = useState(false);
    const [fatherFocus, setFatherFocus] = useState(false);

    const [mother, setMother] = useState('NN');
    const [validMother, setValidMother] = useState(false);
    const [motherFocus, setMotherFocus] = useState(false);  
    
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
              const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setUserid(response.data)
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getuser();
  
  },[auth,params])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    let ep_ids=[];
    epsdone.forEach((ep)=>{
        ep_ids.push(ep.value)
    })
    axios.post(baseUrl+'/alumni/info/', {
        "user":params.id,
        "marital_status":marital_status,
        "gender":gender,
        "family":e.target.family.value,
        "combination":e.target.combination.value,
        "eps":ep_ids,
        "kids":kids,
        "father":father,
        "mother":mother,
        "place_of_birth":e.target.place_of_birth.value,
        "currresidence":e.target.currResidence.value,
        's4marks':s4marks,
        's5marks':s5marks,
        's6marks':s6marks,
        'ne':ne,
        'maxforne':maxforne,
        'decision':decision,
        'life_status':life_status
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        console.log(res.data.id) 
        alert(" created successfully")
        navigate(`/add-alumni/info/${params.id}/study`)
    })
    .catch(error => console.log(error.response.data)
    )
     

  }
  return (
    <center>
    {
    userid.map((result, id)=>{
        return <div key={id} className="delete-message"> 
        <img src={baseUrlforImg+result.image_url} alt="logo" className="user-image-icon" />
        <h1>Add ASYV Info for  {result.first_name} {result.last_name} with {result.email} as 
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
                      value={father}
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
                      <label htmlFor="mother_name">
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
                      value={mother}
                      autoComplete="off"
                      onChange={(e) => setMother(e.target.value)}
                      required
                      aria-invalid={validMother? "false":"true"}
                      aria-describedby="mother_namenote"
                      onFocus={() => setMotherFocus(true)}
                      onBlur={() => setMotherFocus(false)}
                      />
                      <p id="mother_namenote" className={motherFocus && mother && !validMother ? "instructions" : "offscreen"}>
                          <FontAwesomeIcon icon={faInfoCircle}/>
                          2 to 50 characters. <br/>
                          Letters allowed.
                      </p>
                  </div>

                  <div className="formpart">
                      <label htmlFor="marital_status">
                          Marital Status
                      </label>
                      <select name="marital_status" value={marital_status} onChange={(event) => setMarital_status(event.target.value)}>
                      <option value="" disabled>Select marital status</option>
                        <option value="Single">Single</option>
                        <option value="Maried">Maried</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="gender">
                          Gender
                      </label>
                      <select name="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
                      <option value="" disabled>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="place_of_birth">
                          Place of origin
                      </label>
                      <input type="text" name="place_of_birth" />
                  </div>
                  <div className="formpart">
                      <label htmlFor="currResidence">
                          Current Residence
                      </label>
                      <input type="text" name="currResidence" />
                  </div>
                  <div className="formpart">
                      <label htmlFor="kids">
                          Do you have kids
                      </label>
                      <select name="kids" value={kids} onChange={(event) => setKids(event.target.value)}>
                      <option value="" disabled>Select your choice</option>
                        <option value="false">Yes</option>
                        <option value="true">No</option>
                      </select>
                  </div>

                  <div className="formpart"> 
                      <label htmlFor="grade">
                          Grade
                      </label>     
                          <select name="grade" onChange={getfamilies}>
                            <option value="">select grade</option>
                              {grades.map((e,ind) => {
                                  return  <option key={ind} value={e.id}>{e.grade_name}</option>
                              })}               
                          </select> 
                  </div>
                  <div className={gradeSelected? "formpart":"hide"}> 
                  <label htmlFor="family">
                          Family
                      </label>      
                          <select name="family">
                          <option value="" disabled>Select your family</option>
                              {families.map((e,ind) => {
                                  return  <option key={ind} value={e.id}>{e.family_name}</option>
                              })}               
                          </select> 
                  </div>

                  <div className="formpart">
                      <label htmlFor="combination">
                      Combination
                      </label>
                      
                      <select name='combination'>
                        <option value="" disabled>select combination</option>
                      {combination.map((e,ind) => {
                        return  <option key={ind} value={e.id}>{e.combination_name}</option>
                          })}
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="eps">
                          Eps done
                      </label>
                      <Select value={epsdone} isMulti onChange={handleChangeofEp} options={eps} />
                  </div>
                  <div className="formpart">
                      <label htmlFor="eps">
                          Marks for S4
                      </label>
                      <input
                            type='number'
                            step="0.01"
                            min='0'
                            max='100'
                            value={s4marks}
                            onChange={(event) => setS4marks(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="eps">
                          Marks for S5
                      </label>
                      <input
                            type='number'
                            step="0.01"
                            min='0'
                            max='100'
                            value={s5marks}
                            onChange={(event) => setS5marks(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="eps">
                          Marks for S6
                      </label>
                      <input
                            type='number'
                            step="0.01"
                            min='0'
                            max='100'
                            value={s6marks}
                            onChange={(event) => setS6marks(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="eps">
                          The highest aggregate in national exam
                      </label>
                      <input
                            type='number'
                            step="0.01"
                            min='0'
                            max='100'
                            value={maxforne}
                            onChange={(event) => setMaxforne(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="eps">
                          Your aggregate
                      </label>
                      <input
                            type='number'
                            step="0.01"
                            min='0'
                            max='100'
                            value={ne}
                            onChange={(event) => setNe(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="decision">
                          Decision
                      </label>
                      <select name="decision" value={decision} onChange={(event) => setDecision(event.target.value)}>
                      <option value="" disabled>Select your choice</option>
                        <option value="P">Pass</option>
                        <option value="F">Fail</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="life_status">
                          Life Status
                      </label>
                      <select name="life_status" value={life_status} onChange={(event) => setLife_status(event.target.value)}>
                      <option value="A" selected>Alive</option>
                        <option value="D">Died</option>
                      </select>
                  </div>
              </div>

              <center>
              <button>Save and continue</button>
              </center>
          </form>
          </center>
  )
}
