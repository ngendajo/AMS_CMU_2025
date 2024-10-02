import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import baseUrl from '../../api/baseUrl';

export default function Newattendace() {
    const [grades, setGrades] = useState([]);
    const [combinations, setCombinations] = useState([]);
    const [periods] = useState(['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5', 'Period 6', 'Period 7']);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCombination, setSelectedCombination] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    let {auth} = useAuth();

    
    useEffect(() => {
        const getGrades = async () =>{
            try{
                const response = await axios.get(baseUrl+'/grades/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setGrades(getValidGrades(response.data));
                //console.log(response.data)
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
        const getCombinations = async () =>{
            try{
                const response = await axios.get(baseUrl+'/combination/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                var combinationlist=[]
                response.data.forEach(e=>{
                    combinationlist.push({
                    id:e.id,
                    combination_name:e.combination_name
                })
                })
                setCombinations(combinationlist);
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
        const getStudents = async () =>{
            try{
                const response = await axios.get(baseUrl+'/students/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setStudents(response.data);
                console.log(getUniqueGradeCombinations(response.data))
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
        const getAttendances = async () =>{
            try{
                const response = await axios.get(baseUrl+'/attendances/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setAttendances(response.data);
                //console.log(response.data)
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
        getGrades();
        getCombinations();
        getStudents();
        getAttendances();
    }, [auth]);

    const getValidGrades = (grades) => {
        const currentYear = new Date().getFullYear();
        return grades
            .filter(grade => parseInt(grade.end_academic_year) > currentYear)
            .sort((a, b) => parseInt(a.end_academic_year) - parseInt(b.end_academic_year))
            .map(grade => ({
                id: grade.id,            // Include the ID
                grade_name: grade.grade_name // Include the grade name
            }));
    };

    const handleGradeSelect = (e) => {
        setSelectedGrade(e.target.value);
        updateStudents();
    };

    const handleCombinationSelect = (e) => {
        setSelectedCombination(e.target.value);
        updateStudents();
    };

    const handlePeriodSelect = (e) => {
        setSelectedPeriod(e.target.value);
        updateStudents();
    };

    const handleDateSelect = (e) => {
        setSelectedDate(e.target.value);
        updateStudents();
    };

    const updateStudents = () => {
        const filteredStudents = students.filter(student => 
            parseInt(student.grade_id) === parseInt(selectedGrade) && parseInt(student.combination_id) === parseInt(selectedCombination)
        );
        console.log(selectedGrade+" "+selectedCombination)
        console.log(students)
        // Sort students by last name and first name
        const sortedStudents = filteredStudents.sort((a, b) => {
            if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) return -1;
            if (a.last_name.toLowerCase() > b.last_name.toLowerCase()) return 1;
            return a.first_name.toLowerCase() < b.first_name.toLowerCase() ? -1 : 1;
        });

        setFilteredStudents(sortedStudents);
    };
    // Function to extract unique grade-combination pairs with ids
const getUniqueGradeCombinations = (data) => {
    const uniquePairs = [];
  
    data.forEach((student) => {
      const exists = uniquePairs.some(
        (pair) =>
          pair.grade_id === student.grade_id &&
          pair.combination_id === student.combination_id
      );
  
      if (!exists) {
        uniquePairs.push({
          grade_name: student.grade_name,
          grade_id: student.grade_id,
          combination_name: student.combination_name,
          combination_id: student.combination_id
        });
      }
    });
  
    return uniquePairs;
  };
    return (
        <div>
            <label htmlFor="grade-select">Select Grade:</label>
            <select id="grade-select" onChange={handleGradeSelect} value={selectedGrade}>
                <option value="">--Select Grade--</option>
                {grades.map((grade, index) => (
                    <option key={index} value={grade["id"]}>{grade["grade_name"]}</option>
                ))}
            </select>

            <label htmlFor="combination-select">Select Combination:</label>
            <select id="combination-select" onChange={handleCombinationSelect} value={selectedCombination}>
                <option value="">--Select Combination--</option>
                {combinations.map((combination, index) => (
                    <option key={index} value={combination["id"]}>{combination["combination_name"]}</option>
                ))}
            </select>

            <label htmlFor="period-select">Select Period:</label>
            <select id="period-select" onChange={handlePeriodSelect} value={selectedPeriod}>
                <option value="">--Select Period--</option>
                {periods.map((period, index) => (
                    <option key={index} value={period}>{period}</option>
                ))}
            </select>

            <label htmlFor="date-input">Select Date:</label>
            <input 
                type="date" 
                id="date-input" 
                onChange={handleDateSelect} 
                value={selectedDate} 
            />

            <ul>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                        <li key={student.studentid}>
                            {index + 1}. {student.first_name} {student.last_name}
                        </li>
                    ))
                ) : (
                    <li>No students found.</li>
                )}
            </ul>
        </div>
    );
};
