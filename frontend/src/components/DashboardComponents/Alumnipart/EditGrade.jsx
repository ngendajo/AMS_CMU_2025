import "./userList.css";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './register.css'
import { CiCircleRemove } from "react-icons/ci";
import { BiSave } from "react-icons/bi";
import { BsFillHouseAddFill } from "react-icons/bs";

export default function AddGrade() {
    const {auth} = useAuth();
    const [grade, setGrade]=useState([]);
    const navigate = useNavigate();
    const params = useParams();
    const [family, setFamily] = useState([])
    const [families, setFamilies] = useState([{ family_name: '', family_number: '',family_mother: '', family_mother_tel: '',id:0  }])
    

    
    useEffect(() =>{
    
        const getGrade = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/grades/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                
                let values=[];
                const value = [];
                data.forEach((e)=>{
                    value.push({
                        grade_name: e.grade_name, 
                        start_academic_year: e.start_academic_year,
                        end_academic_year: e.end_academic_year,
                    })
                    e.families.forEach((f)=>{
                        values.push({
                            family_name: f.family_name, 
                            family_number: f.family_number,
                            family_mother: f.family_mother, 
                            family_mother_tel: f.family_mother_tel,
                            id: f.id
                        });
                    })
                })
                setFamilies(values);
                setGrade(value)
            }catch(err) {
                console.log(err);
            }
        }
    
        getGrade();
    
    },[auth,params])

   
      const handleInputChange = (index, event) => {
        const values = [...families];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
        setFamilies(values);
        axios.post('http://127.0.0.1:8000/api/family/'+values[index]["id"]+'/', {
            family_name:values[index]["family_name"], 
            family_number:values[index]["family_number"],
            family_mother:values[index]["family_mother"], 
            family_mother_tel:values[index]["family_mother_tel"]
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
      };
      const handleInputChangegrade = (index, event) => {
        const values = [...grade];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
        axios.post('http://127.0.0.1:8000/api/grade/'+params.id+'/', {
            'grade_name':values[index]['grade_name'], 
            'start_academic_year':values[index]['start_academic_year'],
            'end_academic_year':values[index]['end_academic_year']
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
        setGrade(values);
      };

      const handleDeletegrade = () => {
        
        axios.delete('http://127.0.0.1:8000/api/grade/'+params.id+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        ).then(res =>{
            console.log(res)
            navigate('/grades')
        })
      };

      const handleRemovesavedFamily =(index,id) =>{
        axios.delete('http://127.0.0.1:8000/api/family/'+id+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        ).then(res =>{
            console.log(res)
            const values = [...families];
            values.splice(index, 1);
            setFamilies(values); 
        })
        
      };
    
      const handleRemoveFamily = (index) => {
        const values = [...family];
        values.splice(index, 1);
        setFamily(values); 
      };
      const handleSaveFamily = () =>{
        console.log(family);
        family.forEach((f)=>{
            axios.post('http://127.0.0.1:8000/api/addfamilies/', {
                grade:f.grade,
                family_name:f.family_name,
                family_number:f.family_number,
                family_mother:f.family_mother,
                family_mother_tel:f.family_mother_tel
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
        })
            
            
      };
      const handleInputChanges = (index, event) => {
        const values = [...family];
        const updatedValue = event.target.name;
        values[index][updatedValue] = event.target.value;
    
        setFamily(values);
      };
      const handleAddFamily = () => {
        const values = [...family];
        values.push({
            grade:params.id,
            family_name: '', 
            family_number: '',
            family_mother: '', 
            family_mother_tel: ''
        });
        setFamily(values);
      };
  return (
    <div className='alumni-list-body'>
        <p>
            <Link className="line" to="/grades">Go back</Link>
        </p>
        <center><h1>Update grade form </h1></center>
        <form className='form-element'>
        {grade.map((e,i) => {
                   return <div key={i} className="grade-info">
                   <label> 
                       <span>Grade name:</span>
                       <input 
                       type="text"
                       name="grade_name" 
                       value={e.grade_name} placeholder="Enter grade name" 
                               onChange={(event) =>handleInputChangegrade(i,event)} required />
                   </label>
                   <label>
                       <span>Start year:</span>
                       <input 
                       value={e.start_academic_year} placeholder="Enter start year" 
                       onChange={(event) =>handleInputChangegrade(i, event)}
                       type="text" name="start_academic_year" required/>
                   </label>
                   <label>
                       <span>End year:</span>
                       <input 
                       value={e.end_academic_year} placeholder="Enter End year" 
                       onChange={(event) =>handleInputChangegrade(i, event)}
                       type="text" name="end_academic_year" required />
                   </label>
               </div>

        })}
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
                                <span className="addfamily" variant="secondary" onClick={() => handleRemovesavedFamily(index,input.id)}><CiCircleRemove className="icons"/></span>
                            </div>
                        </label>
                        )
                        })}
                        {family?.map((input, index) => {
                            return (
                                <div key={index} className="family-info">
                                    <span>New Family{index +1}:</span>
                                    <div className="family-info-input">
                                        <input
                                        type='text'
                                        name='family_name'
                                        placeholder='Family name'
                                        value={input.family_name}
                                        onChange={(event) =>
                                        handleInputChanges(index, event)
                                        }
                                        />
                                        <input
                                        type='number'
                                        name='family_number'
                                        placeholder='Family number'
                                        value={input.family_number}
                                        onChange={(event) =>
                                        handleInputChanges(index, event)
                                        }
                                        />
                                        <input
                                        type='text'
                                        name='family_mother'
                                        placeholder='Family mother'
                                        value={input.family_mother}
                                        onChange={(event) =>
                                        handleInputChanges(index, event)
                                        }
                                        />
                                        <input
                                        type='text'
                                        name='family_mother_tel'
                                        placeholder='Family mother tel'
                                        value={input.family_mother_tel}
                                        onChange={(event) =>
                                        handleInputChanges(index, event)
                                            }
                                        />
                                        <span className="addfamily" variant="secondary" onClick={() => handleRemoveFamily(index)}><CiCircleRemove className="icons"/></span>
                                        
                                    </div>
                                    
                                </div>
                                )
                                })}
                </div>
                <center className="set-icons">
                    <span className="addfamily" variant="secondary" onClick={() => handleAddFamily()}><BsFillHouseAddFill className="icons"/></span>
                    {family.length>0 ?
                    <span className="addfamily" onClick={handleSaveFamily} ><BiSave className="icons"/></span>
                :null}
                </center>
            </form>
            <p>
                 <Link onClick={handleDeletegrade} className="line" to="#">Delete Grade</Link>
            </p>
    </div>
  )
}
