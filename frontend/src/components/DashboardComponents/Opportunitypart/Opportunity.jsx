
import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import {CombinationsTable} from './CombinationsTable'
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiExport } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import { BiEditAlt } from "react-icons/bi";
import './combinations.css';

export const Combinations = () => {
    const [data, setData] = useState([]);
    let {auth} = useAuth();


    useEffect(() =>{

        const getData = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/combination/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                var combinationlist=[]
                response.data.forEach(e=>{
                    combinationlist.push({
                    combination:e.combination_name,
                    combination_id:<span>
                        <Link to={`/add-comb/${e.id}`}><BiEditAlt className='icon'/></Link>
                    </span>
                })
                })
                setData(combinationlist);
            }catch(err) {
                console.log(err);
            }
        }

        getData();

    },[auth])



  return (
    <center className='alumni-list-body'>
            <div className='staff-header-right alumni-header-right'>
                <div className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/add-comb" className='link'>Add Combination</Link><IoIosAdd className='addicon'/>
                </div>
              </div>

            <div id='allcombinations'>
                <CombinationsTable mockData={data}/>
            </div>

    </center>
  );
};
