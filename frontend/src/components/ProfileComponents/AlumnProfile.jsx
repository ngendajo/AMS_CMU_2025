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
        const [ users, setUsers ] = useState([]);
        const {auth} = useAuth()
        const [ employment, setEmployment ] = useState([]);
        const [ study, setStudy ] = useState([]);
        const [opportunities, setOpportunities] = useState([]);
    
        useEffect(() =>{
    
            const getusers = async () =>{
                try{
                    const response = await axios.get('http://127.0.0.1:8000/api/alumni/',{
                        headers: {
                            "Authorization": 'Bearer ' + String(auth.accessToken),
                            "Content-Type": 'multipart/form-data'
                        },
                        withCredentials:true
                    });
                    let listusers=[]
                    let listuser=[]
                    response.data.forEach((one)=>{
                      if(parseInt(params.id)===parseInt(one.id)){
                        listuser.push(one)
                      }
                    })
                    response.data.forEach((alu)=>{
                      if(alu.alumn==null){
                        return;
                      }
                      if(parseInt(listuser[0].alumn.Family.grade.id)===parseInt(alu.alumn.Family.grade.id) && (parseInt(params.id)!==parseInt(alu.id))){
                        listusers.push(alu);
                      }
                    })
                    setUsers(listusers)
                    setUser(listuser)
                    
                    
                    
                }catch(err) {
                    console.log(err);
                }
            }
    
            getusers();
    
        },[auth,params])
        
        useEffect(() =>{
            const getemploy = async () =>{
              try{
                  const response = await axios.get('http://127.0.0.1:8000/api/employment/',{
                      headers: {
                          "Authorization": 'Bearer ' + String(auth.accessToken),
                          "Content-Type": 'multipart/form-data'
                      },
                      withCredentials:true
                  });
                  response.data.forEach((emp)=>{
                    if(parseInt(emp.id)===parseInt(params.id)){
                      setEmployment([emp])
                    }
                  })
                  
              }catch(err) {
                  console.log(err);
              }
          }
      
          getemploy();
          
      
      },[auth])

      useEffect(() =>{
        const getstudy = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/studie/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              response.data.forEach((st)=>{
                if(parseInt(st.id)===parseInt(params.id)){
                  setStudy([st])
                }
              })
              
          }catch(err) {
              console.log(err);
          }
      }
  
      getstudy();
      
  
  },[auth])

      const fetchOpportunities = async () => {
        
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/opportunity');
          
          response.data.forEach((opp)=>{
            if(parseInt(opp.user)===parseInt(params.id)){
              setOpportunities(opp);
            }
          })
          
          
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        fetchOpportunities();
      }, [params]);
      console.log(users)
  return (
    <>
      {user.map((use,i) =>
      <div key={i}>
        <div className='alumni-profile-main'>
          <div className="alumni-profile-top-left">
            <div className="basic-info">
              <img src={"http://localhost:8000"+use?.image_url} alt="profile" className="alumni-profile-img" />
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
                    {employment.length>0?
                      employment.map((emp,emp_id)=>
                      emp.title!==null? <h4 key={emp_id}>{emp.title}</h4>:<h4>Unknown</h4>
                      ):<h4>Unknown</h4>
                    }
                    
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
              <p>{opportunities.length}</p>
            </center>
          </div>
          <div className="alumni-profile-top-right">
            <div>
              <p>People from the same Grade</p>
              <span className="list-of-alumni-in-the-same-grade">
                {users.map((same,s)=>
                {
                  if(s<3 && parseInt(same.id)!==parseInt(params.id)){
                    return (parseInt(same.alumn.Family.grade.id)===parseInt(use.alumn.Family.grade.id))?
                  <img key={s} src={"http://localhost:8000"+same?.image_url} alt="profile" width={30} height={30} className="alumni-profile-img-same-grade" />
                  :null
                  }else{
                    return null
                  }
                }
                )}
                <strong>{users.length}+</strong>
              </span>
            </div>
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
              <p>First Name</p>
              <h4>{use.first_name}</h4>
            </div>
            <div>
              <p>Last Name</p>
              <h4>{use.last_name}</h4>
            </div>
            <div>
              <p>Gender</p>
              <h4>{use.alumn.gender}</h4>
            </div>
            <div>
              <p>Date of Birth</p>
              <h4>{use.alumn.gender}</h4>
            </div>
            <div>
              <p>Marital Status</p>
              <h4>{use.alumn.marital_status}</h4>
            </div>
            <div>
              <p>Place of Origin</p>
              <h4>{use.alumn.place_of_birth}</h4>
            </div>
            <div>
              <p>Current Residence</p>
              <h4>{use.alumn.CurrResidence}</h4>
            </div>
            </div>
            <div className="academic-perfomance">
            <div>
              <p>Kids</p>
              <h4>{use.alumn.kids?"Yes":"No"}</h4>
            </div>
            <div>
              <p>Father</p>
              <h4>{use.alumn.father}</h4>
            </div>
            <div>
              <p>Mother</p>
              <h4>{use.alumn.mother}</h4>
            </div>
            <div>
              <p>Grade</p>
              <h4>{use.alumn.Family.grade.grade_name}</h4>
            </div>
            <div>
              <p>Family</p>
              <h4>{use.alumn.Family.family_name}</h4>
            </div>
            <div>
              <p>Combination</p>
              <h4>{use.alumn.Combination.combination_name}</h4>
            </div>
            <div>
              <p>Enrichment Programs</p>
              {use.alumn.Eps.map((ep)=>{
                return <p>{ep.title} from <strong>{ep.type==="A"? "Arts Center":ep.type==="S"?"Sports":ep.type==="SC"?"Science Center":"Clubs"}</strong></p>
              })}
            </div>
            </div>
        </div>
              {/* Edication Progress */}
        {study.length>0 && study[0].study_id!==null?
        study.map((stu,is)=>
        <div key={is} className='alumni-profile-personal-info'>
          <div className="alumni-profile-info-top">
              <h2>Edication Progress</h2>
                <Link to={`/alumni/updatestudie/${stu.study_id}`} className="message-edit">
                <span>Edit</span>
                <CiEdit/>
              </Link>
          </div>
            <div className="academic-perfomance">
            
            <div>
              <p>Level</p>
              <h4>{stu.level}</h4>
            </div>
            <div>
              <p>Degree</p>
              <h4>{stu.degree}</h4>
            </div>
            <div>
              <p>University</p>
              <h4>{stu.university}</h4>
            </div>
            <div>
              <p>Country</p>
              <h4>{stu.country}</h4>
            </div>
            <div>
              <p>Scholarship Status</p>
              <h4>{stu.scholarship==="F"?"Full-Scholarship":stu.scholarship==="P"?"Partial-Scholarship":stu.scholarship==="N"?"None":null}</h4>
            </div>
            <div>
              <p>Status</p>
              <h4>{stu.status==="D"?"Dropped_Out":stu.status==="S"?"Susepended":stu.status==="O"?"On_going":stu.status==="C"?"Completed":null}</h4>
            </div>
            </div>
        </div>
        ):
        <div className='alumni-profile-personal-info'>
          <div className="alumni-profile-info-top">
              <h2>Employment Status</h2>
              <Link to={`/add-alumni/info/${use.alumn.id}/study`} className="message-edit">
              <span>Add</span>
              <CiEdit/>
            </Link> 
          </div>
            <div className="academic-perfomance">
            <h2>No Data</h2>
            </div>
        </div>
        }

        {/* Employment Status */}
        {employment.length>0 && employment[0].emp_id!==null?
        employment.map((employ)=>
        <div className='alumni-profile-personal-info'>
          <div className="alumni-profile-info-top">
              <h2>Employment Status</h2>
                <Link to={`/alumni/updateemployement/${employ.emp_id}`} className="message-edit">
                <span>Edit</span>
                <CiEdit/>
              </Link>
          </div>
            <div className="academic-perfomance">
            
            <div>
              <p>Title</p>
              <h4>{employ.title}</h4>
            </div>
            <div>
              <p>Status</p>
              <h4>{employ.status==="F"?"Full-Time":employ.status==="P"?"Part-Time":employ.status==="S"?"Self-Employed":employ.status==="I"?"Intern":null}</h4>
            </div>
            <div>
              <p>Company</p>
              <h4>{employ.company}</h4>
            </div>
            <div>
              <p>Start Date</p>
              <h4>{employ.start_date}</h4>
            </div>
            <div>
              <p>End Date</p>
              <h4>{employ.end}</h4>
            </div>
            </div>
            <div className="academic-perfomance">
            
            <div>
              <p>Description</p>
              <h4>{employ.description}</h4>
            </div>
            </div>
        </div>
        ):
        <div className='alumni-profile-personal-info'>
          <div className="alumni-profile-info-top">
              <h2>Employment Status</h2>
              <Link to={`/add-alumni/info/${use.alumn.id}/addemployment`} className="message-edit">
              <span>Add</span>
              <CiEdit/>
            </Link> 
          </div>
            <div className="academic-perfomance">
            <h2>No Data</h2>
            </div>
        </div>
        }
      </div>
      )}
    </>
  )
}
