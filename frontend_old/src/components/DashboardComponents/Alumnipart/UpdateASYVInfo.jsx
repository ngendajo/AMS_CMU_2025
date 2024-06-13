import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRef, useState, useEffect} from "react";
import ItemForm from "../Alumnipart/formSteps/ItemForm"
import { districts, sectorsByDistrict } from "../Alumnipart/formSteps/DistrictData"
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
    const [marital_status, setMarital_status] = useState('');
    const [alumn_id, setAlumn_id] = useState(0);
    const [gender, setGender] = useState('');
    const [did_you_born_in_rwanda, setDid_you_born_in_rwanda] = useState('Yes');
    const [place_of_birth_district_or_country, setPlace_of_birth_district_or_country] = useState('');
    const [place_of_birth_sector_or_city, setPlace_of_birth_sector_or_city] = useState('');
    const [currresidence_in_rwanda, setCurrresidence_in_rwanda] = useState('Yes');
    const [currresidence_district_or_country, setCurrresidence_district_or_country] = useState('');
    const [currresidence_sector_or_city, setCurrresidence_sector_or_city] = useState('');
    const [kids, setKids] = useState('');
    let [grade, setGrade] = useState([]);
    let [family, setFamily] = useState([]);
    let [comb, setComb] = useState([]);
    
    const [s4marks, setS4marks] = useState('');
      const [s5marks, setS5marks] = useState('');
      const [s6marks, setS6marks] = useState('');
      const [ne, setNe] = useState('');
      const [maxforne, setMaxforne] = useState('');
      const [decision, setDecision] = useState('');
      const [life_status, setLife_status] = useState('');
      const [date_of_birth,setDate_of_birth]=useState('');

    const navigate = useNavigate();
    const handleDistrictChange = (e) => {
        const district = e.target.value;
      
        // First, update the selected district
        setPlace_of_birth_district_or_country(district );
        
        // Reset the selected sector when the district changes
        setPlace_of_birth_sector_or_city('');
      };
      const handleDistrictChangeCu = (e) => {
        const district = e.target.value;
      
        // First, update the selected district
        setCurrresidence_district_or_country(district );
        
        // Reset the selected sector when the district changes
        setCurrresidence_sector_or_city('');
      };
    
      useEffect(() => {
        districts.forEach((d) => {
          if (d === place_of_birth_district_or_country) {
            setPlace_of_birth_district_or_country(d);
          }
        });
      }, [place_of_birth_district_or_country]);
      useEffect(() => {
        districts.forEach((district) => {
          if(sectorsByDistrict[district].length>0){
            sectorsByDistrict[district].forEach((sect)=>{
              if (sect === place_of_birth_sector_or_city) {
                setPlace_of_birth_sector_or_city(sect);
              }
            })
          }
          
        });
      }, [place_of_birth_sector_or_city]);

      useEffect(() => {
        districts.forEach((d) => {
          if (d === currresidence_district_or_country) {
            setCurrresidence_district_or_country(d);
          }
        });
      }, [currresidence_district_or_country]);
      useEffect(() => {
        districts.forEach((district) => {
          if(sectorsByDistrict[district].length>0){
            sectorsByDistrict[district].forEach((sect)=>{
              if (sect === currresidence_sector_or_city) {
                setCurrresidence_sector_or_city(sect);
              }
            })
          }
          
        });
      }, [currresidence_sector_or_city]);

    const setCombinations= (id)=>{
        combination.forEach((e)=>{
            if(Number(e.id)===Number(id)){
                setComb(e);
            }
        })
    }
    const setFamilie =(id)=>{
        families.forEach((e)=>{
            if(Number(e.id)===Number(id)){
                setFamily(e);
            }
        })
    }

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
                setGrade(grade)
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

  //const fatherRef = useRef();
  //const motherRef = useRef();

  const [father, setFather] = useState('NN');
    //const [validFather, setValidFather] = useState(false);
    //const [fatherFocus, setFatherFocus] = useState(false);

    const [mother, setMother] = useState('NN');
    //const [validMother, setValidMother] = useState(false);
    //const [motherFocus, setMotherFocus] = useState(false);  
    
    /* useEffect(() => {
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
},[mother]) */

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
            const getsavedfamilies = (id) => {
                grades.forEach((grade)=>{
                    if(parseInt(grade.id,10) === parseInt(id,10)){
                        setFamilies(grade.families);
                        setGradeSelected(true);
                    }
                })
                
            }
              const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              
                
              //console.log(response.data)
              setUserid(response.data)
              response.data.forEach((dat)=>{
                const inputDateString = dat.alumn.date_of_birth;
                const inputDate = new Date(inputDateString);
                
                const formattedDate = `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1).toString().padStart(2, '0')}-${inputDate.getDate().toString().padStart(2, '0')}`;
                //console.log(formattedDate)
                setFather(dat.alumn.father);
                setMother(dat.alumn.mother);
                setMarital_status(dat.alumn.marital_status);
                setGender(dat.alumn.gender);
                setKids(dat.alumn.kids);
                setDid_you_born_in_rwanda(dat.alumn.did_you_born_in_rwanda?"Yes":"No")
                setPlace_of_birth_district_or_country(dat.alumn.place_of_birth_district_or_country)
                setPlace_of_birth_sector_or_city(dat.alumn.place_of_birth_sector_or_city)
                setCurrresidence_in_rwanda(dat.alumn.currresidence_in_rwanda?"Yes":"No");
                setCurrresidence_district_or_country(dat.alumn.currresidence_district_or_country);
                setCurrresidence_sector_or_city(dat.alumn.currresidence_sector_or_city);
                setFamily(dat.alumn.family);
                setGrade(dat.alumn.family.grade);
                setComb(dat.alumn.combination);
                getsavedfamilies(dat.alumn.family.grade.id);
                setAlumn_id(dat.alumn.id);
                setS4marks(dat.alumn.s4marks)
                setS5marks(dat.alumn.s5marks)
                setS6marks(dat.alumn.s6marks)
                setNe(dat.alumn.ne)
                setMaxforne(dat.alumn.maxforne)
                setDecision(dat.alumn.decision)
                setLife_status(dat.alumn.life_status)
                setDate_of_birth(formattedDate)
                var eplist=[]
                dat.alumn.eps.forEach(element => {
                eplist.push(
                  { value: element.id, label: element.title }
                )
              });
              setEpsdone(eplist)
              })
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getuser();
  
  },[auth,params,grades])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    let ep_ids=[];
    epsdone.forEach((ep)=>{
        ep_ids.push(ep.value)
    })
    
    axios.put(baseUrl+'/alumni/info/'+alumn_id+"/update/", {
        "marital_status":marital_status,
        "date_of_birth":date_of_birth,
        "gender":gender,
        "family":family.id,
        "combination":comb.id,
        "eps":ep_ids,
        "kids":kids,
        "father":father,
        "mother":mother,
        "did_you_born_in_rwanda":did_you_born_in_rwanda=="Yes"?true:false,
        "place_of_birth_district_or_country":did_you_born_in_rwanda, 
        "place_of_birth_sector_or_city":place_of_birth_sector_or_city,
        "currresidence_in_rwanda":currresidence_in_rwanda=="Yes"?true:false,
        "currresidence_district_or_country":currresidence_district_or_country,
        "currresidence_sector_or_city":currresidence_sector_or_city,
        "s4marks":s4marks,
        "s5marks":s5marks,
        "s6marks":s6marks,
        "ne":ne,
        "maxforne":maxforne,
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
        console.log(res) 
        alert(" updated successfully")
        navigate(`/alumni/`)
    })
    .catch(error => console.log(error.response.data))
     

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

  
      <form className="form" onSubmit={handleSubmit}>
          
              <div className="form-content">
                  
                 {/*  <div className="formpart">
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
                      value={father}
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
                  </div> */}
                  {/* <div className="formpart">
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
                  </div> */}

                  <div className="formpart">
                      <label htmlFor="marital_status">
                          Marital Status
                      </label>
                      <select value={marital_status} onChange={(e)=>setMarital_status(e.target.value)} name="marital_status">
                        <option value="Single">Single</option>
                        <option value="Maried">Maried</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="date_of_birth">
                      date of Birth 
                      </label>
                      <input
                      type="date"
                      name="date_of_birth"
                      value={date_of_birth}
                      onChange={(e)=>setDate_of_birth(e.target.value)}
                      />
                  </div>
                  <div className="formpart">
                      <label htmlFor="gender">
                          Gender
                      </label>
                      <select value={gender}  onChange={(e)=>setGender(e.target.value)} name="gender">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="live in Rwanda">
                          Did you born in Rwanda?
                      </label>
                      <select value={did_you_born_in_rwanda}  onChange={(e)=>setDid_you_born_in_rwanda(e.target.value)} name="did_you_born_in_rwanda">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                  </div>
                  {did_you_born_in_rwanda==="Yes"?
                        <div className="formpart">
                            <h4>Place of Birth in Rwanda</h4>
                            <label htmlFor="districtSelect">District </label>
                            <select id="districtSelect" name="place_of_birth_district_or_country" value={place_of_birth_district_or_country}  onChange={handleDistrictChange}>
                                <option value="">Select a District</option>
                                {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                                ))}
                            </select>
                            {place_of_birth_district_or_country && (
                            <center>
                                <label htmlFor="place_of_birth_sector_or_city">Sector</label>
                                <select id="place_of_birth_sector_or_city" name="place_of_birth_sector_or_city" value={place_of_birth_sector_or_city} onChange={(e)=>setPlace_of_birth_sector_or_city(e.target.value)} >
                                <option value="">Select a Sector</option>
                                {sectorsByDistrict && sectorsByDistrict[place_of_birth_district_or_country] && sectorsByDistrict[place_of_birth_district_or_country].map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                                </select>
                            </center>
                            )
                        }
                    </div> :
                    <div className="formpart">
                    <h4>Place of Birth Abroad</h4>
                    <ItemForm
                        label="Country"
                        name="place_of_birth_district_or_country"
                        value={place_of_birth_district_or_country}
                        onChange={(e)=>setPlace_of_birth_district_or_country(e.target.value)} 
                    />
                    <ItemForm
                        label="City"
                        name="place_of_birth_sector_or_city"
                        value={place_of_birth_sector_or_city}
                        onChange={(e)=>setPlace_of_birth_sector_or_city(e.target.value)} 
                    />
                    
                    </div>
                    }
                    <div className="formpart">
                      <label htmlFor="live in Rwanda">
                          Do you live in Rwanda?
                      </label>
                      <select value={currresidence_in_rwanda}  onChange={(e)=>setCurrresidence_in_rwanda(e.target.value)} name="did_you_born_in_rwanda">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                  </div>
                  {currresidence_in_rwanda==="Yes"?
                        <div className="formpart">
                            <h4>Current Residence in Rwanda</h4>
                            <label htmlFor="currresidence_district_or_country">District </label>
                            <select id="currresidence_district_or_country" name="place_of_birth_district_or_country" value={currresidence_district_or_country}  onChange={handleDistrictChangeCu}>
                                <option value="">Select a District</option>
                                {districts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                                ))}
                            </select>
                            {currresidence_district_or_country && (
                            <center>
                                <label htmlFor="currresidence_sector_or_city">Sector</label>
                                <select id="currresidence_sector_or_city" name="currresidence_sector_or_city" value={currresidence_sector_or_city} onChange={(e)=>setCurrresidence_sector_or_city(e.target.value)} >
                                <option value="">Select a Sector</option>
                                {sectorsByDistrict && sectorsByDistrict[currresidence_district_or_country] && sectorsByDistrict[currresidence_district_or_country].map((sector) => (
                                    <option key={sector} value={sector}>
                                        {sector}
                                    </option>
                                ))}
                                </select>
                            </center>
                            )
                        }
                    </div> :
                    <div className="formpart">
                    <h4>Current Residence Abroad</h4>
                    <ItemForm
                        label="Country"
                        name="currresidence_district_or_country"
                        value={currresidence_district_or_country}
                        onChange={(e)=>setCurrresidence_district_or_country(e.target.value)} 
                    />
                    <ItemForm
                        label="City"
                        name="currresidence_sector_or_city"
                        value={currresidence_sector_or_city}
                        onChange={(e)=>setCurrresidence_sector_or_city(e.target.value)} 
                    />
                    
                    </div>
                    }
                  <div className="formpart">
                      <label htmlFor="kids">
                          Do you have kids
                      </label>
                      <select value={kids} onChange={(e)=>setKids(e.target.value)} name="kids">
                        <option value="false">Yes</option>
                        <option value="true">No</option>
                      </select>
                  </div>

                  <div className="formpart"> 
                      <label htmlFor="grade">
                          Grade
                      </label>     
                          <select value={grade.id}  name="grade" onChange={getfamilies}>
                            <option value=""disabled>select grade</option>
                              {grades.map((e,ind) => {
                                  return <option key={ind} value={e.id} >{e.grade_name}</option>
                              })}               
                          </select> 
                  </div>
                  <div className={gradeSelected? "formpart":"hide"}> 
                  <label htmlFor="family">
                          Family
                      </label>      
                          <select value={family.id}  onChange={(e)=>setFamilie(e.target.value)} name="family">
                              {families.map((e,ind) => {
                                  return  <option key={ind} value={e.id}>{e.family_name}</option>
                              })}               
                          </select> 
                  </div>

                  <div className="formpart">
                      <label htmlFor="combination">
                      Combination
                      </label>
                      
                      <select value={comb.id} name='combination' onChange={(e) => setCombinations(e.target.value)} >
                      <option value="" disabled>select combination</option>
                      {combination.map((e,ind) => {
                        return <option key={ind} value={e.id}>{e.combination_name}</option>
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
                            step="0.1"
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
                            step="0.1"
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
                            step="0.1"
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
                            value={ne}
                            onChange={(event) => setNe(event.target.value)}
                        />
                 </div>
                 <div className="formpart">
                      <label htmlFor="decision">
                          Decision
                      </label>
                      <select value={decision}  onChange={(e)=>setDecision(e.target.value)} name="decision">
                        <option value="P">Pass</option>
                        <option value="F">Fail</option>
                      </select>
                  </div>
                  <div className="formpart">
                      <label htmlFor="life_status">
                          Life Status
                      </label>
                      <select value={life_status}  onChange={(e)=>setLife_status(e.target.value)} name="life_status">
                        <option value="A">Alive</option>
                        <option value="D">Died</option>
                      </select>
                  </div>
                  
              </div>

              <center>
              <button>Update and continue</button>
              </center>
          </form>
          </center>
  )
}
