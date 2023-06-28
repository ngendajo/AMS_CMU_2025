
import './admin.css';
import { BsDot } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import Item from "../components/charts/Item";
import useAuth from '../hooks/useAuth';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  
    const [total, setTotal] = useState('');
    const [male, setMale] = useState('');
    const [female, setFemale] = useState('');
    const [employ, setEmploy] = useState('');
    const [unemploy, setUnemploy] = useState('');
    const [intern, setIntern] = useState('');
    const [others, setOthers] = useState('');
    const {auth} = useAuth();

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
console.log(total)
console.log(male)
console.log(female)
console.log(employ)
console.log(unemploy)
console.log(intern)
console.log(others)
let data = [5, 2, 5, 5, 10],
    subTitle1 = total,
    showLabel = false,
    colors = ["#F49D47","#42A2EC", "#F9DF5A", "#FF7410", "#4C8061"],
    radius = 45,
    hole = 30,
    stroke = 1,
    strokeWidth = 10;
  return (
    <div className="dashboard-container">
        <div className="statistic-part">
          <div className="statistic-part-left statistic">
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
                  <div className='item2-title'>10 Grades</div>
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
                      <div className='male-statistics'><strong className='male-number'>{female}</strong><span className='female-percentage'>{Math.round(male===0? 0:(female*100)/total)}%</span></div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className="statistic-part-center statistic">
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
            </div>
          </div>
          <div className="statistic-part-right statistic">
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
            </div>
          </div>
        </div>
    </div>
  )
}

export default Admin