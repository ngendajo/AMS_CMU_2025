import {useState,useEffect} from "react";
import { useParams } from 'react-router'
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../api/baseUrl";
import baseUrlforImg from "../../../api/baseUrlforImg";

export default function ResetPassword() {
    const [userid, setUserid]=useState([]);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
      const params = useParams();
  
      useEffect(() =>{
      
          const getuser = async () =>{
              try{
                  const response = await axios.get(baseUrl+'/staff/?id='+params.id,{
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
      const handleReset = async (email) =>{
        try{
            let formData = new FormData();
            
            formData.append('email',email);
            const response = await axios.post(baseUrl+"/password-reset/",
                formData,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                }
                );
                let formData2 = new FormData();
                formData2.append('password',"Agahozo@12");
                const response2 = await axios.patch(baseUrlforImg+"/"+response.data.message,
                formData2,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                }
                );
                console.log(response2.data)
                navigate("/staff")
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response'+err);
            } else if (err.response?.status === 404) {
                setErrMsg('problem with registration');
            } else{
                setErrMsg("Registration Failed"+err)
                console.log(err)
            }
        }
        
      };
      
    return (
        <center>
            <p className={errMsg ? "errmsg" :"offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
          {
          userid.map((result, id)=>{
              return <div key={id} className="delete-message"> <h1>Do you want to reset password of  {result.first_name} {result.last_name} with {result.email} as 
              email?
              </h1>
              <Link to="/staff" className="not">No</Link> 
              <span onClick={()=>handleReset(result.email)} className="yes">Yes</span>
              </div>
          }
          )}
  
        </center>
    )
}
