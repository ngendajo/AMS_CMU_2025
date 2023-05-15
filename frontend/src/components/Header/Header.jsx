import { useState } from 'react';
import images from '../../Static/Images/images.png'; 
import { AiOutlinePlusCircle,AiOutlineMessage } from "react-icons/ai";
import { IoIosNotificationsOutline,IoIosArrowDropdown } from "react-icons/io";
import { BsDot} from "react-icons/bs";
import  './header.css';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import useAuth from '../../hooks/useAuth';


export default function Header() {
    const [results, setResults]=useState([]);
    const { auth } = useAuth();
    const current = new Date();
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
        <div className='profile'>
        <img src={images} alt="logo" />
        <p><strong>{auth.user.first_name} {auth.user.last_name}</strong>
        <br/>{auth.user.is_superuser? "Admin":
        auth.user.is_crc? "CRC Staff":auth.user.alumni.grade.name
        }</p>
        <IoIosArrowDropdown className='profile-icon'/>
        </div>
    </div>
  )
}

