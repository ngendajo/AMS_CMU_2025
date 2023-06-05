import React, {useState, useEffect} from 'react';
import {FaSearch} from "react-icons/fa";
import axios from 'axios';
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import '../../components/DashboardComponents/Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";


export default function Alumni() {
  const [results, setResults]=useState([]);
  const [results1, setResults1]=useState([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState(1);
  const {auth} = useAuth();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/registeradmin/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            console.log(response.data);
            setResults1(response.data);
            setResults(response.data);
        }catch(err) {
            console.log(err);
        }
    }

    getcrcusers();

},[auth])

  const fetchDAta = (value) =>{
   if(results1.length>0){
    let results=results1.filter((person) =>
    person?.first_name.toLowerCase().includes(value.toLowerCase()) || person?.last_name.toLowerCase().includes(value.toLowerCase()) || person?.email.toLowerCase().includes(value.toLowerCase())
  );
  setResults(results)
   }
    
      
    
  }
  const handleChange = (value) =>{
    setInput(value)
    fetchDAta(value)
}
  return (
    <div>
        <div className='alumni-list-heading'>
          <div className='input-wrapper search-staff'>
              <FaSearch id='search-icon'/>
              <input placeholder='search staff...' value={input} onChange={(e) =>handleChange(e.target.value)}/>
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
            <Link className='grades-link' to="/grades">Grades</Link>
          </div>

          <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <Link className='grades-link' to="/combinations">Combinations</Link>
          </div>
          <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <Link className='grades-link' to="/eps">Eps</Link>
          </div>

        </div>
        <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/add-alumni" className='link'>Add Alumni</Link><IoIosAdd className='addicon'/>
                </div>
              </div>
            </div>
            <div>
              {results.length?
                    <>
                      {results.map((result, id)=>{
                        return  <p key={id}>{result.first_name} {result.last_name}</p>
                      })}
                      </>:null
              }
              </div>
      </div>
        
    </div>
  )
}
