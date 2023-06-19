import { Link } from 'react-router-dom';
import { BiExport } from "react-icons/bi";
import {FaSearch} from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

export const Grades = () => {

    const [results, setResults]=useState([]);
    const [results1, setResults1]=useState([]);
    const [input, setInput] = useState("");
    const {auth} = useAuth();

    useEffect(() =>{
    
        const getGrades = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/grades/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setResults1(response.data);
                setResults(response.data);
            }catch(err) {
                console.log(err);
            }
        }
    
        getGrades();
    
    },[auth])
      const fetchDAta = (value) =>{
        if(results1.length>0){
          let results=results1.filter((grade) =>
          grade?.grade_name.toLowerCase().includes(value.toLowerCase()) || 
          grade?.start_academic_year.toLowerCase().includes(value.toLowerCase()) || 
          grade?.end_academic_year.toLowerCase().includes(value.toLowerCase())
        );
        setResults(results)
         }
          
        }
        const handleChange = (value) =>{
          setInput(value)
          fetchDAta(value)
      }
  
  return (
    <>
        <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
              <div className='input-wrapper search-staff'>
                <FaSearch id='search-icon'/>
                <input placeholder='search grade...' value={input} onChange={(e) =>handleChange(e.target.value)}/>
              </div>
                <div className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/add-grade" className='link'>Add Grade</Link><IoIosAdd className='addicon'/>
                </div>
              </div>
            </div>
            <div className='grades-list'>
            {results.length?
                    <>
                      {results.map((result, id)=>{
                        return <Link to={`/add-grade/${result.id}`} key={id} className='grade-details'>
                    <p>Grade: {result.grade_name}</p>
                    <p>Start Academic Year:{result.start_academic_year}</p>
                    <p>End Academic Year:{result.end_academic_year}</p>
                    <h3>Families</h3>
                    <ol>
                        {result.families?.map((fa,i)=>{
                            return <li key={i}>{fa.family_name}
                            <ul className='family-detail'>
                                <li>Mother:{fa.family_mother}</li>
                                <li>Mother Tel:{fa.family_mother_tel}</li>
                            </ul>
                        </li>
                        })}
                        
                    </ol>
                </Link>
                })}
                </>:<h1>No grade registered yet!</h1>
        }
            </div>
      </div>
    </>
  );
};
