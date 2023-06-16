import React, {useState} from 'react';
import '../../components/Header/header.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import '../../components/DashboardComponents/Staffpart/staff.css';
import '../../components/DashboardComponents/Alumnipart/alumni.css';
import { Link } from 'react-router-dom';

import { Outlet } from 'react-router-dom';


export default function Alumni() {
  const [category, setCategory] = useState(7);

  return (
    <div>
        <div className='alumni-list-heading'>

        <Link to={"/alumni/"} className={category===7? "displayed":"notdisplayed"} onClick={()=>setCategory(7)}>
            <span>ASYV Info</span>
          </Link>
         
          <div className={category===1? "displayed":"notdisplayed"} onClick={()=>setCategory(1)}>
            <span>Higher Institutions</span>
          </div>

          <Link to={"/alumni/employment/"} className={category===2? "displayed":"notdisplayed"} onClick={()=>setCategory(2)}>
            <span>Employed</span>
          </Link>

          <div className={category===3? "displayed":"notdisplayed"} onClick={()=>setCategory(3)}>
            <span>Scholarship</span>
          </div>

          <div className={category===4? "displayed":"notdisplayed"} onClick={()=>setCategory(4)}>
            <span>Dropout</span>
          </div>

          <Link to="/alumni/grades" className={category===5? "displayed":"notdisplayed"} onClick={()=>setCategory(5)}>
            <span>Grades</span>
          </Link>

          <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <Link className='grades-link' to="/combinations">Combinations</Link>
          </div>
          <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <Link className='grades-link' to="/eps">Eps</Link>
          </div>

        </div>
        <Outlet/>
        
    </div>
  )
}
