import React, { useState, useEffect } from 'react';
import { fetchTeacherCombinationGradeSubjects, deleteTeacherCombinationGradeSubject } from '../../services/teacherSubjectService';
import { fetchGradeTimeSlots } from '../../services/gradeTimeSlotsService';
import { fetchGrades } from '../../services/gradeService';

import useAuth from "../../hooks/useAuth";

const TeacherSubjectList = () => {
    let { auth } = useAuth();
    const [gradetimeslots, setgradetimeslots] = useState([]);
    const [grades, setGrades] = useState([]);
    const [teacherSubjects, setTeacherSubjects] = useState([]);

    useEffect(() => {
        fetchTeacherCombinationGradeSubjects(auth).then(response => setTeacherSubjects(response.data));
        fetchGradeTimeSlots(auth).then(response => setgradetimeslots(response.data));
        fetchGrades(auth).then(response => setGrades(response.data));
    }, [auth]);

    // Extract unique grade IDs from gradetimeslots
    const gradeIdsInTimeSlots = new Set(gradetimeslots.map(slot => slot.grade));

    // Filter grades based on the extracted IDs
    const filteredGrades = grades.filter(grade => gradeIdsInTimeSlots.has(grade.id));
    const sortedFilteredGrades = filteredGrades.sort((a, b) => {
        // Assuming end_academic_year is a date or a string in a sortable format
        if (a.end_academic_year < b.end_academic_year) return -1;
        if (a.end_academic_year > b.end_academic_year) return 1;
        return 0;
    });
    const handleDelete = (id) => {
        deleteTeacherCombinationGradeSubject(auth, id)
            .then(() => {
                setTeacherSubjects(teacherSubjects.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div>
            <h1>General School Timetable</h1>
           
                {sortedFilteredGrades.map(grade => {

                    return (
                        <>
                            <h2 key={grade.id}>
                                {grade.grade_name} 
                            </h2>
                        </>
                    );
                })}
            <ul>
                {teacherSubjects.map(item => {

                    return (
                        <li key={item.id}>
                            {item.teacher.first_name} {item.teacher.last_name} - {item.subject.subject_name} - {item.combination.combination_name} - {item.gradetimeslots.activity}
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TeacherSubjectList;
