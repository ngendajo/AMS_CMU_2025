// src/components/ProfileCard/ProfileCard.jsx
import styled from 'styled-components';
import React, { useState } from 'react';
import './ProfileCard.css';
import Profile from '../static/images/profile.jpg';

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-left: 2px;
  
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 15px;
  margin-left: 15px;
  align: center;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileName = styled.span`
  font-family: Medium;
  font-size: 20px;
  color: var(--Black);
`;

const ProfileContact = styled.span`
  font-family: Light;
  color:var(--black);
  font-size: 12px;
`;

const ProfileEmail = styled.span`
  font-family: Light;
  color: var(--black);
  font-size: 14px;
`;

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const renderContent = () => {
   
    switch (activeTab) {
      case 'personal':
        return (
          
          <div>
             <ProfileSection>
    <ProfileImage src={Profile} alt="Profile" />
    <ProfileDetails>
      <ProfileName>John Doe</ProfileName>
      <ProfileEmail>johndoe@gmail.com</ProfileEmail>
      <ProfileContact>123-456-7890</ProfileContact>
    </ProfileDetails>
  </ProfileSection>
            <p>Gender</p>
            <p>Female</p>
            <p>Location</p>
            <p>New York, USA</p>
            {/* Add more personal details */}
          </div>
        );
      case 'employment':
        return (
          <div>
            <h2>Employment History</h2>
            <p>Company: ABC Corp</p>
            <p>Position: Software Engineer</p>
            <p>Years: 2015-2020</p>
            {/* Add more employment details */}
          </div>
        );
      case 'education':
        return (
          <div>
            <h2>Education</h2>
            <p>University: XYZ University</p>
            <p>Degree: B.Sc. Computer Science</p>
            <p>Year: 2011-2015</p>
            {/* Add more education details */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-card">
      <div className="tabs">
        <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>Personal</button>
        <button className={activeTab === 'employment' ? 'active' : ''} onClick={() => setActiveTab('employment')}>Employment</button>
        <button className={activeTab === 'education' ? 'active' : ''} onClick={() => setActiveTab('education')}>Education</button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfileCard;
