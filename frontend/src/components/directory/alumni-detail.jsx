import React, { useEffect, useState } from 'react';
import './alumni-detail.css';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';

const AlumniDetail = ({ selectedAlumni, handleClear }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [stuByGrade, setStuByGrade] = useState([]);
  const [empByGrade, setEmpByGrade] = useState([]);
  const [stuEmpByGrade, setStuEmpByGrade] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stuRes, empRes, bothRes] = await Promise.all([
          axios.get(baseUrl + '/stubygrade/', { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
          axios.get(baseUrl + '/emplbygrade/', { headers: { Authorization: `Bearer ${auth.accessToken}` } }),
          axios.get(baseUrl + '/empstubygrade/', { headers: { Authorization: `Bearer ${auth.accessToken}` } })
        ]);
        setStuByGrade(stuRes.data || []);
        setEmpByGrade(empRes.data || []);
        setStuEmpByGrade(bothRes.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [auth]);

  if (!selectedAlumni) return null;

  const combinationStyle = (combination) => combination?.replace(/-/g, ', ') || '';

  const handleViewClick = () => {
    navigate("/personal_profile", {
    state: { selectedID: selectedAlumni.id }
});
  };

  return (
    <div className="alumni-detail-content">
      <img src={selectedAlumni.profilePic} alt="Profile" className="detail-pic" />
      <div className="detail-first-name">{selectedAlumni.firstName}</div>
      <div className="detail-last-name">{selectedAlumni.lastName}</div>
      <div className="detail-contact-info">{selectedAlumni.email}</div>
      <div className="detail-contact-info">{selectedAlumni.phone}</div>

      <div className="detail-grid">
        <div className="DetailTitle">ASYV Grade</div>
        <div className="DetailValue">{selectedAlumni.grade}</div>
        <div className="DetailTitle">ASYV Family</div>
        <div className="DetailValue">{selectedAlumni.family}</div>
        <div className="DetailTitle">Combination</div>
        <div className="DetailValue">{combinationStyle(selectedAlumni.combination)}</div>
        <div className="DetailTitle">Job Industry</div>
        <div className="DetailValue">{selectedAlumni.industry}</div>
      </div>

      <div className="alumni-detail-button">
        <button onClick={handleViewClick} className="alumni-view-button">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default AlumniDetail;
