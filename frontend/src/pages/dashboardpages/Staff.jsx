import React, {useState} from 'react';
import {FaSearch} from "react-icons/fa";
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import { Link } from 'react-router-dom';

export default function Staff() {
  const [results, setResults]=useState([]);
  const [input, setInput] = useState("");
  const fetchDAta = (value) =>{
      let listoflinks=["alumni","staff","events","chats","opportunities","schedule","gallery","profile","helpcenter"];
      let results=listoflinks.filter(link => link.includes(value));
      
        setResults(results)
      
    }
    const handleChange = (value) =>{
      setInput(value)
      fetchDAta(value)
  }
  return (
    <div className='staff-data'>
        <div className='staff-data-header'>
          <div className='input-wrapper search-staff'>
              <FaSearch id='search-icon'/>
              <input placeholder='search staff...' value={input} onChange={(e) =>handleChange(e.target.value)}/>
          </div>
          <div className='staff-header-right'>
            <div className='export-staff'>
              <span>Export Staff</span>
            </div>
            <div className='add-staff'>
              <Link to="/add-crc" className='link'>Add Staff</Link>
            </div>
          </div>
        </div>
       
        <div className='results-list'> 
              {results.map((result, id)=>{
                return <div className='search-result' key={id}>{result}</div>
              })}
        </div>
    </div>
  )
}
