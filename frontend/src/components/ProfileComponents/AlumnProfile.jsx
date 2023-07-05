import {useState, useEffect} from "react";
import { useParams } from 'react-router'
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom"; 
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './alumniprofile.css';

export default function AlumnProfile() {
  const params = useParams();
        const [ user, setUser ] = useState([]);
        const {auth} = useAuth()
    
        useEffect(() =>{
    
            const getuser = async () =>{
                try{
                    const response = await axios.get('http://127.0.0.1:8000/api/alumni/?id='+params.id,{
                        headers: {
                            "Authorization": 'Bearer ' + String(auth.accessToken),
                            "Content-Type": 'multipart/form-data'
                        },
                        withCredentials:true
                    });
                    setUser(response.data);
                }catch(err) {
                    console.log(err);
                }
            }
    
            getuser();
    
        },[auth,params])
        console.log(user)
  return (
    <>
      {user.map((use,i) =>
        <div key={i} className='alumni-profile-main'>
          <div className="alumni-profile-top-left">
            <div className="basic-info">
              <img src={"http://localhost:8000"+use?.image_url} alt="profile" className="alumni-profile-img" />
              <div className="alumni-profile-info">
                <div className="alumni-profile-info-top">
                  <h2>{use.first_name} {use.last_name}</h2>
                  <Link to={`/add-alumni/${use.id}`} className="message-edit">
                    <span>Edit</span>
                    <CiEdit/>
                  </Link>
                </div>
                <div className="alumni-profile-info-top">
                  <div>
                    <p>Status</p>
                    <h4>IT Officer</h4>
                  </div>
                  <div>
                    <p>Address</p>
                    <h4>{use.alumn.CurrResidence}</h4>
                  </div>
                  <div>
                    <p>Email</p>
                    <h4>{use.email}</h4>
                  </div>
                  <div>
                    <p>Phone</p>
                    <h4>{use.phone1}</h4>
                  </div>
                </div>
              </div>
            </div>
            <center className="opportinuties-shared">
              <h4>Shared Oppprtinuties</h4>
              <p>{use.phone1}</p>
            </center>
          </div>
          <div className="alumni-profile-top-right"></div>
        </div>
      )}
    </>
  )
}
