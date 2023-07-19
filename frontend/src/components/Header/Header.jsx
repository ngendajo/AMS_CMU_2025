import { useState, useEffect } from 'react';
import images from '../../Static/Images/images.png';
import { AiOutlinePlusCircle,AiOutlineMessage } from "react-icons/ai";
import { IoIosNotificationsOutline,IoIosArrowDropdown } from "react-icons/io";
import { BsDot} from "react-icons/bs";
import  './header.css';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import useAuth from '../../hooks/useAuth';
import {Link, useNavigate} from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import * as CiIcons from "react-icons/ci";
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';


export default function Header() {
    const [results, setResults]=useState([]);
    const [userid, setUserid]=useState([]);
    const [profile, setProfile] = useState(false);
    const { auth } = useAuth();
    const current = new Date();
    const showprofile = () => {
        setProfile(!profile);
      }


      useEffect(() =>{

        const getuser = async () =>{
            try{
                if(auth.user.is_alumni){
                    const response = await axios.get('http://127.0.0.1:8000/api/alumni/?id='+auth?.user.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUserid(response.data)
                }else
                {
                    const response = await axios.get('http://127.0.0.1:8000/api/staff/?id='+auth?.user.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setUserid(response.data)
                }
            }catch(err) {
                console.log(err);
            }
        }

        getuser();

    },[auth])
      const navigate = useNavigate();
      const logout = useLogout();

      const signOut = async () => {
          await logout();
          navigate('/home');
      }
    let daysArray = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = `${daysArray[current.getDay()]}, ${monthsArray[current.getMonth()]}, ${current.getDate()}, ${current.getFullYear()}`;
  return (
    <div className='header'>
        <div className='headerleft'>
            <img src={images} alt="logo" />
            <h4><span>A</span>LUMNA<br/><span>PLATFORM</span></h4>
        </div>
        <div className='todaydate'>
            <span>Today is {date}</span>
        </div>
        <div className='search-bar-container'>
          <SearchBar setResults={setResults}/>
          <SearchResultsList results={results}/>
        </div>
        <div className='postsmsnotific'>
            <div className='add-post'>
                <AiOutlinePlusCircle className='postsmsnotific-icon'/>
                <span>Post</span>
            </div>
            <div className='messages'>
                <BsDot className='messages-sign'/>
                <AiOutlineMessage className='messages-icon'/>
            </div>
            <div className='notifications'>
                <BsDot className='notifications-sign'/>
                <IoIosNotificationsOutline className='notifications-icon'/>
            </div>
        </div>
        <div onClick={showprofile}>
            <div className='profile'>
            {userid.map((result, id)=>{return <span key={id}> <img src={"http://localhost:8000"+result.image_url} alt="logo" /></span>})}

                <p><strong>{auth.user.first_name} {auth.user.last_name}</strong>
                <br/>{auth.user.is_superuser? "Admin":
                auth.user.is_crc? "CRC Staff":userid[0]?.alumn.family.grade.grade_name
                }</p>
                <IoIosArrowDropdown className='profile-icon' />
            </div>
            {profile ?
                auth.user.is_alumni?
                <div className='profile-logout'>
                    <Link to={`/alumniprofile/${auth.user.id}`} className='profile-logout-link'><CiIcons.CiUser /><span>Profile</span></Link>
                    <Link to="#" className='profile-logout-link' onClick={signOut}><BiLogOut/><span>Log Out</span></Link>
                </div>:
                    <div className='profile-logout'>
                    <Link to={`/staffprofile/${auth.user.id}`} className='profile-logout-link'><CiIcons.CiUser /><span>Profile</span></Link>
                    <Link to="#" className='profile-logout-link' onClick={signOut}><BiLogOut/><span>Log Out</span></Link>
                </div> 
                :null
            }
        </div>
    </div>
  )
}
