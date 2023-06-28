
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
    const [title, setTitle]=useState('');
    const [status, setStatus]=useState('');
    const [description, setDescription]=useState('');
    const [company, setCompany]=useState('');
    const [start_date, setStart_date]=useState('');
    const [end_date, setEnd_date]=useState('');

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
              setUserid(response.data);
              setTitle(response.data[0].title);
              setStatus(response.data[0].status);
              setDescription(response.data[0].description);
              setCompany(response.data[0].company);
              setStart_date(response.data[0].start_date);
              setEnd_date(response.data[0].end_date);
              if(response.data[0].end_date==="Up to now"){
                setEnd(true)
              }
          }catch(err) {
              console.log(err);
          }
      }
  
      getuser();
  
  },[auth,params])
  const handleSubmit = async (e) =>{
    e.preventDefault();

    axios.post(`http://127.0.0.1:8000/api/updateemployment/${params.id}/`, {
        "title":title,
        "status":status,
        "description":description,
        "company":company,
        "start_date":start_date,
        "end_date":end?"Up to now":end_date
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
        alert(" updated successfully")
        navigate('/alumni/employment')
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
          <img src={"http://localhost:8000"+result.alumn.user.image_url} alt="logo" className="user-image-icon" />
          <h1>Update Employment Status for  {result.alumn.user.first_name} {result.alumn.user.last_name} with {result.alumn.user.email} as 
          email
          </h1>
          </div>
      }
      )}

    
        <form onSubmit={handleSubmit} className="form">
          
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
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="status">
                            Status
                        </label>
                        <select name="status" value={status} defaultValue={status} onChange={(e)=>setStatus(e.target.value)}>
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
                        <input type="text" name="description" value={description} onChange={(e)=>setDescription(e.target.value)} />
                    </div>
                    <div className="formpart">
                        <label htmlFor="company" >
                            Company
                        </label>
                        <input type="text" name="company" value={company} onChange={(e)=>setCompany(e.target.value)} />
                    </div>
                    <div className="formpart">
                        <label htmlFor="start-date">
                            Start Date
                        </label>
                        <input type="date" name="start_date" value={start_date} onChange={(e)=>setStart_date(e.target.value)} />
                    </div>
                    <div className="formpart">
                              <label></label>
                              <span className="end">
                                  {end?
                                    <input
                                    type="checkbox"
                                    name="end"
                                    value="true"
                                    id="end"
                                    checked
                                    onChange={()=>{setEnd(!end)}}
                                    />  :
                                    <input
                                  type="checkbox"
                                  name="end"
                                  value="true"
                                  id="end"
                                  onChange={()=>{setEnd(!end)}}
                                  />
                                }
                                  <label>Up to now</label>
                              </span>

                          </div>
                    {!end?
                    <div className="formpart">
                      <label htmlFor="end-date">
                          End Date
                      </label>
                      <input type="date" name="end_date" value={end_date} onChange={(e)=>setEnd_date(e.target.value)} />
                    </div>  
                    :null
                  }
                    
                    
                </div>

                <center>
                <button>Save</button>
                </center>
            </form>
            
          </center>

  )
}
