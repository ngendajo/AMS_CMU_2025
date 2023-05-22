import {useState, useEffect} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useParams } from 'react-router'
import images from '../../../Static/Images/images.png'; 
import { Link } from "react-router-dom";
import "../forms.css";


export default function EditCrc() {
    const params = useParams();
        const [ crcUsers, setCrcUsers ] = useState();
        const axiosPrivate = useAxiosPrivate();
    
        useEffect(() =>{
            let isMounted = true;
            const controller = new AbortController();
    
            const getcrcusers = async () =>{
                try{
                    const response = await axiosPrivate.get('/registercrc/?id='+params.id,{
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
                        <div className="form-content">
                            <div className="formpart">
                                <img src={images} alt="logo" className="user-image" />
                                <input type="file"/>
                            </div>
                            <div className="formpart">
                                <p>Email</p>
                                <input type="email" value={user?.user.email}/>
                            </div>

                            <div className="formpart">
                                <p>First Name</p>
                                <input type="text" value={user?.user.first_name}/>
                            </div>

                            <div className="formpart">
                                <p>Last Name</p>
                                <input type="text" value={user?.user.last_name} />
                            </div>

                            <div className="formpart">
                                <p>Phone</p>
                                <input type="text" value={user?.user.phone1} />
                            </div>

                            <div className="formpart">
                                <p>Position</p>
                                <input type="text" value={user?.position} />
                            </div>
                        </div>
                    <button>Update</button>
                    </center>
                        <Link className="useredit" to="/staff">Go back</Link>
                    </div>
                    )}
                </>
            ): <p>No users to display</p>
        }
    </div>
  )
    }