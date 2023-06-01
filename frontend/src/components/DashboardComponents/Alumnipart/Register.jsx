import React, {useState, useEffect, useContext} from 'react'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import "../LandingPage/menubar/login.css"
import AuthContext from '../../context/AuthContext'
import "./register.css"
import { useHistory } from 'react-router-dom'
import Axios from "axios";
import Select, { components } from "react-select";

export default function Register() {
    let [grades, setGrades] = useState([])
    let [families, setFamilies] = useState([])
    let [selectedfamilies, setSelectedfamilies] =React.useState("")
    let [combination, setCombination] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [seen, setSeen] = useState(false)
    const [epseen, setEpseen] = useState(false)
    const [aluseen, setAluseen] = useState(true)
    let [eps, setEps] = useState([])
    let [epsdone, setEpsdone] = useState([])
    const [alueps, setAlueps] = useState("");

    const [selectedOption, setSelectedOption] = useState("");
    
      var handleChangeofEp = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption.value);
        setEpsdone(selectedOption)
      };

    const history = useHistory()
    
    function closeLogin(e) {
        document.getElementById("closeLogin").style.display = "none";
    }

  

    useEffect(()=> {
        getGrades()
        getCombinations()
        getFamilies()
        getEps()
    }, [])
    let getEps = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/ep/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            var eplist=[]
            data.forEach(element => {
              eplist.push(
                { value: element.id, label: element.title }
              )
            });
            setEps(eplist)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    let registerAluEp = (e )=> {
        e.preventDefault()
        var els=[]
        epsdone.forEach(ep=>{
            els.push(ep.value)
        })
            Axios.post('http://127.0.0.1:8000/api/alueps/'+alueps+"/", {
                    'eps':els
                },
                {
                    headers: {
                        "Authorization": 'Bearer ' + String(authTokens.access),
                        "Content-Type": 'application/json'
                    }
                }
            )
            .then(res =>{
                console.log(res.data)
            })
            .catch(error => console.log(error))
       
    }
    let registerUser = (e )=> {
        e.preventDefault()
        Axios.post('http://127.0.0.1:8000/api/registera/', {
            'email':e.target.email.value, 
            'first_name':e.target.first_name.value,
            'last_name':e.target.last_name.value,
            'phone1':e.target.phone1.value,
            'phone2':e.target.phone2.value,
            'password':"123",
            'profile':{
                'date_of_birth':e.target.date_of_birth.value,
                'marital_status':e.target.marital_status.value,
                'gender':e.target.gender.value,
                'grade':e.target.grade.value,
                'family':e.target.family.value,
                'combination':e.target.combination.value,
                'kids':e.target.kids.value,
                'father':e.target.father.value,
                'mother':e.target.mother.value,
                'place_of_birth':e.target.place_of_birth.value,
                'current_residence':e.target.current_residence.value
            }
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(authTokens.access),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        setAlueps(res.data['email'])
        setAluseen(false)
        setEpseen(true)
    })
    .catch(error => console.log(error))
       
    }

    let getCombinations = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/combination/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            
            setCombination(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    let getGrades = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/gradesl/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            
            setGrades(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    let getFamilies = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/families/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()
        if(response.status === 200){
            
            setFamilies(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    const onChange = (event) => {
        const value = event.target.value;
        setSelectedfamilies(value)
        setSeen(true)
      };
    
  return (
    <div className="popup" id="closeLogin">
            {aluseen?
            <div className="popup-inner user-reg">
                <ClearOutlinedIcon className='cancellogin' onClick={closeLogin}/>
                <h2>Alumni registration form</h2>
                <form onSubmit={registerUser} className='form-element'>
                    
                    <label> 
                        Email:
                        <input type="email" name="email" placeholder="Enter Email" />
                    </label>
                    <label>
                        First name:
                        <input type="text" name="first_name" placeholder="Enter first name" />
                    </label>
                    <label>
                        Last name:
                        <input type="text" name="last_name" placeholder="Enter last name" />
                    </label>
                    <label>
                        Phone number no1:
                        <input type="text" name="phone1" placeholder="Enter phone no1" />
                    </label>
                    <label>
                        Phone number no2:
                        <input type="text" name="phone2" placeholder="Enter phone no2" />
                    </label>
                    <label>
                        Date of birth:
                        <input type="date" name="date_of_birth" />
                    </label>
                    <label>
                    Marital status:
                        <select name='marital_status'>
                            <option value="Single">Single</option>
                            <option value="Maried">Maried</option>
                        </select>
                    </label>
                    <label>
                    Gender:
                        <select name='gender'>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </label>
                    <label>
                    Grade:
                        <select onChange={onChange} name='grade'>
                            <option defaultValue disabled>
                                select grade
                            </option>
                        {grades.map(e => (
                            <option value={e.id}>{e.name}</option>
                        ))}
                        </select>
                    </label>
                    <label>
                    Family:
                        <select name='family'>
                            <option defaultValue disabled>
                                select family
                            </option>
                                {seen ? families.map(e => (
                            selectedfamilies==e.grade.id ? <option value={e.id}>{e.family_name}</option>:null
                        )):null}
                        </select>
                    </label>
                    <label>
                    Combination:
                        <select name='combination'>
                        {combination.map(e => (
                            <option value={e.id}>{e.name}</option>
                        ))}
                        </select>
                    </label>
                    
                    <label>
                        Kids:
                        <input type="text" name="kids" />
                    </label>
                    <label>
                        Father:
                        <input type="text" name="father" />
                    </label>
                    <label>
                        Mother:
                        <input type="text" name="mother" />
                    </label>
                    <label>
                    Place of birth:
                        <input type="text" name="place_of_birth" />
                    </label>
                    <label>
                    Current residence:
                        <input type="text" name="current_residence" />
                    </label>
                    <center><button type="submit">Save</button></center>
                </form>
            </div>:null
        }
        {epseen?
            <div className="popup-inner user-reg">
                <ClearOutlinedIcon className='cancellogin' onClick={closeLogin}/>
                <h2>Alumni's Eps registration form</h2>
                <form onSubmit={registerAluEp} className='form-element'>
                    
                    <label className='alumniregsub'>
                    <b>Eps</b>
                        <Select isMulti onChange={handleChangeofEp} options={eps} />
                    </label>
                    
                    <center><button type="submit">Save</button></center>
                </form>
            </div>:null
        }
        </div>
  )
}
