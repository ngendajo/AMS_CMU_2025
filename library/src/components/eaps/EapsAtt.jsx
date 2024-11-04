import React, {useState, useEffect,useCallback} from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import baseUrl from '../../api/baseUrl';

export default function EapsAtt() {
    const [periods] = useState(['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7']);
    const [selectedCombination, setSelectedCombination] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [combinations, setCombinations] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    let {auth} = useAuth();

    const [showPopup, setShowPopup] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [l, setL] = useState(null);
    const [f, setF] = useState(null);

    const handleDeleteClick = (l,f,att_id) => {
        setDeleteId(att_id);
        setL(l);
        setF(f)
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };
    const handleCombinationChange = async (e) => {
        const combination = e.target.value;
        setSelectedCombination(combination);
        
        if (combination && students.length > 0) {
            try {
                // Wait for the filtered students asynchronously
                const filteredStudents = await getStudentsForCombination(
                    combination,
                    selectedDate,
                    selectedPeriod
                );
    
                // Set the filtered students state after data is fetched
                setFilteredStudents(filteredStudents);
            } catch (error) {
                console.error("Error fetching filtered students:", error);
                // Optionally, handle errors by displaying a message or taking some other action
            }
        }
    };
    const getStudentsForCombination = async (selectedCombination, selectedDate, selectedPeriod) => {
        try {
          // Wait for the attendance data to be fetched asynchronously
          const attendances = await getAttendances();
            
          // Filter and process the students regardless of whether attendances exist
          return students
            .filter(student => 
              student.eap_class === selectedCombination
            )
            .sort((a, b) => {
              // First, compare by last_name
              if (a.last_name < b.last_name) return -1;
              if (a.last_name > b.last_name) return 1;
              // If last_name is the same, compare by first_name
              if (a.first_name < b.first_name) return -1;
              if (a.first_name > b.first_name) return 1;
              return 0; // If both last_name and first_name are the same
            })
            .map(student => {
              // If there are no attendances, simply return the student object as is
              if (!attendances || attendances.length === 0) {
                return student; // No matching attendance
              }
      
              // Find the matching attendance entry
              const matchingAttendance = attendances.find(att => {
                // Extract the number from period and convert both to integers for comparison
                const periodNumber = parseInt(att.period, 10);
                const selectedPeriodNumber = parseInt(selectedPeriod.match(/\d+/)[0], 10);
                const dateMatches = att.date === selectedDate;
                const periodMatches = periodNumber === selectedPeriodNumber;
                const studentidMatches = att.studentid === student.studentid;
      
                // Return the result of the comparison
                return dateMatches && periodMatches && studentidMatches;
              });
      
              // If a matching attendance is found, add the att_id to the student object
              if (matchingAttendance) {
                return {
                  ...student,
                  att_id: matchingAttendance.id,
                  att_status: matchingAttendance.status
                };
              }
              // Return the student object without changes if no match is found
              return student;
            });
        } catch (error) {
          console.error("Error fetching attendances or processing students:", error);
          console.log(students)
          return students.filter(student => 
            student.eap_class === selectedCombination
          ) // Return students even if attendance fetching fails
          .sort((a, b) => {
            // Sorting by last_name and first_name
            if (a.last_name < b.last_name) return -1;
            if (a.last_name > b.last_name) return 1;
            if (a.first_name < b.first_name) return -1;
            if (a.first_name > b.first_name) return 1;
            return 0;
          });
        }
      };
      
    
    const getStudents = useCallback(async () => {
        if (!auth?.accessToken) return; // Ensure accessToken exists
        try {
            const response = await axios.get(`${baseUrl}/eap/`, {
                headers: {
                    "Authorization": `Bearer ${String(auth.accessToken)}`,
                },
                withCredentials: true,
            });
            
            const currentStudents = response.data; //.filter(student => student.eay > currentYear);
            setStudents(currentStudents);
            const uniqueClasses = [...new Set(currentStudents.map(student => student.eap_class))];
            setCombinations(uniqueClasses)
        } catch (err) {
            console.error(err);
            // navigate('/error');
        }
    }, [auth]); // Add auth and currentYear as dependencies since they're used inside the function
    
    const getAttendances = useCallback(async () => {
        if (!auth?.accessToken) return; // Ensure accessToken exists
        try {
            const response = await axios.get(`${baseUrl}/eap-attendance/`, {
                headers: {
                    "Authorization": `Bearer ${String(auth.accessToken)}`,
                },
                withCredentials: true,
            });
            
            // Return the data
            return response.data;
            
        } catch (err) {
            console.error(err);
            // Optionally, navigate to an error page
            // navigate('/error');
            return null; // Return null or handle error cases
        }
    }, [auth]); // Add necessary dependencies used in this function
    
    useEffect(() => {
        getStudents();
    }, [getStudents]); // Add the functions as dependencies
    
    
    
    const save_attendance = async (student_id) => {
        try {
            await axios.post(baseUrl + '/eap-attendance/', {
                "period": parseInt(selectedPeriod.match(/\d+/)[0], 10),
                "date": selectedDate,
                "status": 'absent',
                "eap_student": student_id,
                "staff": auth.user.id
            }, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'application/json'
                }
            });
    
            // After saving, fetch the updated list of students
            const updatedStudents = await getStudentsForCombination(
                selectedCombination,
                selectedDate,
                selectedPeriod
            );
    
            setFilteredStudents(updatedStudents);
        } catch (error) {
            console.log(error.response.data);
        }
    };
    
    const save_lateness = async (att_id,student_id) => {
        try {
            // Make the UPDATE request
            await axios.put(baseUrl + '/eap-attendance/'+att_id+"/", {
                "period": parseInt(selectedPeriod.match(/\d+/)[0], 10),
                "date": selectedDate,
                "status": 'absent',
                "eap_student": student_id,
                "staff": auth.user.id
            }, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'application/json'
                }
            });
    
            // Fetch the updated list of students after deletion
            const updatedStudents = await getStudentsForCombination(
                selectedCombination,
                selectedDate,
                selectedPeriod
            );
    
            // Update the state with the filtered students
            setFilteredStudents(updatedStudents);
            closePopup(); // Close popup after confirming
        } catch (error) {
            console.log(error.response.data);
        }
    };
    
    const confirmDelete = async (att_id) => {
        try {
            // Make the DELETE request
            await axios.delete(`${baseUrl}/eap-attendance/${att_id}/`, {
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'application/json'
                }
            });
    
            // Fetch the updated list of students after deletion
            const updatedStudents = await getStudentsForCombination(
                selectedCombination,
                selectedDate,
                selectedPeriod
            );
    
            // Update the state with the filtered students
            setFilteredStudents(updatedStudents);
            closePopup(); // Close popup after confirming
        } catch (error) {
            console.log(error.response.data);
        }
    };
    
    const handlePeriodSelect = async (e) => {
        const selectedPeriodValue = e.target.value;
        setSelectedPeriod(selectedPeriodValue);
    
        try {
            // Fetch the filtered students asynchronously
            const filteredStudents = await getStudentsForCombination(
                selectedCombination,
                selectedDate,
                selectedPeriodValue
            );
    
            // Set the filtered students in state
            setFilteredStudents(filteredStudents);
        } catch (error) {
            console.error("Error fetching filtered students:", error);
            // Optionally, handle errors by displaying a message or taking some other action
        }
    };
    
    
    const handleDateSelect = async (e) => {
        const selectedDateValue = e.target.value;
        setSelectedDate(selectedDateValue);
    
        try {
            // Fetch the filtered students asynchronously
            const filteredStudents = await getStudentsForCombination(
                selectedCombination,
                selectedDateValue,
                selectedPeriod
            );
    
            // Set the filtered students in state
            setFilteredStudents(filteredStudents);
        } catch (error) {
            console.error("Error fetching filtered students:", error);
            // Optionally, handle errors by displaying a message or taking some other action
        }
    };
    
        const buttonStyles = {
            input: {
                padding: '5px',
                fontSize: '14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '10px',
                width: '200px',
              }
            }
            console.log(filteredStudents)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <label htmlFor="period-select">Select Period:</label>
                <select style={buttonStyles.input} id="period-select" onChange={handlePeriodSelect} value={selectedPeriod}>
                    <option value="">--Select Period--</option>
                    {periods.map((period, index) => (
                        <option key={index} value={period}>{period}</option>
                    ))}
                </select>

                <br /><br />

                <label htmlFor="date-input">Select Date:</label>
                <input 
                    style={buttonStyles.input}
                    type="date" 
                    id="date-input" 
                    onChange={handleDateSelect} 
                    value={selectedDate} 
                />
                

                {/* Show Combination dropdown only when Grade is selected */}
                {selectedPeriod && selectedDate && (
                    <>
                        <label htmlFor="combination-select">Combination:</label>
                        <select style={buttonStyles.input} id="combination-select" onChange={handleCombinationChange} value={selectedCombination}>
                            <option value="">Select a class</option>
                            {combinations.map((combination, index) => (
                                <option key={index} value={combination}>{combination}</option>
                            ))}
                        </select>
                    </>
                )}

                {/* Show matching students when both Grade and Combination are selected */}
                {selectedCombination && (
                    <>
                        <h2>Click on Absenteeism</h2>
                        <ol style={{ 
                            listStylePosition: 'inside', 
                            paddingLeft: '0', 
                            textAlign: 'left', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '20px' 
                        }}>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <li 
                                        key={index} 
                                        style={{
                                            border: '2px solid #d8b040',  // Uniform border color
                                            padding: '5px',
                                            width: '20%',  // Ensures three items per row
                                            boxSizing: 'border-box',
                                            textAlign: 'center',
                                            borderRadius: '5px',
                                            marginBottom: '10px',
                                            backgroundColor: student.att_id !== undefined ? student.att_status === 'absent' ? '#f49c46' : student.att_status === 'late' ?'#957967' : '#498160': '#498160',  // Conditional background colors
                                            color: '#fff',  // Text color for visibility
                                            fontSize: '20px',  // Base font size
                                            cursor: 'pointer',  // Pointer cursor for clickable items
                                        }}
                                        onClick={() => student.att_id !== undefined ? student.att_status === 'absent' ? save_lateness(student.att_id, student.id) :student.att_status === 'late' ? handleDeleteClick(student.last_name, student.first_name, student.att_id) :student.att_status === 'present' ? save_attendance(student.id):save_attendance(student.id):save_attendance(student.id)}
                                    >
                                        {index + 1}. {student.last_name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')} {student.first_name.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')}
                                        <br/>
                                        {student.att_id !== undefined ? (
                                            <span style={{ fontSize: '14px' }}>  {/* Smaller font size for status */}
                                                {student.att_status === 'absent' ? "Absent" : "Late"}
                                            </span>
                                        ) : ""}
                                    </li>

                                ))
                            ) : (
                                <p>No students found for this combination.</p>
                            )}

                        </ol>


                    </>
                )}
            </div>
            {showPopup && (
                <div className="popup">
                <div className="popup-content">
                    <h2>Confirm Deletion</h2>
                    <p>
                    Are you Sure you Want to Delete Absenteeism of:{" "}
                    <span id="attId">{l} {f} on {selectedDate}, Period {selectedPeriod}</span>?
                    </p>
                    <div className="popup-buttons">
                    <button className="cancel-btn" onClick={closePopup}>
                        Cancel
                    </button>
                    <button className="confirm-btn" onClick={()=>confirmDelete(deleteId)}>
                        Delete
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
  )
}
