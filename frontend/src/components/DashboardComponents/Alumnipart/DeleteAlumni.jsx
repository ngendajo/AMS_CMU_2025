import {useState,useEffect} from "react";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteAlumni = () => {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
    const params = useParams();

    useEffect(() =>{
    
        const getuser = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/registera/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUserid(response.data)
                console.log(response.data)
            }catch(err) {
                console.log(err);
            }
        }
    
        getuser();
    
    },[auth,params])
    const handleDelete = (event) => {
    
      axios.delete('http://127.0.0.1:8000/api/deleteuser/'+event+'/delete/',
      {
          headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
          }
      }
      )
      navigate("/alumni")
    };
    
  return (
      <center>
        {
        userid.map((result, id)=>{
            return <div key={id} className="delete-message"> <h1>Do you want to delete  {result.first_name} {result.last_name} with {result.email} as 
            email?
            </h1>
            <Link to="/alumni" className="not">No</Link> 
            <span onClick={()=>handleDelete(result.id)} className="yes">Yes</span>
            </div>
        }
        )}

      </center>
  )
}

export default DeleteAlumni
