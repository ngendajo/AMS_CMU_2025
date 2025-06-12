import React, { useState, useEffect } from 'react';
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
          <button
            className={title.includes("Academic") ? "addStudy" : "addJob"}
            onClick={onAddRow}
          >
            Add New
          </button>
        )}
        {isEditing && (
          <button className="cancel" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
        <button className="change" onClick={onToggleEdit}>
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>
    )}
  </div>
);

const ProfileCard = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState([]);
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [alumn_id, setAlumn_id] = useState();
  const [editState, setEditState] = useState({
    current: false,
    academic: false,
    employment: false,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/alumni/?id=${auth.user.id}`, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          withCredentials: true
        });
        setUser(res.data);
        setAlumn_id(res.data[0]?.alumn?.id);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [auth]);

  useEffect(() => {
    const fetchStudy = async () => {
      if (!alumn_id) return;
      try {
        const res = await axios.get(`${baseUrl}/studie/?alumn_id=${alumn_id}`, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          withCredentials: true
        });
        setStudy(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudy();
  }, [auth, alumn_id]);

  useEffect(() => {
    const fetchEmployment = async () => {
      if (!alumn_id) return;
      try {
        const res = await axios.get(`${baseUrl}/employment/?alumn_id=${alumn_id}`, {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          withCredentials: true
        });
        setEmployment(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployment();
  }, [auth, alumn_id]);

  const renderSection = (data, fields, editing = false) => (
    <>
      <div className="profile-table desktop-only">
        <table className="fixed-table">
          <thead>
            <tr>
              {fields.map((f, i) => <th key={i}>{f.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                {fields.map((f, j) => {
                  const val = typeof f.value === 'function' ? f.value(item) : item[f.value];
                  return (
                    <td key={j}>
                      {editing
                        ? <input type="text" defaultValue={safeValue(val)} style={{ width: "100%" }} />
                        : safeValue(val)}
                    </td>
                  );
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
              return (
                <div key={j} className="field">
                  <span>{f.label}:</span>
                  {editing
                    ? <input type="text" defaultValue={safeValue(val)} style={{ width: "100%" }} />
                    : safeValue(val)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );

  const personalFields = user.length > 0 ? [
    { label: 'First Name', value: u => u.first_name },
    { label: 'Last Name', value: u => u.last_name },
    { label: 'Gender', value: u => u.alumn.gender },
    { label: 'Date of Birth', value: u => u.alumn.date_of_birth },
    { label: 'Place of Birth', value: u => `${u.alumn.place_of_birth_district_or_country}, ${u.alumn.place_of_birth_sector_or_city}` }
  ] : [];

  const currentInfoFields = user.length > 0 ? [
    { label: 'Phone Number', value: u => u.alumn.phone_number },
    { label: 'Email', value: u => u.email },
    { label: 'City', value: u => u.alumn.current_city },
    { label: 'Country', value: u => u.alumn.current_country }
  ] : [];

  const asyvIdentityFields = [
    { label: 'Grade', value: u => u.alumn.grade?.grade_name },
    { label: 'Family', value: u => u.alumn.family?.family_name },
    { label: 'Combination', value: u => u.alumn.combination?.combination_name }
  ];

  const asyvAcademicFields = [
    { label: 'S4 Grade', value: u => u.alumn.s4_grade },
    { label: 'S5 Grade', value: u => u.alumn.s5_grade },
    { label: 'S6 Grade', value: u => u.alumn.s6_grade },
    { label: 'National Exam Score', value: u => u.alumn.national_exam_score }
  ];

  const leapPrograms = user.flatMap(u =>
    (u.alumn.leap_programs || []).length > 0
      ? u.alumn.leap_programs.map(program => ({ program }))
      : [{ program: null }]
  );

  const leapProgramFields = [
    { label: 'Leap Program', value: row => row.program || 'Not Found' }
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
        {renderSection(leapPrograms, leapProgramFields)}
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
