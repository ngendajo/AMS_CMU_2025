import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import baseUrl from "../api/baseUrl";
import useAuth from "../hooks/useAuth";
import { fetchAcademics } from '../services/academicService';

export default function TeacherDashBoard() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const workingdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [selectedday, setSelectedday] = useState("");
  const [selecteddate, setSelecteddate] = useState("");
  const [academics, setAcademics] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedAcademicId, setSelectedAcademicId] = useState(null);
  const colorPalette = ["#6d5736", "#498160", "#957967", "#d8b040", "#f49c46"];

  const handleAcademicChange = (event) => {
    setSelectedAcademicId(event.target.value);
    getStudents();
  };

  const getClass = (grade_name, combination_name) => {
    const grade = grade_name === "Intwali" ? "S6" :
                  grade_name === "Ishami" ? "S5" :
                  grade_name === "Ijabo" ? "S4" : "EY";
    const comb = (combination_name.match(/\(([^)]+)\)/) || [])[1]?.trim() || combination_name;
    return grade === grade_name ? comb : grade + "_" + comb;
  };

  const handleDayChange = (event) => {
    const dayName = event.target.value;
    setSelectedday(dayName);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const selectedDayIndex = daysOfWeek.indexOf(dayName);

    // Calculate the date of the selected day
    const selectedDayDate = new Date(currentDate);
    selectedDayDate.setDate(currentDate.getDate() - currentDayOfWeek + selectedDayIndex);
    // Format the date as YYYY-MM-DD
    const formattedDate = selectedDayDate.toISOString().slice(0, 10);

    setSelecteddate(formattedDate);
    //console.log(formattedDate)
  };

  const getStudents = useCallback(async () => {
    if (!auth?.accessToken) return;
    try {
      const response = await axios.get(`${baseUrl}/timetable/?academic=${selectedAcademicId}&day_of_week=${selectedday}&teacher=${auth.user.id}&date=${selecteddate}`, {
        headers: {
          "Authorization": `Bearer ${String(auth.accessToken)}`,
        },
        withCredentials: true,
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [auth, selectedAcademicId, selectedday]);

  useEffect(() => {
    // Set default selected day to today's day if it's a working day
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = daysOfWeek[new Date().getDay()];
    if (workingdays.includes(today)) {
      setSelectedday(today);
      // Format the date as YYYY-MM-DD
    const formattedDate = (new Date()).toISOString().slice(0, 10);

    setSelecteddate(formattedDate);
    //console.log(formattedDate)
    }
  
    // Fetch academic years and set the default academic year based on today's date
    fetchAcademics(auth).then(response => {
      const academicYears = response.data;
      setAcademics(academicYears);
  
      const todayDate = new Date();
      const currentAcademic = academicYears.find(academic => {
        const startDate = new Date(academic.start_date);
        const endDate = new Date(academic.end_date);
        return todayDate >= startDate && todayDate <= endDate;
      });
  
      if (currentAcademic) {
        setSelectedAcademicId(currentAcademic.id);
      }
    });
  }, [auth]);
  
  // Fetch students whenever selected day or academic year changes
  useEffect(() => {
    if (selectedday && selectedAcademicId) {
      getStudents();
    }
  }, [selectedday, selectedAcademicId, getStudents]);
  

  const handleSlotClick = (grade_id, combination_id) => {
    // Your desired functionality here
    console.log("Grade ID:", grade_id, "Combination ID:", combination_id);

  };
  console.log(data)
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        margin: '20px 0'
      }}
    >
      <h2>Welcome {auth.user.first_name} {auth.user.last_name}</h2>
      <h1>
        Your Timetable On
        <select 
          value={selectedday || ''}
          onChange={handleDayChange}
          style={{
            fontSize: '0.8em',
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
          <option value="" disabled>select day</option>
          {workingdays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select 
          value={selectedAcademicId || ''}
          onChange={handleAcademicChange}
          style={{
            fontSize: '0.8em',
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
          {academics.map((academic) => (
            <option key={academic.id} value={academic.id}>
              {`${new Date(academic.start_date).getFullYear()}/${new Date(academic.end_date).getFullYear()}`}
            </option>
          ))}
        </select>
      </h1>
      <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',          // Allow items to wrap
            justifyContent: 'center',  // Center the items
            gap: '10px',               // Add spacing between items
            padding: '20px',
          }}
        >
          {data.map((slot, index) => (
            <div
              key={slot.id}
              onClick={() => handleSlotClick(slot.grade_id, slot.combination_id)}
              style={{
                backgroundColor: colorPalette[index % colorPalette.length],  // Cycle through colors
                color: '#fff',                      // Set text color for better contrast
                padding: '15px',
                borderRadius: '8px',
                width: '200px',                    // Fixed width for items
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',           // Stack contents vertically
                alignItems: 'center',              // Center-align content
                textAlign: 'center',
                cursor: 'pointer', 
              }}
            >
              <h2 style={{ margin: '5px 0' }}>{getClass(slot.grade_name, slot.combination_name)}</h2>
              <p style={{ margin: '3px 0' }}>{slot.subject_name}</p>
              <p style={{ margin: '3px 0' }}>{slot.room_name}</p>
              <p style={{ margin: '3px 0' }}>{slot.activity}: {slot.start_time} - {slot.end_time}</p>
            </div>
          ))}
        </div>
    </div>
  );
}
