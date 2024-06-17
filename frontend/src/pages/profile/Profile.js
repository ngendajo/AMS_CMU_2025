import Sidebar from '../dashboard/Sidebar';
import DashboardHeader from '../dashboard/Dashboard-header';
import ProfileCard from '../../components/ProfileCard';
import './Profile.css';
import '../../App.css';

const Profile = () => {
    return (
      <div className='profile'>
     
        <DashboardHeader />
    
      <Sidebar />
      <div className="profile-section">
        <ProfileCard />
      </div>
      </div>
    );
  };
  
  export default Profile;