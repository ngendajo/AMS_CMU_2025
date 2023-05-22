import {useState, useEffect} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useParams } from 'react-router'
import images from '../../../Static/Images/images.png'; 
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function StaffDetails() {
    const params = useParams();
        const [ crcUsers, setCrcUsers ] = useState();
        const axiosPrivate = useAxiosPrivate();
    
        useEffect(() =>{
            let isMounted = true;
            const controller = new AbortController();
    
            const getcrcusers = async () =>{
                try{
                    const response = await axiosPrivate.get('/getcrc/'+params.id+"/",{
                        signal:controller.signal
                    });
                    console.log(response.data);
                    isMounted && setCrcUsers(response.data);
                }catch(err) {
                    console.log(err);
                }
            }
    
            getcrcusers();
    
            return () =>{
                isMounted = false;
                controller.abort();
            }
        },[axiosPrivate,params])
  return (
    <div>
        <center><h1>Staff Information</h1></center>
        
        {crcUsers?.length
            ? ( <>
                    {crcUsers.map((user) =>
                    <div className="staff-info">
                        <center>
                        <img src={images} alt="logo" className="user-image" />
                        <p>Email</p>
                        <h3>{user?.email}</h3>
                        <p>First Name</p>
                        <h3>{user?.first_name}</h3>
                        <p>Last Name</p>
                        <h3>{user?.last_name}</h3>
                        <p>Phone</p>
                        <h3>{user?.phone1}</h3>
                        <p>Position</p>
                        <h3>{user?.profile.position}</h3>
                        <Link className="useredit" to={`/add-crc/${user?.profile.id}`}><span>Edit</span><CiEdit className="useredit-icon"/></Link>
                        <Link className="useredit" to="/staff">Go back</Link>
                        </center>
                    </div>
                    )}
                </>
            ): <p>No users to display</p>
        }
    </div>
  )
}
