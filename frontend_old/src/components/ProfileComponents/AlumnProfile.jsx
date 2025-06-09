import {useState, useEffect} from "react";
import { useParams } from 'react-router'
import { CiEdit } from "react-icons/ci";
import { Link } from "react-router-dom"; 
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../api/baseUrl";
import baseUrlforImg from "../../api/baseUrlforImg";
import "./alumniprofile.css";

export default function AlumnProfile() {
  const params = useParams();
        const [ user, setUser ] = useState([]);
        const {auth} = useAuth()
        const [ employment, setEmployment ] = useState([]);
        const [ study, setStudy ] = useState([]);
        const [opportunities, setOpportunities] = useState([]);
        
    
        const navigate = useNavigate();
    
        useEffect(() =>{
    
            const getusers = async () =>{
                try{
                  const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUser(response.data)
                    
                    
                    
                }catch(err) {
                    console.log(err);
                    navigate('/error');
                }
            }
    
            getusers();
    
        },[auth,params])
        
        useEffect(() =>{
            const getemploy = async () =>{
              try{
                  const response = await axios.get(baseUrl+'/employment/',{
                      headers: {
                          "Authorization": 'Bearer ' + String(auth.accessToken),
                          "Content-Type": 'multipart/form-data'
                      },
                      withCredentials:true
                  });
                  console.log(response.data)
                  setEmployment(response.data)
                  
              }catch(err) {
                  console.log(err);
                  navigate('/error');
              }
          }
      
          getemploy();
          
      
      },[auth])

      useEffect(() =>{
        const getstudy = async () =>{
          try{
              const response = await axios.get(baseUrl+'/studie/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setStudy(response.data);
              console.log(response.data)
              
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getstudy();
      
  
  },[auth])

      const fetchOpportunities = async () => {
        
        try {
          const response = await axios.get(baseUrl+'/opportunity');
          
          response.data.forEach((opp)=>{
            if(parseInt(opp.user)===parseInt(params.id)){
              setOpportunities(opp);
            }
          })
          
          
        } catch (error) {
          console.log(error);
          navigate('/error');
        }
      };
    
      useEffect(() => {
        fetchOpportunities();
      }, [params]);
      
  return (
    <>
      {user.map((use,i) =>
      <div key={i}>
        <div className='alumni-profile-main'>
          <div className="alumni-profile-top-left">
            <div className="basic-info">
              <img src={baseUrlforImg+use?.image_url} alt="profile" className="alumni-profile-img" />
              <div className="alumni-profile-info">
                <div className="alumni-profile-info-top">
                  <h2>{use.first_name} {use.last_name}</h2>
                  {auth.user.is_alumni?
                    null:<Link to={`/add-alumni/${use.id}`} className="message-edit">
                    <span>Edit</span>
                    <CiEdit/>
                  </Link>
                    }
                </div>
                <div className="alumni-profile-info-top">
                  <div>
                    <p>Status</p>
                    {employment.length>0 && (employment.filter(employ => employ.alumn_id === use.alumn.id)).length>0?
                     <h4> {use.alumn.life_status==='D'?<span>Deceased</span>:
                     <span>
                        {
                          (employment.filter(employ => employ.alumn_id === use.alumn.id)).sort((a, b) => {
                            const priorityA = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[a.status] || Infinity;
                            const priorityB = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[b.status] || Infinity;
                            return priorityA - priorityB;
                        })[0].status==='N'?<>Unkown</>:<>
                        {
                          (employment.filter(employ => employ.alumn_id === use.alumn.id)).sort((a, b) => {
                            const priorityA = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[a.status] || Infinity;
                            const priorityB = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[b.status] || Infinity;
                            return priorityA - priorityB;
                        })[0].title
                        }
                        </>
                        }
                     </span>
                     } </h4>
                      :<h4>Unknown</h4>
                    }
                    
                  </div>
                  <div>
                    <p>Address</p>
                    {use.alumn.currresidence_in_rwanda?
                      <h4>District:{use.alumn.currresidence_district_or_country} - Sector:{use.alumn.currresidence_sector_or_city}</h4>:
                      <h4>Country:{use.alumn.currresidence_district_or_country} - City:{use.alumn.currresidence_sector_or_city}</h4>
                    }
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
              <p>{opportunities.length}</p>
            </center>
          </div>
          <div className="alumni-profile-top-right">
            
            <h3>Academic Performance</h3>
            <div className="academic-perfomance">
            <div>
              <h4>S4 Marks</h4>
              <p>{use.alumn.s4marks}%</p>
            </div>
            <div>
              <h4>S5 Marks</h4>
              <p>{use.alumn.s5marks}%</p>
            </div>
            <div>
              <h4>S6 Marks</h4>
              <p>{use.alumn.s6marks}%</p>
            </div>
            </div>
            <div>
              <h4>National Examination Reesult</h4>
              <p>{use.alumn.ne}/{use.alumn.maxforne}</p>
            </div>
            <div>
              <h4>Decision</h4>
              <p>{use.alumn.decision==='P'?<>Pass</>:<>Fail</>}</p>
            </div>
          </div>
        </div>
        <div className='alumni-profile-personal-info'>
          <div className="alumni-profile-info-top">
              <h2>Personal Information</h2>
              {auth.user.is_alumni?
              null:<Link to={`/add-alumni/${use.id}`} className="message-edit">
              <span>Edit</span>
              <CiEdit/>
            </Link>
              }
              
          </div>
            <div className="academic-perfomance">
            
            <div>
              <p>Life Status</p>
              <h4>{use.alumn.life_status==='A'?<>Alive</>:<>Died</>}</h4>
            </div>
            <div>
              <p>Gender</p>
              <h4>{use.alumn.gender}</h4>
            </div>
            <div>
              <p>Date of Birth</p>
              <h4>{`${(new Date(use.alumn.date_of_birth)).getFullYear()}-${((new Date(use.alumn.date_of_birth)).getMonth() + 1).toString().padStart(2, '0')}-${(new Date(use.alumn.date_of_birth)).getDate().toString().padStart(2, '0')}`}</h4>
            </div>
            <div>
              <p>Marital Status</p>
              <h4>{use.alumn.marital_status}</h4>
            </div>
            <div>
              <p>Place of Origin</p>
              {use.alumn.did_you_born_in_rwanda?
                <h4>District:{use.alumn.place_of_birth_district_or_country} - Sector:{use.alumn.place_of_birth_sector_or_city}</h4>:
                <h4>Country:{use.alumn.place_of_birth_district_or_country} - City:{use.alumn.place_of_birth_sector_or_city}</h4>
              }
            </div>
            <div>
              <p>Current Residence</p>
              {use.alumn.currresidence_in_rwanda?
                <h4>District:{use.alumn.currresidence_district_or_country} - Sector:{use.alumn.currresidence_sector_or_city}</h4>:
                <h4>Country:{use.alumn.currresidence_district_or_country} - City:{use.alumn.currresidence_sector_or_city}</h4>
              }
            </div>
            </div>
            <div className="academic-perfomance">
            <div>
              <p>Kids</p>
              <h4>{use.alumn.kids?"Yes":"No"}</h4>
            </div>
            {/* <div>
              <p>Father</p>
              <h4>{use.alumn.father}</h4>
            </div>
            <div>
              <p>Mother</p>
              <h4>{use.alumn.mother}</h4>
            </div> */}
            <div>
              <p>Grade</p>
              <h4>{use.alumn.family.grade.grade_name}</h4>
            </div>
            <div>
              <p>Family</p>
              <h4>{use.alumn.family.family_name}</h4>
            </div>
            <div>
              <p>Combination</p>
              <h4>{use.alumn.combination.combination_name}</h4>
            </div>
            <div>
              <p>Enrichment Programs</p>
              {use.alumn.eps.map((ep)=>{
                return <p key={ep.id}>{ep.title} from <strong>{ep.type==="A"? "Arts Center":ep.type==="S"?"Sports":ep.type==="SC"?"Science Center":"Clubs"}</strong></p>
              })}
            </div>
            </div>
        </div>
              {/* Edication Progress */}
        <div className="academic-progress">
          <h2>Edication Progress</h2>
          {
            use.alumn.life_status==='D'? <h4>Deceased</h4>:
            <>
            {
              study.length>0 && (study.filter(stu => stu.alumn_id === use.alumn.id)).length>0?
              <>
              <table class="zigzag">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Degree</th>
                    <th>University</th>
                    <th>Country</th>
                    <th>Scholarship Type</th>
                    <th>Scholarship Details</th>
                    <th>Study Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (study.filter(stu => stu.alumn_id === use.alumn.id)).length>0?
                    <>
                    {
                      (study.filter(stu => stu.alumn_id === use.alumn.id)).sort((a, b) => {
                        const priorityA = { 'C': 0, 'O': 1, 'S': 2, 'NMS': 3,'N':5 }[a.status] || Infinity;
                        const priorityB = { 'C': 0, 'O': 1, 'S': 2, 'NMS': 3,'N':5 }[b.status] || Infinity;
                        return priorityA - priorityB;
                    }).map((st,ke)=>
                    <tr key={ke}>
                        <td>{st.level==='C'?"Short Course Certificate":st.level==='A1'?"Advanced Diploma":st.level==='A0'?"Bachelor's":st.level==='M'?"Masters":st.level==='PHD'?"PHD":st.level==='NMS'?"No Further Education":"No Info"}</td>
                        <td>{st.degree}</td>
                        <td>{st.university}</td>
                        <td>{st.country}</td>
                        <td>{st.scholarship==='F'?"Full Scholarship":st.scholarship==='P'?"Partial Scholarship":st.scholarship==='NS'?"Self Sponsored":"No Info"}</td>
                        <td>{st.scholarship_details}</td>
                        <td>{st.status==='C'?"Graduated":st.status==='O'?"Studying":st.status==='S'?"Suspended":st.status==='D'?"Dropped Out":"No Info"}</td>
                    </tr>
                    )
                    }
                    </>:<tr><td>No Data</td></tr>
                  }
                  
                </tbody>
              </table>
              </>:
              <>
              <h4>No Data</h4>
              </>
            }
            </>
          }
        
        </div>
        <div className="academic-progress">
          <h2>Employment Status</h2>
          {
            use.alumn.life_status==='D'? <h4>Deceased</h4>:
            <>
            {
              employment.length>0 && (employment.filter(employ => employ.alumn_id === use.alumn.id)).length>0?
              <>
              <table class="zigzag">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Career</th>
                    <th>Company</th>
                    <th>Job Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (employment.filter(employ => employ.alumn_id === use.alumn.id)).length>0?
                    <>
                    {
                      (employment.filter(employ => employ.alumn_id === use.alumn.id)).sort((a, b) => {
                        const priorityA = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[a.status] || Infinity;
                        const priorityB = { 'S': 0, 'F': 1, 'P': 2, 'I': 3, 'U': 4,'N':5 }[b.status] || Infinity;
                        return priorityA - priorityB;
                    }).map((emp,ke)=>
                    <tr key={ke}>
                        <td>{emp.title}</td>
                        <td>{emp.career}</td>
                        <td>{emp.company}</td>
                        <td>{emp.status==='F'?"Full Time":emp.status==='P'?"Part Time":emp.status==='S'?"Self Employed":emp.status==='U'?"Unemployed":emp.status==='I'?"Intern":"No Info"}</td>
                        
                    </tr>
                    )
                    }
                    </>:<tr><td>No Data</td></tr>
                  }
                  
                </tbody>
              </table>
              </>:
              <>
              <h4>No Data</h4>
              </>
            }
            </>
          }
        
        </div>
        
      </div>
      )}
    </>
  )
}