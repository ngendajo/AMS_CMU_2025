
import {useState, useEffect, useMemo} from "react";
import '../../../Header/header.css';
import '../../../Header/searchBar.css';
import '../../../Header/searchResultsList.css';
import '../../Staffpart/staff.css';
import '../../Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "./form.css";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import baseUrl from "../../../../api/baseUrl";
import baseUrlforImg from "../../../../api/baseUrlforImg";



export default function AddStudie() {

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          border: '1px solid #ccc',
          borderRadius: '4px',
          margin:'5px 30%',
          boxShadow: state.isFocused ? '0 0 0 1px dodgerblue' : null,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'dodgerblue' : null,
          color: state.isSelected ? 'white' : 'inherit',
        }),
      };

  const [userid, setUserid]=useState([]);
  const [message, setMessage]=useState("");
  const { auth } = useAuth();
  const params = useParams();
    const navigate = useNavigate();
    const [alumn, setAlumn] = useState(0)
    const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
  }

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
              const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
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
              navigate('/error');
          }
      }
  
      getuser();
  
  },[auth,params])
  const handleSubmit = async (e) =>{
    e.preventDefault();

    axios.post(baseUrl+'/studie/', {
        "alumn":alumn,
        "level":e.target.level.value,
        "degree":e.target.degree.value,
        "university":e.target.university.value,
        "scholarship":e.target.scholarship.value,
        "country":value.label,
        "scholarship_details":e.target.scholarship_details.value,
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
        if(e.target.level.value==='PHD')
        {
            setMessage("Provide your Masters Info")
        }
        else if(e.target.level.value==='M'){
            setMessage("Provide your Bachelors Info")
        }
        else if(e.target.level.value==='A0'){
            setMessage("Do you have a diploma degree?")
        }else if (e.target.level.value!=='C'){
            setMessage("Do you do a short course?")
        }else{
            navigate(`/add-alumni/info/${params.id}/addemployment`)
        }
        
    })
    .catch(error => console.log(error.response))
     

  }
  return (
    <center>
          <p>
              <Link className="line" to="/alumni/studie/">Go back</Link>
          </p>
          <p>Or</p>
          <p>
            <Link className="line" to={`/add-alumni/info/${params.id}/addemployment`}>Add employment Info</Link>
          </p>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={baseUrlforImg+result.image_url} alt="logo" className="user-image-icon" />
          <h1>Add Study Status for  {result.first_name} {result.last_name} with {result.email} as 
          email
          </h1>
          </div>
      }
      )}

        <h2 className="message">{message}</h2>
        <form onSubmit={handleSubmit}>
          
                <div className="form-content">
                <div className="formpart">
                        <label htmlFor="level">
                            Degree
                        </label>
                        <select name="level">
                          <option value="C">Short Course Certificate</option>
                          <option value="A1">Advanced diploma</option>
                          <option value="A0">Bachelors</option>
                          <option value="M">Masters</option>
                          <option value="PHD">PHD</option>
                          <option value="NMS">No futher study</option>
                          <option value="D">Deceased</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    
                    <div className="formpart">
                        <label htmlFor="degree">
                            Field of study
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
                        <Select options={options} styles={customStyles} value={value} onChange={changeHandler} />
                    </div>
                    <div className="formpart">
                        <label htmlFor="status">
                            Status
                        </label>
                        <select name="status">
                          <option value="C">Graduated</option>
                          <option value="O">On_Going</option>
                          <option value="S">Suspended</option>
                          <option value="D">Dropped_Out</option>
                          <option value="NMS">No futher study</option>
                          <option value="De">Deceased</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    <div className="formpart">
                        <label htmlFor="scholarship">
                        Scholarship
                        </label>
                        <select name="scholarship">
                          <option value="F">Full Scholarship</option>
                          <option value="P">Partial Scholarship</option>
                          <option value="NS">No Scholarship</option>
                          <option value="NMS">No futher study</option>
                          <option value="D">Deseaded</option>
                          <option value="N">NoInfo</option>
                        </select>
                    </div>
                    <div className="formpart">
                        <label htmlFor="scholarship_details">
                        Scholarship Details
                        </label>
                        <input type="text" name="scholarship_details" required/>
                    </div>
                    
                    
                    
                    
                </div>

                <center>
                {alumn===0?null:
                <button className="button"
                >Save and continue</button>
                }
                </center>
            </form>
            
          </center>

  )
}
