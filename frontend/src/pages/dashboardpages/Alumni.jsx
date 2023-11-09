import React, {useState} from 'react';
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import '../../components/DashboardComponents/Alumnipart/alumni.css';
import { Link } from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


export default function Alumni() {
  const [category, setCategory] = useState(7);
  
  const {auth} = useAuth();

  return (
    <div>
      {auth.user.is_alumni? null:
        <div className='alumni-list-heading'>  {/* className属性设置为'alumni-list-heading'，它是一个用于样式设计的类名 */}

        <Link to={"/alumni/"} className={category===7? "displayed":"notdisplayed"} onClick={()=>setCategory(7)}>
            <span>Alumni Profile</span>
          </Link>
         
          <Link to={"/alumni/studie/"} className={category===1? "displayed":"notdisplayed"} onClick={()=>setCategory(1)}>
            <span>Education Attainment</span>
          </Link>

          <Link to={"/alumni/employment/"} className={category===2? "displayed":"notdisplayed"} onClick={()=>setCategory(2)}>
            <span>Employment Status</span>
          </Link>
          <Link to={"/alumni/story/"} className={category===9? "displayed":"notdisplayed"} onClick={()=>setCategory(9)}>
            <span>Stories</span>
          </Link>

          <Link to="/alumni/grades" className={category===5? "displayed":"notdisplayed"} onClick={()=>setCategory(5)}>
            <span>Grades</span>
          </Link>

          <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <Link className='grades-link' to="/alumni/combinations">Combinations</Link>
          </div>
          <div className={category===8? "displayed":"notdisplayed"} onClick={()=>setCategory(8)}>
            <Link className='grades-link' to="/alumni/eps">Eps</Link>
          </div>
          <div className={category===10? "displayed":"notdisplayed"} onClick={()=>setCategory(10)}>
            <Link className='grades-link' to="/alumni/bulkalumni">Bulk Alumni Registration</Link>
          </div>
          <div className={category===11? "displayed":"notdisplayed"} onClick={()=>setCategory(11)}>
            <Link className='grades-link' to="/alumni/bulkstadie">Bulk Studies Registration</Link>
          </div>

        </div>
        }
        <Outlet/>
        
    </div>
  )
}
