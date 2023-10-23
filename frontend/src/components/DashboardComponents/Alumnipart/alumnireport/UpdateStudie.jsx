
import {useState, useEffect, useMemo} from "react";
import '../../../Header/header.css';
import '../../../Header/searchBar.css';
import '../../../Header/searchResultsList.css';
import '../../Staffpart/staff.css';
import '../../Alumnipart/alumni.css';
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "../../forms.css";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import baseUrl from "../../../../api/baseUrl";
import baseUrlforImg from "../../../../api/baseUrlforImg";



export default function UpdateStudie() {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const params = useParams();
    const navigate = useNavigate();
    const [degree, setDegree] = useState('');
    const [university, setUniversity] = useState('');
    const [country, setCountry] = useState('');
    const [status, setStatus] = useState('');
    const [level, setLevel] = useState('');
    const [scholarship, setScholarship] = useState('');
    const [scholarship_details, setScholarship_details] = useState('');
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = value => {
    setCountry(value)
  }

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
              const response = await axios.get(baseUrl+'/studie/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setUserid(response.data);
              setDegree(response.data[0].degree);
              setUniversity(response.data[0].university);
              options.forEach((e)=>{
                if(e.label===response.data[0].country){
                  setCountry(e);
                } 
              })
              
              setScholarship(response.data[0].scholarship);
              setStatus(response.data[0].status);
              setLevel(response.data[0].level);
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getuser();
  
  },[auth,params,options])
  const handleSubmit = async (e) =>{
    e.preventDefault();

    axios.post(baseUrl+'/updatestudie/'+params.id+'/', {
      "level":level,
        "degree":degree,
        "university":university,
        "scholarship":scholarship,
        "country":country.label,
        "scholarship_details":e.target.scholarship_details.value,
        "status":status
        
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
        if(auth.user.is_alumni){
          navigate('/')
      }else{
        navigate(`/alumni/studie/`)
      }
        
    })
    .catch(error => console.log(error.response))
     

  }
  return (
    <center>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={baseUrlforImg+result.alumn.user.image_url} alt="logo" className="user-image-icon" />
          <h1>Update Study Status for  {result.alumn.user.first_name} {result.alumn.user.last_name} with {result.alumn.user.email} as 
          email
          </h1>
          </div>
      }
      )}

    
        <form onSubmit={handleSubmit} className="form">
          
                <div className="form-content">
                    <div className="formpart">
                        <label htmlFor="level">
                            Status
                        </label>
                        <select name="level" value={level} defaultValue={level} onChange={(e)=>setLevel(e.target.value)}>
                          <option value="C">Advanced level Certificate</option>
                          <option value="A1">Advanced diploma</option>
                          <option value="A0">Bachelors</option>
                          <option value="M">Masters</option>
                          <option value="PHD">PHD</option>
                          <option value="NMS">No futher study</option>
                          <option value="D">Deseaded</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    <div className="formpart">
                        <label htmlFor="degree">
                            Degree
                        </label>
                        <input
                        type="text"
                        id="degree"
                        autoComplete="off"
                        name="degree"
                        value={degree}
                        onChange={(e)=>setDegree(e.target.value)}
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
                        value={university}
                        onChange={(e)=>setUniversity(e.target.value)}
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="scholarship_details">
                        Scholarship Details
                        </label>
                        <input
                        type="text"
                        id="scholarship_details"
                        autoComplete="off"
                        name="scholarship_details"
                        value={scholarship_details}
                        onChange={(e)=>setScholarship_details(e.target.value)}
                        required
                        />
                    </div>
                    <div className="formpart">
                        <label htmlFor="country">
                            Country
                        </label>
                        <Select options={options} value={country} onChange={changeHandler} />
                    </div>
                    <div className="formpart">
                        <label htmlFor="status">
                            Status
                        </label>
                        <select name="status" value={status} defaultValue={status} onChange={(e)=>setStatus(e.target.value)}>
                          <option value="D">Dropped_Out</option>
                          <option value="S">Suspended</option>
                          <option value="O">On_Going</option>
                          <option value="C">Completed</option>
                          <option value="De">Deseaded</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    <div className="formpart">
                        <label htmlFor="scholarship">
                        Scholarship
                        </label>
                        <select name="scholarship" value={scholarship} defaultValue={scholarship} onChange={(e)=>setScholarship(e.target.value)}>
                          <option value="F">Full Scholarship</option>
                          <option value="P">Partial Scholarship</option>
                          <option value="NS">No Scholarship</option>
                          <option value="D">Deseaded</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    
                    
                    
                    
                </div>

                <center>
                  <button>Save and continue</button>
                </center>
            </form>
            
          </center>

  )
}
