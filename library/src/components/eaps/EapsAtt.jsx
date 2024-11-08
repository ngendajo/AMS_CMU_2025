import React, {useState, useEffect,useCallback} from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import baseUrl from '../../api/baseUrl';
import DynamicTable from "../pages/dinamicTable/DynamicTable";

export default function EapsAtt() {
    const [selectedCombination, setSelectedCombination] = useState('');
    const [combinations, setCombinations] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    let {auth} = useAuth();
    const currentDate = new Date();
    const initialDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const colorPalette = ["#6d5736", "#498160", "#957967", "#d8b040", "#f49c46"];

    const handleCombinationChange = async (comb) => {
            const combination = comb;
            setSelectedCombination(combination);
            
            if (combination && students.length > 0) {
                try {
                    // Wait for the filtered students asynchronously
                    const filteredStudents = await getStudentsForCombination(
                        combination,
                        selectedDate
                    );
        
                    // Set the filtered students state after data is fetched
                    setFilteredStudents(filteredStudents);
                } catch (error) {
                    console.error("Error fetching filtered students:", error);
                    // Optionally, handle errors by displaying a message or taking some other action
                }
            }
        };
        const getStudentsForCombination = async (selectedCombination, selectedDate) => {
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
                    const dateMatches = att.date === selectedDate;
                    const studentidMatches = att.studentid === student.studentid;
        
                    // Return the result of the comparison
                    return dateMatches &&  studentidMatches;
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
                    selectedDate
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
                    selectedDate
                );
        
                // Update the state with the filtered students
                setFilteredStudents(updatedStudents);
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
                    selectedDate
                );
        
                // Update the state with the filtered students
                setFilteredStudents(updatedStudents);
            } catch (error) {
                console.log(error.response.data);
            }
        };
    
        const handleDateSelect = async (e) => {
            const selectedDateValue = e.target.value;
            setSelectedDate(selectedDateValue);
            if(selectedCombination){
                try {
                    // Fetch the filtered students asynchronously
                    const filteredStudents = await getStudentsForCombination(
                        selectedCombination,
                        selectedDateValue,
                    );
            
                    // Set the filtered students in state
                    setFilteredStudents(filteredStudents);
                } catch (error) {
                    console.error("Error fetching filtered students:", error);
                    // Optionally, handle errors by displaying a message or taking some other action
                }
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
            function removestudent(){
                setFilteredStudents([])
                setSelectedCombination("")
              }
              const handleAttendanceChange = async (status, id) => {
                console.log(status,id)
              }
    console.log(combinations,students,selectedCombination,selectedDate,filteredStudents)
  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
        
                <label htmlFor="date-input">Select Date:</label>
                <input 
                    style={buttonStyles.input}
                    type="date" 
                    id="date-input" 
                    onChange={handleDateSelect} 
                    value={selectedDate} 
                />
                <h2>Take attendance on {selectedDate}</h2>
        </div>
    </div>
    <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',          // Allow items to wrap
            justifyContent: 'center',  // Center the items
            gap: '10px',               // Add spacing between items
            padding: '20px',
          }}
        >
            {filteredStudents.length>0?
            <div>
                <button
                    style={{ 
                      padding: '10px 20px',
                      margin: '5px',
                      border: 'none',
                      borderRadius: '5px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '16px',
                      backgroundColor: '#002F6C',
                     }}
                    onClick={removestudent}  // Call filterToday on button click
                >
                    Back
                </button>
              <h2>Attendance for Class{selectedCombination}</h2>
              <DynamicTable 
                  mockdata={filteredStudents.map(({ id, last_name, first_name, school, att_status}, index) => ({
                      No: index + 1, // Adding numbering
                      Name:last_name+" "+first_name,
                      School:school,
                      Present: (
                          <input 
                              type="radio" 
                              name={`attendance-${index}`} 
                              checked={att_status === "present"|| att_status === null}
                              onChange={() => handleAttendanceChange("present",id)} 
                          />
                      ),
                      Absent: (
                          <input 
                              type="radio" 
                              name={`attendance-${index}`} 
                              checked={att_status === "absent"}
                              onChange={() => handleAttendanceChange("absent", id)} 
                          />
                      ),
                      Late: (
                          <input 
                              type="radio" 
                              name={`attendance-${index}`} 
                              checked={att_status === "late"}
                              onChange={() => handleAttendanceChange("late", id)} 
                          />
                      ),
                  }))} 
              />
            </div>:
            combinations.map((comb, index) => {
              
              return (
                <div
                key={index}
                onClick={() =>  handleCombinationChange(comb)} // Prevent click if action is "wait"
                style={{
                    backgroundColor: colorPalette[index % colorPalette.length],  // Cycle through colors
                    color: '#fff', // Change text color to gray when "wait"
                    padding: '15px',
                    borderRadius: '8px',
                    width: '200px',                    // Fixed width for items
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',           // Stack contents vertically
                    alignItems: 'center',              // Center-align content
                    textAlign: 'center',
                    cursor: "pointer", // Change cursor style based on action
                }}
                >
                  <h2 style={{ margin: '5px 0' }}>{comb}</h2>
                  
                </div>
              );
            })
          }
        </div>
</div>
  )
}
