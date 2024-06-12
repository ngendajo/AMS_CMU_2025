import React, {useState, useEffect} from 'react'
import {Gallery} from 'react-grid-gallery'
import useAuth from '../../hooks/useAuth';
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';

export default function GalleryPage() {
   const [data, setData] = useState([]);
    let {auth}= useAuth() 
    var isEmpty=false
    var gallerylist=[]
    const navigate=useNavigate();

    useEffect(() =>{
        const getData = async () =>{
            try{
                const response = await axios.get(baseUrl+'/gallery/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                response.data.forEach(e=>{
                if(e.displayed){
                    gallerylist.push({
                     src:baseUrlforImg+e.image_url,
                     width: 320,
                     height: 174,
                     id: e.id
                    })
                }
                
                })
                setData(gallerylist)
                if(gallerylist.length===0){
                  isEmpty=true;
                }
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getData();
    
    },[auth])

  return (
    <div id= 'AddPhoto'>
      {isEmpty?
        null:<div><Gallery images={data} /> </div>
      }
      {auth.user.is_superuser || auth.user.is_crc?
         <center><div className='add-galleryphoto'>
            <Link to="/add-gallery" className='link'>Add Photo</Link><IoIosAdd className='addicon'/>
          </div></center>:null
      }
      {auth.user.is_superuser || auth.user.is_crc?
          <center><div className='edit-delete-gallery-photo'> 
          <Link to="/edit-gallery" className='link'>Change Photo in Gallery</Link>
        </div></center>:null
      } 
    </div>
  );
}
