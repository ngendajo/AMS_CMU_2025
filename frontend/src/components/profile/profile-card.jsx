import React, { useState, useEffect, useMemo } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './profile-card.css';
const safeValue = (val) => {
  if (val === null || val === undefined || val === "") return "Not Found";
  return val;
};
const ProfileCardSection = ({
  title,
  children,
  isEditing,
  onToggleEdit,
  onCancelEdit,
  canEdit = true,
  onAddRow
}) => (
  <div className={`profile-whitecard ${isEditing ? 'edit-mode' : ''}`}>
    <h2 className="profile-section-title">{title}</h2>
    <div className="scroll-wrapper">{children}</div>
    {canEdit && (
      <div className="profile-button-group">
        {isEditing && onAddRow && (
          <button className={title.includes("Academic") ? "addStudy" : "addJob"} onClick={onAddRow}>Add New</button>
        )}
        {isEditing && (
          <button className="cancel" onClick={onCancelEdit}>Cancel</button>
        )}
        <button className="change" onClick={onToggleEdit}>{isEditing ? "Done" : "Edit"}</button>
      </div>
    )}
  </div>
);
const ProfileCard = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState([]);
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [user_id, setUser_id] = useState();
  const [kid_id, setKid_id] = useState();
  const [editState, setEditState] = useState({ current: false, academic: false, employment: false });
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(baseUrl + '/kid/' + auth.user.id, {
          headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
          withCredentials: true
        });
        setUser_id(auth.user.id);
        setUser([response.data]);
        setKid_id(response.data.basic_information.kid_id);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [auth]);
  const sortStudyLevel = (studies) => {
    const levelOrder = { C: 1, A1: 2, A0: 3, M: 4, PHD: 5 };
    return studies.sort((a, b) => {
      const levelComparison = levelOrder[a.level] - levelOrder[b.level];
      return levelComparison !== 0 ? levelComparison : a.degree.localeCompare(b.degree);
    });
  };
  useEffect(() => {
    const getStudy = async () => {
      try {
        const response = await axios.get(`${baseUrl}/alumni-academic/?id=${user_id}`, {
          headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
          withCredentials: true
        });
        const studies = response.data.map(element => ({
          level: element.level,
          degree: element.degree,
          university: element.college,
          country: element.location,
          scholarship: element.scholarship,
          scholarship_details: element.scholarship_details,
          status: element.status
        }));
        setStudy(sortStudyLevel(studies));
      } catch (err) {
        console.log(err);
      }
    };
    if (user_id) getStudy();
  }, [auth, user_id]);
  const sortJobDate = (jobs) => {
    return jobs.sort((a, b) => {
      if (a.end_date !== b.end_date) {
        if (a.end_date === "") return 1;
        if (b.end_date === "") return -1;
        return new Date(a.end_date) - new Date(b.end_date);
      }
      return new Date(a.start_date) - new Date(b.start_date);
    });
  };
  useEffect(() => {
    const getEmployment = async () => {
      try {
        const response = await axios.get(`${baseUrl}/alumni-employment/?id=${user_id}`, {
          headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
          withCredentials: true
        });
        const jobs = response.data.map(element => ({
          title: element.title,
          status: element.status,
          company: element.company,
          career: element.industry,
          start_date: element.start_date,
          end_date: element.end_date,
          on_going: element.end_date === ""
        }));
        setEmployment(sortJobDate(jobs));
      } catch (err) {
        console.log(err);
      }
    };
    if (user_id) getEmployment();
  }, [auth, user_id]);
  const renderSection = (data, fields, editing = false) => (
    <>
      <div className="profile-table desktop-only">
        <table className="fixed-table">
          <thead>
            <tr>{fields.map((f, i) => <th key={i}>{f.label}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {fields.map((f, j) => {
                  const val = typeof f.value === 'function' ? f.value(item) : item[f.value];
                  return <td key={j}>{editing ? <input type="text" defaultValue={safeValue(val)} style={{ width: "100%" }} /> : safeValue(val)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="profile-fields mobile-only">
        {data.map((item, i) => (
          <div key={i} className="entry-block">
            {fields.map((f, j) => {
              const val = typeof f.value === 'function' ? f.value(item) : item[f.value];
              return <div key={j} className="field"><span>{f.label}:</span>{editing ? <input type="text" defaultValue={safeValue(val)} style={{ width: "100%" }} /> : safeValue(val)}</div>;
            })}
          </div>
        ))}
      </div>
    </>
  );
  const personalFields = user.length > 0 ? [
    { label: 'First Name', value: u => u.basic_information?.first_name },
    { label: 'Rwandan Name', value: u => u.basic_information?.rwandan_name },
    { label: 'Gender', value: u => u.basic_information?.gender },
    { label: 'Date of Birth', value: u => u.basic_information?.date_of_birth },
    { label: 'Place of Birth', value: u => `${u.place_of_birth?.origin_district}, ${u.place_of_birth?.origin_sector}` }
  ] : [];
  const currentInfoFields = user.length > 0 ? [
    { label: 'Marital Status', value: u => u.personal_status?.marital_status },
    { label: 'Children', value: u => u.personal_status?.has_children ? 'Yes' : 'No' },
    { label: 'City', value: u => u.current_address?.current_district_or_city },
    { label: 'Country', value: u => u.current_address?.current_county }
  ] : [];
  const asyvIdentityFields = [
    { label: 'Grade', value: u => u.affiliation?.grade_info?.grade_name },
    { label: 'Family', value: u => u.affiliation?.family_name },
    { label: 'Combination', value: u => u.academic_combinations?.slice(-1)[0]?.combination_name }
  ];
  const asyvAcademicFields = [
    { label: 'S4 Grade', value: u => u.kid?.s4marks + '%' },
    { label: 'S5 Grade', value: u => u.kid?.s5marks + '%' },
    { label: 'S6 Grade', value: u => u.kid?.s6marks + '%' },
    { label: 'National Exam Score', value: u => `${u.national_exam_results?.points_achieved}/${u.national_exam_results?.maximum_points} (${u.national_exam_results?.mention})` }
  ];
  const leapProgramFields = [
    { label: 'Leap Program', value: u => u.leap_activities?.map((a, i) => `${i + 1}. ${a.leap_name}`).join(" | ") || 'Not Found' }
  ];
  const academicFields = [
    { label: 'Level', value: 'level' },
    { label: 'Degree', value: 'degree' },
    { label: 'University', value: 'university' },
    { label: 'Country', value: 'country' },
    { label: 'Status', value: 'status' }
  ];
  const employmentFields = [
    { label: 'Title', value: 'title' },
    { label: 'Company', value: 'company' },
    { label: 'Career', value: 'career' },
    { label: 'Start Date', value: 'start_date' },
    { label: 'End Date', value: e => e.on_going ? "Ongoing" : e.end_date }
  ];
  return (
    <div className="profile-container vertical-cards">
      <ProfileCardSection title="Personal Info" canEdit={false}>
        {renderSection(user, personalFields)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Current Info"
        isEditing={editState.current}
        onToggleEdit={() => setEditState(prev => ({ ...prev, current: !prev.current }))}
        onCancelEdit={() => setEditState(prev => ({ ...prev, current: false }))}
      >
        {renderSection(user, currentInfoFields, editState.current)}
      </ProfileCardSection>
      <ProfileCardSection title="ASYV Info" canEdit={false}>
        {renderSection(user, asyvIdentityFields)}
        {renderSection(user, asyvAcademicFields)}
        {renderSection(user, leapProgramFields)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Academic Info"
        isEditing={editState.academic}
        onToggleEdit={() => setEditState(prev => ({ ...prev, academic: !prev.academic }))}
        onCancelEdit={() => setEditState(prev => ({ ...prev, academic: false }))}
        onAddRow={() => setStudy(prev => [...prev, {}])}
      >
        {renderSection(study, academicFields, editState.academic)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Employment Info"
        isEditing={editState.employment}
        onToggleEdit={() => setEditState(prev => ({ ...prev, employment: !prev.employment }))}
        onCancelEdit={() => setEditState(prev => ({ ...prev, employment: false }))}
        onAddRow={() => setEmployment(prev => [...prev, {}])}
      >
        {renderSection(employment, employmentFields, editState.employment)}
      </ProfileCardSection>
    </div>
  );
};
export default ProfileCard;