import React, { useState, useEffect } from 'react';
import { fetchTeacherCombinationGradeSubjects, deleteTeacherCombinationGradeSubject } from '../../services/teacherSubjectService';
import useAuth from "../../hooks/useAuth";

const TeacherSubjectList = () => {
    let {auth} = useAuth();
    const [teacherSubjects, setTeacherSubjects] = useState([]);

    useEffect(() => {
        fetchTeacherCombinationGradeSubjects(auth).then(response => setTeacherSubjects(response.data));
    },[auth]);

    const handleDelete = (id) => {
        deleteTeacherCombinationGradeSubject(auth,id)
            .then(() => {
                setTeacherSubjects(teacherSubjects.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div>
            <h2>Teacher Subject List</h2>
            <ul>
                {teacherSubjects.map(item => (
                    <li key={item.id}>
                        {item.teacher.first_name} {item.teacher.last_name} - {item.subject.subject_name} - {item.combination.combination_name} - {item.gradetimeslots.activity}
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherSubjectList;
