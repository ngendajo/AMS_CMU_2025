import useAuth from '../../../../hooks/useAuth';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StoriesTable } from '../StoriesTable';
import ReactHtmlParser from "react-html-parser";
import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";

export default function Employment() {
  const [data, setData] = useState([]);
  
  const {auth} = useAuth();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/story/',{
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
                description:element.description===null?<Link to={`/add-alumni/info/${element.id}/story`}><AiOutlineFileAdd className='icon'/></Link>: ReactHtmlParser(element.description),
                allowed:element.description?element.displayed?<Link to={`/alumni/displaystory/${element.story_id}`}><LiaEyeSolid className='icon'/></Link>:<Link to={`/alumni/displaystory/${element.story_id}`}><LiaEyeSlash className='icon'/></Link>:null,
                user_id:element.description?<span>
                  <Link to={`/alumni/updatestory/${element.story_id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/alumni/deletestory/${element.story_id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                </span>:null
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
                <StoriesTable mockData={data} />
              </div>
      </div>
  )
}
