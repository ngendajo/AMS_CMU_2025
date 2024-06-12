
//import '../../Header/header.css';
//import '../../Header/searchBar.css';
//simport '../../Header/searchResultsList.css';
//import '../Staffpart/staff.css';
//import '../Alumnipart/alumni.css';
import { Link, Outlet } from 'react-router-dom';


export default function Alumni() {
  
  return (
    <div>
        <div className='alumni-list-heading'>
        <div className="notdisplayed">
            <span>Add more information</span>
          </div>
          <div className="displayed">
            <Link className='grades-link' to="/alumni">Go Back</Link>
          </div>

        </div>
        <div className='alumni-data-body'>
         <Outlet/>
        </div>
        
    </div>
  )
}

