import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import '../../components/DashboardComponents/Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Table } from '../../components/DashboardComponents/Alumnipart/Table';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";


export default function Alumni() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState(1);
  const {auth} = useAuth();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/registera/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            var alumnilist=[]
            var i=1
            response.data.forEach(element => {
              alumnilist.push({
                id:i,
                email:element.email,
                first_name:element.first_name,
                last_name:element.last_name,
                info:element.profile==null? "Add Info":"Edit Info",
                user_id:<button className='updateUser' value={element.id}><BiEditAlt/><RiDeleteBin5Line/></button>
              })
              i+=1
            });
            setData(alumnilist);
        }catch(err) {
            console.log(err);
        }
    }

    getcrcusers();

},[auth])

  return (
    <div>
        <div className='alumni-list-heading'>
         
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
              <div className="listtable">
                <Table mockData={data} />
              </div>
      </div>
        
    </div>
  )
}
