import React, {useState, useEffect} from 'react'
import {Gallery} from 'react-grid-gallery'
import useAuth from '../../hooks/useAuth';
import axios from "axios";
import { Link } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";



export default function GalleryPage() {
   const [data, setData] = useState([]);
    let {auth}= useAuth() 
    var gallerylist=[]
    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/gallery/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                response.data.forEach(e=>{
                if(e.displayed){
                    gallerylist.push({
                     src:"http://localhost:8000"+e.image_url,
                     width: 320,
                     height: 174,
                    })
                }
                
                })
                setData(gallerylist)
            }catch(err) {
                console.log(err);
            }
        }
    
        getData();
    
    },[auth])

  //this is an example of what could be used in the gallery
  const gimages = [
    {
       src: "http://localhost:8000/media/profiles/default.jpg",
       width: 320,
       height: 174,
       caption: "After Rain (Jeshu John - designerspics.com)",
    },
    {
       src: "http://localhost:8000/media/profiles/default.jpg",
       width: 320,
       height: 212,
       tags: [
          { value: "Ocean", title: "Ocean" },
          { value: "People", title: "People" },
       ],
       alt: "Boats (Jeshu John - designerspics.com)",
    },
  
    {
       src: "http://locolhost:8000/media/profiles/deafult.jpgg",
       width: 320,
       height: 212,
    },
 ];


  return (
    <div id= 'AddPhoto'>
      <div>
        <Gallery images={data} />
      </div>

      <div className='add-galleryphoto'>
        <Link to="/add-gallery" className='link'>Add Photo</Link><IoIosAdd className='addicon'/>
      </div>
    </div>
  );
}
