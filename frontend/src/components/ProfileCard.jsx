// src/components/ProfileCard/ProfileCard.jsx

import React, { useState } from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div>
            <h2>John Doe</h2>
            <p>Age: 30</p>
            <p>Location: New York, USA</p>
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
