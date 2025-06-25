import React, { useState, useEffect } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './profile-card.css';

// ... other helper functions remain unchanged

const ProfileCard = ({ userId }) => {
  const { auth } = useAuth();
  const [user, setUser] = useState(null);
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({ /*...*/ });

  const resolvedUserId = userId || auth?.user?.id;
  const isOwnProfile = resolvedUserId === auth?.user?.id;

  const [editState, setEditState] = useState({ current: false, academic: false, employment: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, dropdownRes] = await Promise.all([
          axios.get(`${baseUrl}/kid/${resolvedUserId}`, {
            headers: { Authorization: 'Bearer ' + String(auth.accessToken) },
            withCredentials: true,
          }),
          axios.get(`${baseUrl}/options/all-dropdowns/`, {
            headers: { Authorization: 'Bearer ' + String(auth.accessToken) },
            withCredentials: true,
          })
        ]);
        setUser(userRes.data);
        setDropdownOptions(dropdownRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (resolvedUserId) fetchData();
  }, [auth, resolvedUserId]);

  useEffect(() => {
    if (!resolvedUserId) return;

    const getStudy = async () => {
      try {
        const response = await axios.get(`${baseUrl}/alumni-academic/?id=${resolvedUserId}`, {
          headers: { Authorization: 'Bearer ' + String(auth.accessToken) },
          withCredentials: true
        });
        setStudy(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getEmployment = async () => {
      try {
        const response = await axios.get(`${baseUrl}/alumni-employment/?id=${resolvedUserId}`, {
          headers: { Authorization: 'Bearer ' + String(auth.accessToken) },
          withCredentials: true
        });
        setEmployment(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getStudy();
    getEmployment();
  }, [auth, resolvedUserId]);

  // Add your renderSection logic and other helpers here

  return (
    <div className="profile-container vertical-cards">
      <ProfileCardSection title="Personal Info" canEdit={false}>
        {renderSection([user], (newArr) => setUser(newArr[0]), personalFields)}
      </ProfileCardSection>

      <ProfileCardSection
        title="Current Info"
        canEdit={isOwnProfile}
        isEditing={editState.current}
        onToggleEdit={() => {
          if (editState.current) saveCurrentInfo();
          setEditState(prev => ({ ...prev, current: !prev.current }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, current: false }))}
      >
        {renderSection([user], (newArr) => setUser(newArr[0]), currentInfoFields, editState.current)}
      </ProfileCardSection>

      <ProfileCardSection title="ASYV Info" canEdit={false}>
        {renderSection([user], (newArr) => setUser(newArr[0]), asyvIdentityFields)}
        {renderSection([user], (newArr) => setUser(newArr[0]), asyvAcademicFields)}
        {renderSection([user], (newArr) => setUser(newArr[0]), leapProgramFields)}
      </ProfileCardSection>

      <ProfileCardSection
        title="Academic Info"
        canEdit={isOwnProfile}
        isEditing={editState.academic}
        onToggleEdit={() => {
          if (editState.academic) saveStudyData();
          setEditState(prev => ({ ...prev, academic: !prev.academic }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, academic: false }))}
        onAddRow={() => setStudy(prev => [...prev, {}])}
      >
        {renderSection(study, setStudy, academicFields, editState.academic, false, true)}
      </ProfileCardSection>

      <ProfileCardSection
        title="Employment Info"
        canEdit={isOwnProfile}
        isEditing={editState.employment}
        onToggleEdit={() => {
          if (editState.employment) saveEmploymentData();
          setEditState(prev => ({ ...prev, employment: !prev.employment }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, employment: false }))}
        onAddRow={() => setEmployment(prev => [...prev, {}])}
      >
        {renderSection(employment, setEmployment, employmentFields, editState.employment, true, false)}
      </ProfileCardSection>
    </div>
  );
};

export default ProfileCard;
