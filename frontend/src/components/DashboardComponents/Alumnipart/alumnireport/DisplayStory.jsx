
import {useState, useEffect,useRef } from 'react';
import '../../../Header/header.css';
import '../../../Header/searchBar.css';
import '../../../Header/searchResultsList.css';
import '../../Staffpart/staff.css';
import '../../Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "../../forms.css";
import { useNavigate } from "react-router-dom";



export default function UpdateStory() {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const params = useParams();
    const navigate = useNavigate();
    const [display, setDisplay] = useState(false);

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/story/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setUserid(response.data)
              response.data.forEach((el)=>{
                setDisplay(el.displayed);
              })
          }catch(err) {
              console.log(err);
          }
      }
  
      getuser();
  
  },[auth,params])
  const handleSubmit = async () =>{
    
    axios.post('http://127.0.0.1:8000/api/displaystory/'+params.id+"/", {
        "displayed":!display
        
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        console.log(res)
        alert(" Updated successfully")
        navigate('/alumni/story/')
    })
    .catch(error => console.log(error.response))
     

  } 
  return (
    <center>
          <p>
              <Link className="line" to="/alumni/story/">Go back</Link>
          </p>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={"http://localhost:8000"+result.alumn.user.image_url} alt="logo" className="user-image-icon" />
          <h1>Do you want to <span className={display?'not':'yes'}>{display?"hide":"display"}</span>  {result.alumn.user.first_name} {result.alumn.user.last_name} with {result.alumn.user.email} as 
          email
          </h1>
          <Link to="/alumni/story/" className="not">No</Link> 
            <span onClick={()=>handleSubmit()} className="yes">Yes</span>
          </div>
      }
      )}
          </center>

  )
}
