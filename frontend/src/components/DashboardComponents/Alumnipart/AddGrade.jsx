import "./userList.css";
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import './register.css'

export default function AddGrade() {
    const {auth} = useAuth();
    const navigate =useNavigate()
    const [families, setFamilies] = useState([{ family_name: '', family_number: '',family_mother: '', family_mother_tel: ''  }])

    let registerGrade = (e )=> {
        e.preventDefault()
        console.log(families);
        axios.post('http://127.0.0.1:8000/api/grades/', {
            'name':e.target.name.value, 
            'start_date':e.target.start_date.value,
            'end_date':e.target.end_date.value,
            'family':families
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
        navigate('/grades')
    })
    .catch(error => console.log(error))
        
    }

    const handleAddFamilies = () => {
        const values = [...families];
        values.push({
            family_name: '', 
            family_number: '',
            family_mother: '', 
            family_mother_tel: ''
        });
        setFamilies(values);
      };
      const handleRemoveFamilies = (index) => {
        const values = [...families];
        values.splice(index, 1);
        setFamilies(values); 
      };
      const handleInputChange = (index, event) => {
        const values = [...families];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
    
        setFamilies(values);
      };
    

  return (
    <div className='alumni-list-body'>
        <center><h1>Add a new grade form</h1></center>
        <form onSubmit={registerGrade} className='form-element'>
            <div className="grade-info">
                <label> 
                    <span>Grade name:</span>
                    <input type="text" name="name" placeholder="Enter grade" required />
                </label>
                <label>
                    <span>Start year:</span>
                    <input type="text" name="start_date" placeholder="Enter start academic year" required/>
                </label>
                <label>
                    <span>End year:</span>
                    <input type="text" name="end_date" placeholder="Enter end academic year" required />
                </label>
            </div>
                <div>
                {families.map((input, index) => {
                    return (
                        <label key={index} className="family-info">
                            <span>Family{index +1}:</span>
                            <div className="family-info-input">
                                <input
                                type='text'
                                name='family_name'
                                placeholder='Family name'
                                value={input.family_name}
                                onChange={(event) =>
                                handleInputChange(index, event)
                                }
                                />
                                <input
                                type='number'
                                name='family_number'
                                placeholder='Family number'
                                value={input.family_number}
                                onChange={(event) =>
                                handleInputChange(index, event)
                                }
                                />
                                <input
                                type='text'
                                name='family_mother'
                                placeholder='Family mother'
                                value={input.family_mother}
                                onChange={(event) =>
                                handleInputChange(index, event)
                                }
                                />
                                <input
                                type='text'
                                name='family_mother_tel'
                                placeholder='Family mother tel'
                                value={input.family_mother_tel}
                                onChange={(event) =>
                                handleInputChange(index, event)
                                    }
                                />
                                <button variant="secondary" onClick={() => handleRemoveFamilies(index)}>Remove</button>
                            </div>
                        </label>
                        )
                        })}
                </div>
                    <button variant="primary" onClick={() => handleAddFamilies()}>Add a family</button>
                            
                   <center><button type="submit">Save</button></center>
            </form>
            <p>
                 <Link className="line" to="/grades">Go back</Link>
            </p>
    </div>
  )
}
