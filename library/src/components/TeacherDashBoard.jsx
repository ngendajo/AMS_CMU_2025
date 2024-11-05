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
  

  const handleSlotClick = (slot_id, action) => {
    // Your desired functionality here
    console.log("Slot ID:", slot_id, "action:", action);

  };
  //console.log(data)
  // Function to extract the date in YYYY-MM-DD format
  const extractDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  function toMinutes(hours, minutes) {
      return hours * 60 + minutes;
  }
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
          {data.map((slot, index) => {
        // Parse times for comparison
        // Assuming slot.date is in YYYY-MM-DD format and slot.start_time, slot.end_time are in HH:MM format
            // Get the current date string in YYYY-MM-DD format
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0];

            // Create date objects for slot's start and end times
            const startTime = slot.start_time 
              ? (() => {
                  const [hours, minutes] = slot.start_time.split(':');
                  return { hours: parseInt(hours), minutes: parseInt(minutes) };
                })() 
              : null;
            const slotStartTime = startTime ? `${startTime.hours}:${startTime.minutes}`:"N/A"

            const endTime = slot.end_time 
              ? (() => {
                  const [hours, minutes] = slot.end_time.split(':');
                  return { hours: parseInt(hours), minutes: parseInt(minutes) };
                })() 
              : null;
            const slotEndTime = endTime ? `${endTime.hours}:${endTime.minutes}` : 'N/A'
            // Create a current time object based on current hours and minutes
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();

            // Format the current time as a string
            const currentTime = `${currentHours}:${currentMinutes}`;
            const currentTotalMinutes = toMinutes(currentHours, currentMinutes);
            const slotEndTotalMinutes = toMinutes(endTime.hours, endTime.minutes);
            const slotStartTotalMinutes = toMinutes(startTime.hours, startTime.minutes);

            // Get attendance status message and color
            let attendanceStatus = '';
            let statusColor = '#6d5736';
            let action=''

            // Extract the date from slot.date for comparison
            const slotDateString = extractDate(slot.date);

            if (slot.attendance_data?.id) {
              action="update"
                const absenteesCount = slot.attendance_data.absentees.length;
                attendanceStatus = `Attendance taken${absenteesCount > 0 ? ` (${absenteesCount} absent)` : ''}`;
                statusColor = '#498160';
            } else if (
                currentDateString === slotDateString && // Compare only the date portion
                slotStartTime && slotEndTime &&
                currentTime >= slotStartTime &&
                currentTime <= slotEndTime
            ) {
                attendanceStatus = 'Take attendance';
                statusColor = '#957967';
                action="take"
            } else if (
                currentDateString === slotDateString &&
                currentTotalMinutes > slotEndTotalMinutes
            ) {
                attendanceStatus = 'Not taken';
                statusColor = "#d8b040";
                action="take"
            } else if (
                currentDateString === slotDateString &&
                currentTotalMinutes < slotStartTotalMinutes
            ) {
                attendanceStatus = 'Wait';
                statusColor = "#f49c46";
                action="wait"
            } else if (
                new Date(slot.date).toISOString().split('T')[0] < currentDateString // Compare slot date to current date
            ) {
                attendanceStatus = 'Not taken';
                statusColor = "#d8b040";
                action="take"
            } else {
                attendanceStatus = 'Wait';
                statusColor = "#f49c46";
                action="wait"
            }

            // Use the attendanceStatus and statusColor variables as needed


        return (
          <div
          key={slot.id}
          onClick={() => action !== "wait" && handleSlotClick(slot.id, action)} // Prevent click if action is "wait"
          style={{
              backgroundColor: colorPalette[index % colorPalette.length],  // Cycle through colors
              color: action === "wait" ? '#000' : '#fff', // Change text color to gray when "wait"
              padding: '15px',
              borderRadius: '8px',
              width: '200px',                    // Fixed width for items
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',           // Stack contents vertically
              alignItems: 'center',              // Center-align content
              textAlign: 'center',
              cursor: action === "wait" ? "not-allowed" : "pointer", // Change cursor style based on action
          }}
          >
            <h2 style={{ margin: '5px 0' }}>{getClass(slot.grade_name, slot.combination_name)}</h2>
            <p style={{ margin: '5px 0' }}>{slot.subject_name}</p>
            <p style={{ margin: '5px 0' }}>{slot.room_name}</p>
            <p style={{ margin: '5px 0' }}>{slot.activity}: {slot.start_time} - {slot.end_time}</p>
            {attendanceStatus && (
              <p 
              style={{ // Cycle through colors
                color: action === "wait" ? '#498160': "#d8b040",
                backgroundColor:"#000",
                padding: '5px',
              borderRadius: '4px',
              }}>
                {attendanceStatus}
              </p>
            )}
          </div>
        );
      })}
        </div>
    </div>
  );
}