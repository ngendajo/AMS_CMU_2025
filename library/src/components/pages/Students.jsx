import React, {useState, useEffect} from 'react'
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiEditAlt } from "react-icons/bi";
import baseUrl from "../../api/baseUrl";
import DynamicTable from "./dinamicTable/DynamicTable";
import { IoEye } from "react-icons/io5";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Students() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingpdf, setLoadingpdf] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
    let {auth} = useAuth();

      useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(baseUrl + '/students/', {
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials: true
                });
    
                var studentlist = [];
                var i = 1;
                setLoading(false);
                console.log(response.data)
                response.data.forEach(student => {
                    studentlist.push({
                        No: i,
                        Names: student.last_name + " " + student.first_name,
                        Reg_No: student.studentid,
                        Email: student.email,
                        Grade: student.grade_name,
                        Family: student.family_name,
                        Combination: student.combination_name,
                        Edit: <span>
                            <Link to={`/student/${student.id}`}><BiEditAlt className='icon' /></Link>
                        </span>,
                        Books: <Popup
                            trigger={<button><IoEye /></button>}
                            position="left center"
                        >
                            <div>GeeksforGeeks</div>
                            <button>Click here</button>
                        </Popup>
                    });
                    i = i + 1;
                });
                setData(studentlist);
            } catch (err) {
                console.log(err);
                //navigate('/error');
            }
        };
    
        getData();
    }, [auth]);
    
    const studentReprtexcel = async () => {
        setLoadingpdf(true);
          const response = await fetch(`${baseUrl}/exportstudentexcel/`);
          const blob = await response.blob();
  
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'LFHS_students_data.xlsx');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoadingpdf(false);
        };
        
  return (
    <div>
     <center><h2 >List of Students <button className="prenext" onClick={studentReprtexcel} disabled={loadingpdf}>{loadingpdf ? 'Exporting...' : 'Export List of Students in Excel'}</button></h2></center> 
        {loading ? (
            <p>Loading...</p>
          ) : (
                <DynamicTable mockdata={data} /> 
          )
        }
    </div>
  )
}

