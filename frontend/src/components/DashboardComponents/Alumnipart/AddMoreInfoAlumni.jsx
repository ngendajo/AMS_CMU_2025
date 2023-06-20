
import {useState} from "react";
import '../../Header/header.css';
import '../../Header/searchBar.css';
import '../../Header/searchResultsList.css';
import '../Staffpart/staff.css';
import '../Alumnipart/alumni.css';
import { Link, Outlet } from 'react-router-dom';
import { useParams } from 'react-router';


export default function Alumni() {
  const [category, setCategory] = useState(6);
  const params = useParams();
  
  return (
    <div>
        <div className='alumni-list-heading'>

        <Link to={`/add-alumni/info/${params.id}`} className={category===6? "displayed":"notdisplayed"} onClick={()=>setCategory(6)}>
            <span>ASYV Info</span>
          </Link>
         
          <Link to="#" className={category===1? "displayed":"notdisplayed"} onClick={()=>setCategory(1)}>
            <span>Higher Institutions</span>
          </Link>

          <Link to={`/add-alumni/info/${params.id}/addemployment`} className={category===2? "displayed":"notdisplayed"} onClick={()=>setCategory(2)}>
            <span>Employed</span>
          </Link>

          <div className={category===3? "displayed":"notdisplayed"} onClick={()=>setCategory(3)}>
            <span>Scholarship</span>
          </div>

          <div className={category===4? "displayed":"notdisplayed"} onClick={()=>setCategory(4)}>
            <span>Dropout</span>
          </div>

          <div className={category===5? "displayed":"notdisplayed"} onClick={()=>setCategory(5)}>
            <Link className='grades-link' to="/alumni">Go Back</Link>
          </div>

        </div>
        <div className='alumni-list-body form'>
         <Outlet/>
      </div>
        
    </div>
  )
}

