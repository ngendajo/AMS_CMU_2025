import { Link } from 'react-router-dom';
import { BiExport } from "react-icons/bi";
import {FaSearch} from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';

import Excel from 'exceljs';
import { saveAs } from 'file-saver';

const columns = [
  { header: 'No', key: 'id' },
  { header: 'Family', key: 'family_name' },
  { header: 'Grade', key: 'grade_name' },
  { header: 'Start Academic Year', key: 'start_academic_year' },
  { header: 'End Academic Year', key: 'end_academic_year' }
];
const workSheetName = 'Families_Report';
const workBookName = 'Families_Report';

export const Grades = () => {

  
  const [datatodownload, setDatatodownload] = useState([]);

    const [results, setResults]=useState([]);
    const [results1, setResults1]=useState([]);
    const [input, setInput] = useState("");
    const {auth} = useAuth();

    useEffect(() =>{
    
        const getGrades = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/grades/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                setResults1(response.data);
                setResults(response.data);
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getGrades();
    
    },[auth])
    useEffect(() =>{
    
      const getFamilies = async () =>{
          try{
              const response = await axios.get('http://127.0.0.1:8000/api/families/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setDatatodownload(response.data)
          }catch(err) {
              console.log(err);
          }
      }
  
      getFamilies();
  
  },[auth])

  const workbook = new Excel.Workbook();

  const saveExcel = async () => {
    try {
      const fileName = workBookName;

      // creating one worksheet in workbook
      const worksheet = workbook.addWorksheet(workSheetName);

      // add worksheet columns
      // each columns contains header and its mapping key from data
      worksheet.columns = columns;

      // updated the font for first row.
      worksheet.getRow(1).font = { bold: true };

      // loop through all of the columns and set the alignment with width.
      worksheet.columns.forEach(column => {
        column.width = column.header.length + 5;
        column.alignment = { horizontal: 'center' };
      });

      // loop through data and add each one to worksheet
      datatodownload.forEach(singleData => {
        worksheet.addRow(singleData);
      });

      // loop through all of the rows and set the outline style.
      worksheet.eachRow({ includeEmpty: false }, row => {
        // store each cell to currentCell
        const currentCell = row._cells;

        // loop through currentCell to apply border only for the non-empty cell of excel
        currentCell.forEach(singleCell => {
          // store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
          const cellAddress = singleCell._address;

          // apply border
          worksheet.getCell(cellAddress).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // write the content using writeBuffer
      const buf = await workbook.xlsx.writeBuffer();

      // download the processed file
      saveAs(new Blob([buf]), `${fileName}.xlsx`);
    } catch (error) {
      console.error('<<<ERRROR>>>', error);
      console.error('Something Went Wrong', error.message);
    } finally {
      // removing worksheet's instance to create new one
      workbook.removeWorksheet(workSheetName);
    }
  };


      const fetchDAta = (value) =>{
        if(results1.length>0){
          let results=results1.filter((grade) =>
          grade?.grade_name.toLowerCase().includes(value.toLowerCase()) || 
          grade?.start_academic_year.toLowerCase().includes(value.toLowerCase()) || 
          grade?.end_academic_year.toLowerCase().includes(value.toLowerCase())
        );
        setResults(results)
         }
          
        }
        const handleChange = (value) =>{
          setInput(value)
          fetchDAta(value)
      }
  
  return (
    <>
        <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
              <div className='input-wrapper search-staff'>
                <FaSearch id='search-icon'/>
                <input placeholder='search grade...' value={input} onChange={(e) =>handleChange(e.target.value)}/>
              </div>
                <div onClick={saveExcel} className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/add-grade" className='link'>Add Grade</Link><IoIosAdd className='addicon'/>
                </div>
              </div>
            </div>
            <div className='grades-list'>
            {results.length?
                    <>
                      {results.map((result, id)=>{
                        return <div className='grade-details' key={id}>
                    <Link className='view-grade-alumni' to={`/gradealumni/${result.id}`}>
                      <p>Grade: {result.grade_name}</p>
                      <p>Start Academic Year:{result.start_academic_year}</p>
                      <p>End Academic Year:{result.end_academic_year}</p>
                      <h3>Families</h3>
                    </Link>
                    <ol>
                        {result.families?.map((fa,i)=>{
                            return <Link className='view-family-alumni' to={`/familyalumni/${fa.id}`} key={i}> <li key={i}>{fa.family_name}
                                <ul className='family-detail'>
                                    <li>Mother:{fa.family_mother}</li>
                                    <li>Mother Tel:{fa.family_mother_tel}</li>
                                
                                </ul>
                            </li>
                            </Link>
                        })}
                        
                    </ol>
                    <Link className='edit-grade' to={`/add-grade/${result.id}`}>Update</Link>
                    </div>
                })}
                </>:<h1>No grade registered yet!</h1>
        }
            </div>
      </div>
    </>
  );
};
