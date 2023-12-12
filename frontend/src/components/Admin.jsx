
import './admin.css';
import { BsDot } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Item from "../components/charts/Item";
import useAuth from '../hooks/useAuth';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../api/baseUrl';
import EmploymentGeneralReportChart from './charts/EmploymentGeneralReportChart';
import FutherStudingGeneralReportChart from './charts/FutherStudingGeneralReportChart';
import EmployementAndEducation from './charts/EmployementAndEducation';
import {Bar} from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  LinearScale
} from 'chart.js';
import { map } from 'highcharts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Admin = () => {
   
    const [total, setTotal] = useState('');
    const [alumni, setAlumni] = useState([]);
    const [empStuReport, setEmpStuReport] = useState(new Map());
    const [empStugrade, setEmpStugrade] = useState([]);
    const [male, setMale] = useState('');
    const [female, setFemale] = useState('');
    const [employ, setEmploy] = useState('');
    const [unemploy, setUnemploy] = useState('');
    const [others, setOthers] = useState('');
    const [grades, setGrades] = useState('');
    const [certificates, setCertificates] = useState(0);
    const [a1, setA1] = useState('');
    const [m, setM] = useState('');
    const [phd, setPhd] = useState('');
    const [noInfo, setNoInfo] = useState('');
    const [nfs, setNfs] = useState('');
    const [died, setDied] = useState('');
    const [diede, setDiede] = useState('');
    const [noInfoUne, setNoInfoUne] = useState('');
    const [Bachelors, setBachelors] = useState('');
    const [otherdegree, setOtherdegree] = useState('');
    const {auth} = useAuth();
    const navigate=useNavigate();

    useEffect(() =>{
    
      const getAlumni = async () =>{
          try{
              const response = await axios.get(baseUrl+'/lumngradereport/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              //console.log(response.data)
              const groupedData = Array.isArray(response.data)?
              response.data.reduce((groups, item) => {
                const { grade } = item;
                if (!groups[grade]) {
                    groups[grade] = [];
                }
                groups[grade].push(item);
                return groups;
            }, {}):null;
            console.log(groupedData)
            let alu=[]
            Object.entries(groupedData).forEach(([grade, items]) => {
              if(grade==="null"){
                alu.push({
                  "grade":"Others",
                  "boys":0,
                  "girls":0,
                  "others":items[0].number
                })

              } else{
                if(items.length==1){
                  alu.push({
                    "grade":grade,
                    "boys":items[0].gender==="Male"?items[0].number:0,
                    "girls":items[0].gender==="Female"?items[0].number:0,
                    "others":0
                  })
                }else{
                  alu.push({
                    "grade":grade,
                    "boys":items[0].gender==="Male"?items[0].number:items[1].number,
                    "girls":items[0].gender==="Female"?items[0].number:items[1].number,
                    "others":0
                  })
                }
                
              }
          })
          alu.length>0?
          setAlumni(alu):null;
          }catch(err) {
              console.log(err);
               //navigate('/error');
          }
      }
  
      getAlumni();
  
  },[auth])

    useEffect(() =>{
    
      const getGrades = async () =>{
          try{
              const response = await axios.get(baseUrl+'/grades/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              Array.isArray(response.data)?
              setGrades(response.data.length):setGrades(0);
          }catch(err) {
              console.log(err);
               navigate('/error');
          }
      }
  
      getGrades();
  
  },[auth])

  useEffect(() =>{
    
    const getEmpStu = async () =>{
        try{
            const response = await axios.get(baseUrl+'/empstureport/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            let empstu=new Map();
            let grades= new Set();
            Array.isArray(response.data)?
            response.data.forEach((empst)=>{
              grades.add(empst.grade_name)
              empstu.set(empst.grade_name+"Male"+"noEmp"+"noStu",0);
              empstu.set(empst.grade_name+"Male"+"noEmp"+"Stu",0);
              empstu.set(empst.grade_name+"Male"+"Emp"+"noStu",0);
              empstu.set(empst.grade_name+"Male"+"Emp"+"Stu",0);
              empstu.set(empst.grade_name+"Female"+"noEmp"+"noStu",0);
              empstu.set(empst.grade_name+"Female"+"noEmp"+"Stu",0);
              empstu.set(empst.grade_name+"Female"+"Emp"+"noStu",0);
              empstu.set(empst.grade_name+"Female"+"Emp"+"Stu",0);
            }):null;
            setEmpStugrade(Array.from(grades))
            Array.isArray(response.data)?
            response.data.forEach((empst)=>{
              let key=empst.grade_name+empst.gender;
           
              if(empst.emp==="N" || empst.emp==="U"){
                key+="noEmp";
              }
              else{
                key+="Emp";
              }
              if(empst.stu==="N" ||empst.stu==="NMS"){
                key+="noStu";
              }else if(empst.stu==="D"){
                key+="died";
              }
              else{
                key+="Stu";
              }
              empstu.set(key,empstu.get(key)+1);
            }):null;
            setEmpStuReport(empstu)
         
        }catch(err) {
            console.log(err);
        }
    }

    getEmpStu();

},[auth])

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get(baseUrl+'/alumnitotal/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            //console.log(response.data)
            setTotal(response.data.total_users)
            setFemale(response.data.female_count)
            setMale(response.data.male_count)
            setA1(response.data.A1)
            setCertificates(response.data.C)
            setM(response.data.M)
            setPhd(response.data.PHD)
            setBachelors(response.data.A0)
            setNoInfo(response.data.N)
            setNfs(response.data.NMS)
            setDied(response.data.D)
            setOtherdegree((response.data.total_users)-(response.data.A1+response.data.A0+response.data.C+response.data.M+response.data.PHD+response.data.D+response.data.NMS+response.data.N))
            setEmploy(response.data.S+response.data.F+response.data.P+response.data.I)
            setUnemploy(response.data.U)
            
            setNoInfoUne(response.data.NEM)
            setDiede(response.data.DEM)
            setOthers((response.data.total_users)-(response.data.S+response.data.F+response.data.P+response.data.I+response.data.U+response.data.DEM+response.data.NEM))
        }catch(err) {
            console.log(err);
            navigate('error');
        }
    }

    getcrcusers();

},[auth])
let data = [5, 2, 5, 5, 10],
    subTitle1 = total,
    showLabel = false,
    colors = ["#F49D47","#42A2EC", "#F9DF5A", "#FF7410", "#4C8061"],
    radius = 20,
    hole = 15,
    stroke = 1,
    strokeWidth = 7;
  return (
    <div className="dashboard-container">
        <div className="statistic-part">
          <Link to={"/alumni/"} className="statistic-part-left statistic">
            <div className='alumni-statistics-title'>
              <h2>Total Alumni</h2>
            </div>
            <div className='alumni-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
                <div className='item2'>
                  <div className='item2-title'>Alumni</div>
                  <div className='item2-body'><strong><AiOutlinePlus className='item2-icon'/></strong><strong className='alumni-number'>{total}</strong></div>
                  <div className='item2-title'>{grades} Grades</div>
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Male</div>
                      <div className='male-statistics'><strong className='male-number'>{male}</strong><span className='male-percentage'>{Math.round(male===0? 0:(male*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Female</div>
                      <div className='male-statistics'><strong className='male-number'>{female}</strong><span className='female-percentage'>{Math.round(female===0? 0:(female*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
            </div>
          </Link>
          <Link to={'/alumni/studie/'} className="statistic-part-center statistic">
            <div className='education-statistics-title'>
              <h2>Education level</h2>
            </div>
            <div className='education-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Certificate</div>
                      <div className='male-statistics'><strong className='male-number'>{certificates}</strong><span className='female-percentage'>{Math.round(setCertificates===0? 0:(certificates*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>A1 Diploma</div>
                      <div className='male-statistics'><strong className='male-number'>{a1}</strong><span className='female-percentage'>{Math.round(a1===0? 0:(a1*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Bachelors</div>
                      <div className='male-statistics'><strong className='male-number'>{Bachelors}</strong><span className='female-percentage'>{Math.round(Bachelors===0? 0:(Bachelors*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Masters</div>
                      <div className='male-statistics'><strong className='male-number'>{m}</strong><span className='female-percentage'>{Math.round(m===0? 0:(m*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>PHD</div>
                      <div className='male-statistics'><strong className='male-number'>{phd}</strong><span className='female-percentage'>{Math.round(phd===0? 0:(phd*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Deceased</div>
                      <div className='male-statistics'><strong className='male-number'>{died}</strong><span className='female-percentage'>{Math.round(died===0? 0:(died*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>No Info</div>
                      <div className='male-statistics'><strong className='male-number'>{noInfo}</strong><span className='female-percentage'>{Math.round(noInfo===0? 0:(noInfo*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>No Further Studies</div>
                      <div className='male-statistics'><strong className='male-number'>{nfs}</strong><span className='female-percentage'>{Math.round(nfs===0? 0:(nfs*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
                {otherdegree>0?
              <div className='itme3'>
              <div className='item3-top'>
                <div><BsDot className='item3-icon'/></div>
                <div>
                  <div className='item2-title'>No Records</div>
                  <div className='male-statistics'><strong className='male-number'>{otherdegree}</strong><span className='female-percentage'>{Math.round(otherdegree===0? 0:(otherdegree*100)/total)}%</span></div>
                </div>
              </div>
            </div>:null  
              }
                
            </div>
          </Link>
          <Link to={"/alumni/employment/"} className="statistic-part-right statistic">
            <div className='employment-statistics-title'>
              <h2>Employment Rate</h2>
            </div>
            <div className='employment-statistics-body'>
                <div className="item">
                  <Item
                    data={data}
                    subTitle1={subTitle1}
                    colors={colors}
                    radius={radius}
                    hole={hole}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    showLabel={showLabel}
                  />
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Employed</div>
                      <div className='male-statistics'><strong className='male-number'>{employ}</strong><span className='female-percentage'>{Math.round(employ===0? 0:(employ*100)/total)}%</span></div>
                    </div>
                  </div>
                  {others>0?
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>No Records</div>
                      <div className='male-statistics'><strong className='male-number'>{others}</strong><span className='female-percentage'>{Math.round(others===0? 0:(others*100)/total)}%</span></div>
                    </div>
                  </div>:null
                  }
                </div>
                <div className='itme3'>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Unemployed</div>
                      <div className='male-statistics'><strong className='male-number'>{unemploy}</strong><span className='female-percentage'>{Math.round(unemploy===0? 0:(unemploy*100)/total)}%</span></div>
                    </div>
                  </div>
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>No Info</div>
                      <div className='male-statistics'><strong className='male-number'>{noInfoUne}</strong><span className='female-percentage'>{Math.round(noInfoUne===0? 0:(noInfoUne*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
            </div>
          </Link>
        </div>
        <div className="staff-data">
          <div className='results-list-in-table alumni-list-body'>
           <center><h1>Alumni in Grade</h1></center>
           <Bar data={{
            labels:alumni.map(alumn=>alumn.grade),
            datasets:[
              {
                label:"Boys",
                data:alumni.map(alumn=>alumn.boys),
                backgroundColor:"#F49D47",
              },
              {
                label:"Girls",
                data:alumni.map(alumn=>alumn.girls),
                backgroundColor:"#2b7e40",
              },
              {
                label:"Others",
                data:alumni.map(alumn=>alumn.others),
                backgroundColor:"#FF0000",
              },
            ]
           }} /> 
          </div>
        </div>
        <div className="staff-data">
          <div className='results-list-in-table alumni-list-body'>
              <EmploymentGeneralReportChart data={empStuReport} grades={empStugrade} />
          </div>
        </div>
        <div className="staff-data">
          <div className='results-list-in-table alumni-list-body'>
              <FutherStudingGeneralReportChart data={empStuReport} grades={empStugrade} />
          </div>
        </div>
        <div className="staff-data">
          <div className='results-list-in-table alumni-list-body'>
              <EmployementAndEducation data={empStuReport} grades={empStugrade} />
          </div>
        </div>
    </div>
  )
}

export default Admin