import {useState, useEffect} from "react";
import { useParams } from 'react-router'
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function StaffDetails() {
    const params = useParams();
        const [ crcUsers, setCrcUsers ] = useState();
        const {auth} = useAuth()
        const navigate=useNavigate();
    
        useEffect(() =>{
    
            const getcrcusers = async () =>{
                try{
                    const response = await axios.get('http://127.0.0.1:8000/api/staff/?id='+params.id,{
                        headers: {
                            "Authorization": 'Bearer ' + String(auth.accessToken),
                            "Content-Type": 'multipart/form-data'
                        },
                        withCredentials:true
                    });
                    setCrcUsers(response.data);
                }catch(err) {
                    console.log(err);
                    navigate('/error');
                }
            }
    
            getcrcusers();
    
        },[auth,params])
  return (
    <div className="staff-info">
        <center><h1>Staff Information</h1></center>
        
        {crcUsers?.length
            ? ( <>
                    {crcUsers.map((user,i) =>
                    <div key={i} className="staff-details">
                        <center>
                        <div className="staff-details-part">
                            <img src={"http://localhost:8000"+user?.image_url} alt="logo" className="user-image" />
                        </div>
                        <div className="staff-details-part">
                            <p>Email</p>
                            <h3>{user?.email}</h3>
                        </div>
                        <div className="staff-details-part">
                            <p>First Name</p>
                            <h3>{user?.first_name}</h3>
                        </div>
                        <div className="staff-details-part">
                            <p>Last Name</p>
                            <h3>{user?.last_name}</h3>
                        </div> 
                        <div className="staff-details-part">
                            <p>Staff position</p>
                            <h3>{user.profile===null?"Owrner":user.profile.position}</h3>
                        </div>
                        
                        <Link className="useredit" to={`/add-crc/${user?.id}`}><span>Edit</span><CiEdit className="useredit-icon"/></Link>
                        <Link className="useredit" to="/staff">See other staff</Link>
                        </center>
                    </div>
                    )}
                </>
            ): <p>No users to display</p>
        }
    </div>
  )
}
