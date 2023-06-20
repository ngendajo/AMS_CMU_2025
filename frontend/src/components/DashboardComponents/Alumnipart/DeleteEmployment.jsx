import {useState,useEffect} from "react";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteEmployment = () => {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
    const params = useParams();

    useEffect(() =>{
    
        const getuser = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/employment/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUserid(response.data)
            }catch(err) {
                console.log(err);
            }
        }
    
        getuser();
    
    },[auth,params])
    const handleDelete = (event) => {
    
      axios.delete('http://127.0.0.1:8000/api/employment/'+event+'/delete/',
      {
          headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
          }
      }
      )
      navigate("/alumni/employment/")
    };
    
  return (
      <center>
        {
        userid.map((result, id)=>{
            return <div key={id} className="delete-message"> <h1>Do you want to delete  {result.alumn.user.first_name} {result.alumn.user.last_name} with {result.alumn.user.email} as 
            email?
            </h1>
            <Link to="/alumni/employment/" className="not">No</Link> 
            <span onClick={()=>handleDelete(result.id)} className="yes">Yes</span>
            </div>
        }
        )}

      </center>
  )
}

export default DeleteEmployment
