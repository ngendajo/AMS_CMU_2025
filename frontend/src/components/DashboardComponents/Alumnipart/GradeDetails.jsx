import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useHistory } from 'react-router-dom'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext'
import Axios from "axios";

export const GradeDetails = ({ id }) => {
    const [grades, setGrades] = useState([]);
    let [family, setFamily] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    const history = useHistory()

    useEffect(()=> {
        getData()
    }, [])

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/allgrades/?id='+id, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            const value = [];
            value.push({
                name: data[0].name, 
                start_date: data[0].start_date,
                end_date: data[0].end_date,
            })
            setGrades(value);
            console.log(grades)
            const values = [];
            data[0].families.forEach(e => {
                values.push({
                    family_name: e.family_name, 
                    family_number: e.family_number,
                    family_mother: e.family_mother, 
                    family_mother_tel: e.family_mother_tel,
                    id: e.id,
                }); 
            });
            setFamily(values);
            console.log(family)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
      const handleInputChange1 = (index, event) => {
        const values = [...family];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
        setFamily(values);
        console.log(values[index][updatedValue])
        console.log(values[index]["id"])
        Axios.post('http://127.0.0.1:8000/api/family/'+values[index]["id"]+'/', {
            family_name:values[index]["family_name"], 
            family_number:values[index]["family_number"],
            family_mother:values[index]["family_mother"], 
            family_mother_tel:values[index]["family_mother_tel"]
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(authTokens.access),
                "Content-Type": 'application/json'
            }
        }
    )
      };

      const handleInputChangegrade = (index, event) => {
        const values = [...grades];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
        Axios.post('http://127.0.0.1:8000/api/grade/'+id+'/', {
            'name':values[index]['name'], 
            'start_date':values[index]['start_date'],
            'end_date':values[index]['end_date']
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(authTokens.access),
                "Content-Type": 'application/json'
            }
        }
    )
        setGrades(values);
      };

    function closeLogin(e) {
        history.push('/alumni')
        document.getElementById("closeLogin").style.display = "none";
    }


  return (
    <>
      <div className="popup" id="closeLogin">
            <div className="popup-inner user-reg">
                <ClearOutlinedIcon className='cancellogin' onClick={closeLogin}/>
                <h2>Update grades and families form </h2>
                
                {grades.map((e,i) => {
                   return <div className='form-element'>
                    <form>
                        
                        <label> 
                            Grade:
                            <input type="text" name="name" value={e.name} placeholder="Enter Email" 
                            onChange={(event) =>handleInputChangegrade(i, event)}
                            />
                        </label>
                        <label>
                            Start year:
                            <input type="text" name="start_date" value={e.start_date} placeholder="Enter first name" 
                            onChange={(event) =>handleInputChangegrade(i, event)}
                            />
                        </label>
                        <label>
                            End year:
                            <input type="text" name="end_date" value={e.end_date} placeholder="Enter last name" 
                            onChange={(event) =>handleInputChangegrade(i, event)}
                            />
                        </label>
                        </form>
                        <label>
                        <input className='family-title' type='text' value='Family name' readonly/>
                            <input className='family-title' type='number' placeholder='Family number' readonly/>
                            <input className='family-title' type='text' value='Family mother' readonly/>
                            <input className='family-title' type='text' value='Family mother tel' readonly/>
                        {family.map((ef, index) => {
                            return <label>
                            Family{ef.family_number}:
                            <form>
                                <input type='hidden' name='id' value={ef.id}/>
                                <input type='text' name='family_name' value={ef.family_name} 
                                onChange={(event) =>handleInputChange1(index, event)}/>
                                <input type='number' name='family_number' value={ef.family_number}
                                onChange={(event) =>handleInputChange1(index, event)}/>
                                <input type='text' name='family_mother' value={ef.family_mother}
                                onChange={(event) =>handleInputChange1(index, event)}/>
                                <input type='text' name='family_mother_tel'value={ef.family_mother_tel}
                                onChange={(event) =>handleInputChange1(index, event)}/>
                            </form>
                                      
                        </label>
                        }
                            
                            )}
                            {/* <button variant="primary" onClick={() => handleAddFamily1()}>Add More</button> */}
                        </label>
                        
                        <center><span onClick={closeLogin} className='cancel'>Cancel</span></center>
                    
                   </div>
                }
                    
                )}
            </div>
        </div>
    </>
  );
};
