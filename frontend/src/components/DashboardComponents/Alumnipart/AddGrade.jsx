import "./userList.css";
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { CiCircleRemove } from "react-icons/ci";
import './register.css'

export default function AddGrade() {
    const {auth} = useAuth();
    const navigate =useNavigate()
    const [families, setFamilies] = useState([{ family_name: '', family_number: '',family_mother: '', family_mother_tel: ''  }])

    let registerGrade = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/grades/', {
            'grade_name':e.target.grade_name.value, 
            'start_academic_year':e.target.start_academic_year.value,
            'end_academic_year':e.target.end_academic_year.value,
            'families':families
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
        navigate('/alumni/grades')
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
                    <input type="text" name="grade_name" placeholder="Enter grade" required />
                </label>
                <label>
                    <span>Start year:</span>
                    <input type="text" name="start_academic_year" placeholder="Enter start academic year" required/>
                </label>
                <label>
                    <span>End year:</span>
                    <input type="text" name="end_academic_year" placeholder="Enter end academic year" required />
                </label>
            </div>
                <div>
                {families.map((input, index) => {
                    return (
                        <div key={index} className="family-info">
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
                                <button variant="secondary" onClick={() => handleRemoveFamilies(index)}><CiCircleRemove/></button>
                            </div>

                        </div>
                        )
                        })}

                        
                </div>
                    <button variant="primary" onClick={() => handleAddFamilies()}>Add a family</button>
                            
                   <center><button type="submit">Save</button></center>
            </form>
            <p>
                 <Link className="line" to="/alumni/grades">Go back</Link>
            </p>
    </div>
  )
}
