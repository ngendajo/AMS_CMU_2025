import React, {useState, useEffect} from 'react'
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";
import baseUrl from "../../api/baseUrl";
import DynamicTable from "./dinamicTable/DynamicTable";

export default function Students() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    let {auth} = useAuth();

    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get(baseUrl+'/students/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true 
                });
                var studentlist=[]
                var i=1
                setLoading(false);
                response.data.forEach(e=>{
                    studentlist.push({
                    No:i,
                    Names:e.last_name+" "+e.first_name,
                    Reg_No:e.studentid,
                    Email:e.email,
                    Grade:e.grade_name,
                    Family:e.family_name,
                    Combinamtion:e.combination_name,
                    Edit:<span>
                        <Link to={`/student/${e.id}`}><BiEditAlt className='icon'/></Link>
                    </span>
                })
                i=i+1
                })
                setData(studentlist);
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
    
        getData();
    
    },[auth])
  return (
    <div>
     <center><h2 >List of Students</h2></center> 
        {loading ? (
            <p>Loading...</p>
          ) : (
                <DynamicTable mockdata={data} /> 
          )
        }
    </div>
  )
}

