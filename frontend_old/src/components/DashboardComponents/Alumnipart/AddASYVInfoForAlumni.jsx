import {useRef, useState, useEffect} from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../api/baseUrl";
import baseUrlforImg from "../../../api/baseUrlforImg";
import MultiStepForm from "./formSteps/MultiStepForm";
import "./formSteps/style.css";

export default function AddASYVInfoForAlumni() {
    const [userid, setUserid]=useState([]);
    const { auth } = useAuth();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() =>{
    
        const getuser = async () =>{
            try{
                const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUserid(response.data)
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getuser();
    
    },[auth,params])

  return (
    <center>
        {
        userid.map((result, id)=>{
                return <div key={id} className="delete-message"> 
                    <img src={baseUrlforImg+result.image_url} alt="logo" className="user-image-icon" />
                    <h2>Add ASYV Info for  {result.first_name} {result.last_name} with {result.email} as 
                    email
                    </h2>
                    <MultiStepForm/>
                </div>
            }
        )
    }
    </center>
  )
}
