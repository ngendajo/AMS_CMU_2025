import React, { useState, useEffect, useCallback } from 'react';
//import axios from 'axios';
//import baseUrl from "../api/baseUrl";
import useAuth from "../../hooks/useAuth";
import { fetchGrades } from '../../services/gradeService';

export default function Costatistics() {
  const [selectctedGradeId, setSelectctedGradeId] = useState(null);
  const [grades, setGrades] = useState([]);
  const { auth } = useAuth();

  const handleGradeChange = (event) => {
    setSelectctedGradeId(event.target.value);
    console.log(event.target.value);
    //getStudents();
  };

  useEffect(() => {
    
    // Fetch grades
    fetchGrades(auth).then(response => {
      setGrades(response.data);
  
    });
  }, [auth]);
  return (
    <div>
      <h2>Download Students by grade in Excel</h2>
      <select 
          value={selectctedGradeId || ''}
          onChange={handleGradeChange}
          style={{
            fontSize: '1.4em',
            fontWeight: 'bold',
            color: '#498160',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            marginLeft: '10px',
            padding: '5px 1px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="" disabled>Academic Year</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              {grade.grade_name} {grade.start_year} {grade.end_year}
            </option>
          ))}
        </select>
    </div>
  )
}
