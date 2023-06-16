import useAuth from '../../../../hooks/useAuth';
import { Table } from '../Table';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Employment() {
  const [data, setData] = useState([]);
  
  const {auth} = useAuth();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/alumni/',{
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
                image:<img src={"http://localhost:8000"+element.image_url} alt="logo" className="user-image-icon" />,
                email:element.email,
                first_name:element.first_name,
                last_name:element.last_name,
                phone:element.phone1,
                grade:element.alumn==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.alumn.Family.grade.grade_name,
                family:element.alumn==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.alumn.Family.family_name,
                user_id:<span>
                  <Link to={`/add-alumni/${element.id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/delete-alumni/${element.id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                </span>
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
    <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
              </div>
            </div>
              <div className="listtable">
                <Table mockData={data} />
              </div>
      </div>
  )
}
