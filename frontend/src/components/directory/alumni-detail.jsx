import React, { useState, useEffect } from 'react';
import "./alumni-detail.css";
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';

import Legend from './legend.jsx';
import TotalStuGraph from './total-stu-graph.jsx';
import TotalEmpGraph from './total-emp-graph.jsx';
import StuGraph from './stu-graph.jsx';
import EmpGraph from './emp-graph.jsx';

import OutcomePieChart from './outcome-pie-chart.jsx';

const AlumniDetail = ({ selectedAlumni, handleClear, gradeFilter, familyFilter, combinationFilter, industryFilter, outcomeSummary }) => {
    
    const combinationStyle = (combination) => combination.replace(/-/g, ', ')
    const navigate = useNavigate();
    const { auth } = useAuth();

    // staff only
    const [stuByGrade, setStuByGrade] = useState([]);
    const [empByGrade, setEmpByGrade] = useState([]);
    const [stuEmpByGrade, setStuEmpByGrade] = useState([]);

    const handleViewClick = () => {
        navigate("/personal_profile_staff", { state: { selectedID: selectedAlumni.id } });
    };
    const handleDeleteClick = async (event) => {
        const confirmed = window.confirm('Are you sure you want to delete this alumnus?');
        if (!confirmed) {
            return;
        }
        try {
            await axios.delete(`${baseUrl}/deleteuser/${event}/delete/`, {
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`,
                    "Content-Type": 'application/json'
                }
            });
            alert("Deleted successfully");
            await handleClear();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() =>{
        const getStuStu = async () =>{
            try{
                const response = await axios.get(baseUrl+'/stubygrade/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                console.log(response.data)
                response.data.length > 0 ? setStuByGrade(response.data) : setStuByGrade([])
            }catch(err) {
                console.log(err);
            }
        }
        getStuStu();
    },[auth])

    useEffect(() =>{
        const getEmpStu = async () =>{
            try{
                const response = await axios.get(baseUrl+'/emplbygrade/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                console.log(response.data)
                response.data.length > 0 ? setEmpByGrade(response.data) : setEmpByGrade([])    
            }catch(err) {
                console.log(err);
            }
        }
        getEmpStu();
    },[auth])

    useEffect(() =>{
        const getStuEmpStu = async () =>{
            try{
                const response = await axios.get(baseUrl+'/empstubygrade/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                console.log(response.data)
                response.data.length > 0 ? setStuEmpByGrade(response.data) : setStuEmpByGrade([])
            }catch(err) {
                console.log(err);
            }
        }
        getStuEmpStu();
    },[auth])

    // total
    const clean = (input) => {
        const { diedmale, diedfemale, ...rest } = input;
        return rest
    }
    const cleanGivenEmp = (input) => {
        const { ac, diedmale, diedfemale, unempstumale, unempstufemale, unempnstumale, unempnstufemale, ...rest } = input;
        return rest
    }
    const cleanGivenStu = (input) => {
        const { ac, diedmale, diedfemale, empnstumale, empnstufemale, unempnstumale, unempnstufemale, ...rest } = input;
        return rest
    }
    const cleanData = (input) => {
        return input.map(item => clean(item));
    }
    const cleanDataGivenEmp = (input) => {
        return input.map(item => cleanGivenEmp(item));
    }
    const cleanDataGivenStu = (input) => {
        return input.map(item => cleanGivenStu(item));
    }
    const getTotal = (input) => {
        const totals = input.map(item => getGradeTotal(item));
        const sum = totals.reduce((acc, curr) => acc + curr, 0);
        return sum
    }
    const getCurrent = (input) => {
        const totals = input.map(item => getGradeCurrent(item));
        const sum = totals.reduce((acc, curr) => acc + curr, 0);
        return sum
    }

    // per grade
    const drawStuGraph = (filter) => {
        if (filter !== ""){
            return stuByGrade.find(item => item.grade_name === filter) || {};
        }
        return {};
    }
    const drawEmpGraph = (filter) => {
        if (filter !== ""){
            return empByGrade.find(item => item.grade_name === filter) || {};
        }
        return {};
    }
    const cleanGradeData = (input) => {
        const { grade_name, diedmale, diedfemale, ...rest } = input;
        return rest
    }
    const getGradeTotal = (input) => {
        const { grade_name, ...rest } = input;
        const values = Object.values(rest);
        const counts = values.reduce((acc, value) => acc + value, 0);
        return counts
    }
    const getGradeCurrent = (input) => {
        const { grade_name, diedmale, diedfemale, ...rest } = input;
        const values = Object.values(rest);
        const counts = values.reduce((acc, value) => acc + value, 0);
        return counts
    }

    return (
        <div className="alumni-detail">
            {selectedAlumni ? (
                <>
                    {auth.user.is_alumni &&
                    <button className="backToGraph" onClick={handleClear}>
                        Back &gt;
                    </button>}
                    {(auth.user.is_crc || auth.user.is_superuser) &&
                    <button className="backToGraph" onClick={handleClear}>
                        View Graph &gt;
                    </button>}
                    <img src={selectedAlumni.profilePic} alt="Profile" className="detail-pic" />
                    <div className="detail-first-name">
                        {selectedAlumni.firstName}
                    </div>
                    <div className="detail-last-name">
                        {selectedAlumni.lastName}
                    </div>
                    <div className="detail-contact-info">
                        {selectedAlumni.email}
                    </div>
                    <div className="detail-contact-info">
                        {selectedAlumni.phone}
                    </div>
                    <div className="detail-grid">
                        <div className="DetailTitle">ASYV Grade</div><div className="DetailValue" > {selectedAlumni.grade} </div>
                        <div className="DetailTitle">ASYV Family</div><div className="DetailValue" > {selectedAlumni.family} </div>
                        <div className="DetailTitle">Combination</div><div className="DetailValue" > {combinationStyle(selectedAlumni.combination)} </div>
                        <div className="DetailTitle">Job Industry</div><div className="DetailValue" > {selectedAlumni.industry} </div> 
                    </div>
                    {(auth.user.is_crc || auth.user.is_superuser) && (
                    <div className="alumni-detail-button">
                        <button onClick={handleViewClick} className="alumni-view-button">
                            View
                        </button>
                        <button onClick={() => handleDeleteClick(selectedAlumni.id)} className="alumni-delete-button">
                            Delete
                        </button>
                    </div>
                    )}
                </>
            ) : (
                <>
                    {auth.user.is_alumni &&
                        <div className="detail-empty-message">Select an alumnus to see details.</div>
                    }
                    {(auth.user.is_crc || auth.user.is_superuser) && outcomeSummary && (
                    <div className="detail-graph">
                        <div className="detail-graph-title">Outcome Summary</div>
                        <div className="detail-graph-description">
                        Total Alumni: {outcomeSummary.total_alumni}
                        </div>
                        <OutcomePieChart summary={outcomeSummary} />
                    </div>
                    )}

                </>
            )}
        </div>
    );
};

export default AlumniDetail;