import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useHistory } from 'react-router-dom'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext'

export const UserDetails = ({ id }) => {
    const [data, setData] = useState([]);
    let [grades, setGrades] = useState([])
    let [families, setFamilies] = useState([])
    let [selectedfamilies, setSelectedfamilies] =React.useState("")
    let [combination, setCombination] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)
    const [seen, setSeen] = useState(false)

    useEffect(()=> {
        getData()
        getGrades()
        getCombinations()
        getFamilies()
    }, [])

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/onealumni/'+id+"/", {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setData(data);
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    let getCombinations = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/combinations/', {
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

    const history = useHistory()

    function closeLogin(e) {
        history.push('/alumni')
        document.getElementById("closeLogin6").style.display = "none";
    }
    const onChange = (event) => {
        const value = event.target.value;
        setSelectedfamilies(value)
        setSeen(true)
      };
  return (
    <>
      <div className="popup" id="closeLogin6">
            <div className="popup-inner user-reg">
                <ClearOutlinedIcon className='cancellogin' onClick={closeLogin}/>
                <h2>Update Alumni form </h2>
                
                {data.map(e => (
                    <form className='form-element'>
                        
                    <label> 
                        Email:
                        <input type="email" name="email" value={e.user.email} placeholder="Enter Email" />
                    </label>
                    <label>
                        First name:
                        <input type="text" name="first_name" value={e.user.first_name} placeholder="Enter first name" />
                    </label>
                    <label>
                        Last name:
                        <input type="text" name="last_name" value={e.user.last_name} placeholder="Enter last name" />
                    </label>
                    <label>
                        Phone number no1:
                        <input type="text" name="phone1" value={e.user.phone1} placeholder="Enter phone no1" />
                    </label>
                    <label>
                        Phone number no2:
                        <input type="text" name="phone2" value={e.user.phone2} placeholder="Enter phone no2" />
                    </label>
                    <label>
                        Date of birth:
                        <input type="date" name="date_of_birth" value={e.date_of_birth} />
                    </label>
                    <label>
                    Marital status:
                        <select name='marital_status'>
                        {e.marital_status =="single"? <option value="Single" selected>Single</option>:<option value="Single">Single</option>}
                        {e.marital_status =="maried"? <option value="Maried" selected>Maried</option>:<option value="Maried">Maried</option>}
                            
                        </select>
                    </label>
                    <label>
                    Gender:
                        <select name='gender'>
                        {e.gender =="M"? <option value="M" selected>Male</option>:<option value="M">Male</option>}
                        {e.gender =="F"? <option value="F" selected>Female</option>:<option value="F">Female</option>}
                            
                            
                        </select>
                    </label>
                    <label>
                    Grade:
                        <select onChange={onChange} name='grade'>
                            <option defaultValue disabled>
                                select grade
                            </option>
                        {grades.map(eg => (
                            e.grade.id==eg.id? <option value={eg.id} selected>{eg.name}</option>:<option value={eg.id}>{eg.name}</option>
                        ))}
                        </select>
                    </label>
                    <label>
                    Family:
                        <select name='family'>
                            <option defaultValue disabled>
                                select family
                            </option>
                            <option value={e.family.id} selected>{e.family.family_name}</option>
                                {seen ? families.map(ef => (
                            selectedfamilies==ef.grade.id && ef.id!=e.family.id ? <option value={ef.id}>{ef.name}</option>:null
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
                        <input type="text" name="kids" value={e.kids} />
                    </label>
                    <label>
                        Father:
                        <input type="text" name="father" value={e.father} />
                    </label>
                    <label>
                        Mother:
                        <input type="text" name="mother" value={e.mother} />
                    </label>
                    <label>
                    Place of birth:
                        <input type="text" name="place_of_birth" value={e.place_of_birth} />
                    </label>
                    <label>
                    Current residence:
                        <input type="text" name="current_residence" value={e.current_residence} />
                    </label>
                    <center><button type="submit">Update</button></center>
                </form>
                ))}
            </div>
        </div>
    </>
  );
};
