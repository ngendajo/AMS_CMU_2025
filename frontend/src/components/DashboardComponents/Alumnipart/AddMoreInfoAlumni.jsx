
import React, {useState} from 'react';
import '../../Header/header.css';
import '../../Header/searchBar.css';
import '../../Header/searchResultsList.css';
import '../Staffpart/staff.css';
import '../Alumnipart/alumni.css';
import { Link } from 'react-router-dom';


export default function Alumni() {
  const [category, setCategory] = useState(1);


  return (
    <div>
        <div className='alumni-list-heading'>

        <div className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <span>ASYV Info</span>
          </div>
         
          <div className={category===1? "displayed":"notdisplayed"} onClick={()=>setCategory(1)}>
            <span>Higher Institutions</span>
          </div>

          <div className={category===2? "displayed":"notdisplayed"} onClick={()=>setCategory(2)}>
            <span>Employed</span>
          </div>

          <div className={category===3? "displayed":"notdisplayed"} onClick={()=>setCategory(3)}>
            <span>Scholarship</span>
          </div>

          <div className={category===4? "displayed":"notdisplayed"} onClick={()=>setCategory(4)}>
            <span>Dropout</span>
          </div>

          <div className={category===5? "displayed":"notdisplayed"} onClick={()=>setCategory(5)}>
            <Link className='grades-link' to="/grades">Grades</Link>
          </div>

        </div>
        <div className='alumni-list-body'>
            <h1>Alumni Info</h1>
      </div>
        
    </div>
  )
}

