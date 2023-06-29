import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useRef, useState, useEffect} from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function EditGallery() {
    const {auth} = useAuth();
    const [image, setImage] = useState(null);
    const navigate =useNavigate()
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();



      const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            let formData = new FormData();
            formData.append('image_url',image.image_url);
            const response = await axios.post("http://127.0.0.1:8000/api/gallery/create/",{
            'image_url': image.image_url,
            'displayed': true,
            },
            {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            }
            );
            console.log(response.data)
            navigate("/gallery")
            //clear input fields
        }
        catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response'+err);
            } else if (err.response?.status === 404) {
                setErrMsg('problem with upload');
            } else{
                setErrMsg("Upload Failed"+err)
                console.log(err)
            }
            errRef.current.focus(); 
        }
}


  return (
    <div className='edit-gallery'>
        <p>test</p>
    </div>
  )
}
