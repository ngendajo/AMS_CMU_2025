
import {useState, useEffect} from "react";
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



export default function AddEmployment() {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const params = useParams();
    const navigate = useNavigate();
    const [alumn, setAlumn] = useState()

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
              setUserid(response.data)
              response.data.forEach((el)=>{
                setAlumn(el.alumn.id)
              })
          }catch(err) {
              console.log(err);
          }
      }
  
      getuser();
  
  },[auth,params])
  const handleSubmit = async (e) =>{
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/studie/', {
        "alumn":alumn,
        "degree":e.target.degree.value,
        "university":e.target.university.value,
        "scholarship":e.target.scholarship.value,
        "country":e.target.country.value,
        "status":e.target.status.value
        
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
        alert(" created successfully")
        navigate('/alumni/studie/')
    })
    .catch(error => console.log(error.response))
     

  }
  return (
    <center>
          <p>
              <Link className="line" to="/alumni/studie/">Go back</Link>
          </p>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={"http://localhost:8000"+result.image_url} alt="logo" className="user-image-icon" />
          <h1>Add Study Status for  {result.first_name} {result.last_name} with {result.email} as 
          email
          </h1>
          </div>
      }
      )}

    
        <form onSubmit={handleSubmit}>
          
                <div className="form-content">
                    
                    <div className="formpart">
                        <label htmlFor="degree">
                            Degree
                        </label>
                        <input
                        type="text"
                        id="degree"
                        autoComplete="off"
                        name="degree"
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="university">
                            University
                        </label>
                        <input
                        type="text"
                        id="university"
                        autoComplete="off"
                        name="university"
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="country">
                            Country
                        </label>
                        <input
                        type="text"
                        id="country"
                        autoComplete="off"
                        name="country"
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="status">
                            Status
                        </label>
                        <select name="status">
                          <option value="D">Dropped_Out</option>
                          <option value="S">Suspended</option>
                          <option value="O">On_Going</option>
                          <option value="C">Completed</option>
                        </select>
                    </div>
                    <div className="formpart">
                        <label htmlFor="scholarship">
                        Scholarship
                        </label>
                        <select name="scholarship">
                          <option value="F">Full Scholarship</option>
                          <option value="P">Partial Scholarship</option>
                          <option value="N">None</option>
                        </select>
                    </div>
                    
                    
                    
                </div>

                <center>
                <button
                >Save</button>
                </center>
            </form>
            
          </center>

  )
}
