
import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { EpTable } from './EpTable';
import { Link } from 'react-router-dom';
import { BiExport } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import './combinations.css';
import baseUrl from '../../../api/baseUrl';

export const Eps = ({ id }) => {
    const [data, setData] = useState([]);
    let {auth}= useAuth() 
    const navigate = useNavigate()
    
    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get(baseUrl+'/ep/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                var eplist=[]
                var i=1
                Array.isArray(response.data)?
                response.data.forEach(e=>{
                    var t=""
                    if(e.type==="A"){
                        t="Arts"
                    }else if(e.type==="S"){
                        t="Sports"
                    }
                    else if(e.type==="C"){
                        t="Clubs"
                    }
                    else if(e.type==="P"){
                        t="Professional"
                    }
                    else{
                        t="Sciences"
                    }
                    
                    eplist.push({
                        id:i,
                        title:<Link className='comb_name' to={`/epalumn/${e.id}`}>{e.title}</Link>, 
                        type:t,
                        ep_id:<span>
                            <Link to={`/add-ep/${e.id}`}><BiEditAlt className='icon'/></Link>
                        </span>
                    })
                    i++
                    }):null;
                setData(eplist)
                console.log(eplist)
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getData();
    
    },[auth])
  return (
    <center className='alumni-list-body'>
            <div className='comb-header'>
                <div className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/add-ep" className='link'>Add Ep</Link><IoIosAdd className='addicon'/>
                </div>
              </div>
                
            <div id='allcombinations'>
                <EpTable mockData={data}/>
            </div>
            
    </center>
  );
};
