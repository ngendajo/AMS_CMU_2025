
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
    const [end, setEnd] = useState(false)
    const [alumn, setAlumn] = useState(0)

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

    axios.post('http://127.0.0.1:8000/api/employment/', {
        "title":e.target.title.value,
        "status":e.target.status.value,
        "description":e.target.description.value,
        "company":e.target.company.value,
        "alumn":alumn,
        "start_date":e.target.start_date.value,
        "end_date":end?"Up to now":e.target.end_date.value
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
        if(auth.user.is_alumni){
            navigate('/')
        }else{
            navigate('/alumni/employment/')
        }
    })
    .catch(error => console.log(error.response))
     

  } 
  return (
    <center>
          <p>
              <Link className="line" to="/alumni/employment/">Go back</Link>
          </p>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={"http://localhost:8000"+result.image_url} alt="logo" className="user-image-icon" />
          <h1>Add Employment Status for  {result.first_name} {result.last_name} with {result.email} as 
          email
          </h1>
          </div>
      }
      )}

    
        <form onSubmit={handleSubmit}>
          
                <div className="form-content">
                    
                    <div className="formpart">
                        <label htmlFor="title">
                            Title
                        </label>
                        <input
                        type="text"
                        id="title"
                        autoComplete="off"
                        name="title"
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="status">
                            Status
                        </label>
                        <select name="status">
                          <option value="S">Self-employment</option>
                          <option value="F">Full-time</option>
                          <option value="P">Part-time</option>
                          <option value="I">Intern</option>
                        </select>
                    </div>
                    
                    <div className="formpart">
                        <label htmlFor="description">
                            Description
                        </label>
                        <input type="text" name="description" />
                    </div>
                    <div className="formpart">
                        <label htmlFor="company">
                            Company
                        </label>
                        <input type="text" name="company" />
                    </div>
                    <div className="formpart">
                        <label htmlFor="start-date">
                            Start Date
                        </label>
                        <input type="date" name="start_date" />
                    </div>
                    <div className="formpart">
                              <label></label>
                              <span className="end">
                                  <input
                                  type="checkbox"
                                  name="end"
                                  value="true"
                                  id="end"
                                  onChange={()=>{setEnd(!end)}}
                                  />
                                  <label>Up to now</label>
                              </span>

                          </div>
                    {!end?
                    <div className="formpart">
                      <label htmlFor="end-date">
                          End Date
                      </label>
                      <input type="date" name="end_date" />
                    </div>  
                    :null
                  }
                    
                    
                </div>

                <center>
                {alumn===0?null:
                <button
                >Save</button>
                }
                </center>
            </form>
            
          </center>

  )
}
