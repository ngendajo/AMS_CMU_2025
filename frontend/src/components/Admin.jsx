
import './admin.css';
import { BsDot } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Item from "../components/charts/Item";
import useAuth from '../hooks/useAuth';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  LinearScale
} from 'chart.js';

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
    const [male, setMale] = useState('');
    const [female, setFemale] = useState('');
    const [employ, setEmploy] = useState('');
    const [unemploy, setUnemploy] = useState('');
    const [intern, setIntern] = useState('');
    const [others, setOthers] = useState('');
    const [grades, setGrades] = useState('');
    const [a2, setA2] = useState('');
    const [a1, setA1] = useState('');
    const [m, setM] = useState('');
    const [phd, setPhd] = useState('');
    const [Bachelors, setBachelors] = useState('');
    const [otherdegree, setOtherdegree] = useState('');
    const {auth} = useAuth();

    useEffect(() =>{
    
      const getAlumni = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/lumngradereport/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              console.log(response.data)
              const groupedData = response.data.reduce((groups, item) => {
                const { grade } = item;
                if (!groups[grade]) {
                    groups[grade] = [];
                }
                groups[grade].push(item);
                return groups;
            }, {});
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
                alu.push({
                  "grade":grade,
                  "boys":items[0].gender==="Male"?items[0].number:items[1].number,
                  "girls":items[0].gender==="Female"?items[0].number:items[1].number,
                  "others":0
                })
              }
          })
          setAlumni(alu)
          }catch(err) {
              console.log(err);
          }
      }
  
      getAlumni();
  
  },[auth])

    useEffect(() =>{
    
      const getGrades = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/grades/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setGrades(response.data.length);
          }catch(err) {
              console.log(err);
          }
      }
  
      getGrades();
  
  },[auth])

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://localhost:8000/api/totalalumnreport/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            setTotal(response.data.length)
            setFemale(
              response.data.filter(element => {
                if (element.gender==="Female") {
                  return true;
                }
              
                return false;
              }).length
            )
            setMale(
              response.data.filter(element => {
                if (element.gender==="Male") {
                  return true;
                }
              
                return false;
              }).length
            )
            setA1(
              response.data.filter(element => {
                if (element.degree==="A1") {
                  return true;
                }
              
                return false;
              }).length
            )
            setA2(
              response.data.filter(element => {
                if (element.degree==="A2") {
                  return true;
                }
              
                return false;
              }).length
            )
            setM(
              response.data.filter(element => {
                if (element.degree==="M") {
                  return true;
                }
              
                return false;
              }).length
            )
            setPhd(
              response.data.filter(element => {
                if (element.degree==="PHD") {
                  return true;
                }
              
                return false;
              }).length
            )
            setBachelors(
              response.data.filter(element => {
                if (element.degree==="A0") {
                  return true;
                }
              
                return false;
              }).length
            )
            setOtherdegree(
              response.data.filter(element => {
                if (element.degree===null) {
                  return true;
                }
              
                return false;
              }).length
            )
            setEmploy(
              response.data.filter(element => {
                if (element.employed!=="I" && element.end==="Up to now") {
                  return true;
                }
              
                return false;
              }).length
            )
            setUnemploy(
              response.data.filter(element => {
                if (element.end!=="Up to now" && element.end!==null) {
                  return true;
                }
              
                return false;
              }).length
            )
            setIntern(
              response.data.filter(element => {
                if (element.employed==="I" && element.end==="Up to now") {
                  return true;
                }
              
                return false;
              }).length
            )
            setOthers(
              response.data.filter(element => {
                if (element.employed===null ) {
                  return true;
                }
              
                return false;
              }).length
            )
        }catch(err) {
            console.log(err);
        }
    }

    getcrcusers();

},[auth])
let data = [5, 2, 5, 5, 10],
    subTitle1 = total,
    showLabel = false,
    colors = ["#F49D47","#42A2EC", "#F9DF5A", "#FF7410", "#4C8061"],
    radius = 30,
    hole = 25,
    stroke = 1,
    strokeWidth = 10;
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
                      <div className='item2-title'>A2 Certificate</div>
                      <div className='male-statistics'><strong className='male-number'>{a2}</strong><span className='female-percentage'>{Math.round(a2===0? 0:(a2*100)/total)}%</span></div>
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
                      <div className='item2-title'>Others</div>
                      <div className='male-statistics'><strong className='male-number'>{otherdegree}</strong><span className='female-percentage'>{Math.round(otherdegree===0? 0:(otherdegree*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
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
                  <div className='item3-top'>
                    <div><BsDot className='item3-icon'/></div>
                    <div>
                      <div className='item2-title'>Internship</div>
                      <div className='male-statistics'><strong className='male-number'>{intern}</strong><span className='female-percentage'>{Math.round(intern===0? 0:(intern*100)/total)}%</span></div>
                    </div>
                  </div>
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
                      <div className='item2-title'>Others</div>
                      <div className='male-statistics'><strong className='male-number'>{others}</strong><span className='female-percentage'>{Math.round(others===0? 0:(others*100)/total)}%</span></div>
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
    </div>
  )
}

export default Admin