import React, {useState, useEffect} from 'react';
import {FaSearch} from "react-icons/fa";
import axios from 'axios';
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { BiEditAlt,BiStreetView } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

export default function Staff() {
  const [results, setResults]=useState([]);
  const [results1, setResults1]=useState([]);
  const [input, setInput] = useState("");
  const {auth} = useAuth()
  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/staff/',{
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
      let results=results1.filter((person) =>
      person?.first_name.toLowerCase().includes(value.toLowerCase()) || person?.last_name.toLowerCase().includes(value.toLowerCase()) || person?.email.toLowerCase().includes(value.toLowerCase())
    );
      
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
       
        <div className='results-list-in-table alumni-list-body'> 
        <center>
          <table>
            <thead>
            <tr>
              <th>No</th><th>Profile</th><th>Name</th><th>Email</th><th>Phone</th><th>Level</th><th>Title</th><th>Action</th>
            </tr>
            </thead>

            <tbody>
            {results.length?
              <>
                {results.map((result, id)=>{
                  return  <tr key={id}>
                      <td>{id+1}</td>
                      <td><img src={"http://localhost:8000"+result.image_url} alt="logo" className="user-image-icon" /></td>
                      <td>{result.first_name} {result.last_name}</td>
                      <td>{result.email}</td>
                      <td>{result?.phone1}</td>
                      <td>{result.is_superuser? "Admin":result.is_crc? "CRC Staff":"Unknown"}</td>
                      <td>{result.profile ? result.profile.position:"Owner"}</td>
                      <td><Link to={`/add-crc/${result.id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/staffprofile/${result.id}`}><BiStreetView className='icon'/></Link>
                      {auth.user.id===result.id?null:
                      <Link to={`/delete-user/${result.id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                      }
                       
                      </td>
                    </tr>
                })}
              </>
              :
              <tr><td></td><td></td><td>No user to dispaly</td><td></td><td></td><td></td></tr>
            }
            </tbody>
          </table>
          </center>
        </div>
    </div>
  )
}
