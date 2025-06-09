import React from 'react';
import './PersonalProfile.css';
import ProfileCard from '../../components/profile/profile-card';
import { Link } from 'react-router-dom';
import '../../App.css';

const Profile = () => {
    return (
      <div className="ProfileWrapper">
        <ProfileCard />
        <Link to="/personal_profile-resume" className="toResume">Generate Resume &gt;</Link>
      </div>
    );
  };
  
export default Profile;