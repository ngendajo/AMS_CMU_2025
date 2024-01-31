import useAuth from '../../../../hooks/useAuth';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import { EmplymentTable } from '../EmploymentTable';
//import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../../api/baseUrl';
import baseUrlforImg from '../../../../api/baseUrlforImg';

import DynamicTable from "./dinamicTable/DynamicTable";

import Excel from 'exceljs';
import { saveAs } from 'file-saver';

const columns = [
  { header: 'No', key: 'no' },
  { header: 'Email', key: 'email' },
  { header: 'Name', key: 'name' },
  { header: 'Phone number', key: 'phone' },
  { header: 'grade_name', key: 'grade_name' },
  { header: 'family_name', key: 'family_name' },
  { header: 'combination_name', key: 'combination_name' },
  { header: 'Title', key: 'title' },
  { header: 'Company', key: 'company' },
  { header: 'Career', key: 'career' },
  //{ header: 'Description', key: 'description' },
  { header: 'Status', key: 'status' }
  //{ header: 'Start Date', key: 'start_date' },
  //{ header: 'End Date', key: 'end' },
  
];
const workSheetName = 'Alumni_Study_Report';
const workBookName = 'Alumni_Study_Report';

export default function Employment() {
  const [data, setData] = useState([]);
  const [datatodownload, setDatatodownload] = useState([]);
  
  const {auth} = useAuth();

  //const navigate=useNavigate();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get(baseUrl+'/employment/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            var alumnilist=[]
            var alumnilist2=[]
            var i=1
            console.log(response.data)
            response.data.forEach(element => {
              alumnilist2.push({
                no:i, 
                email:element.email,
                name:element.first_name+" "+element.last_name,
                phone:element.phone1,
                gender:element.gender,
                grade_name:element.grade_name,
                family_name:element.family_name,
                combination_name:element.combination_name,
                title:element?.title,
                company:element?.company,
                //description:element?.description,
                status:element.status==="F"?"Full Time":element.status==="S"?"Self Empoyed":element.status==="P"?"Part Time":element.status==="I"?"Intern":element.status==="U"?"Unemployed":element.status==="D"?"Deseaded":element.status==="N"?"NoInfo":null,
                career:element?.career
                //company:element?.company
                //start_date:element?.start_date,
                //end:element?.end
              })
              alumnilist.push({
                id:i, 
                image:<img src={baseUrlforImg+element.image_url} alt="logo" className="user-image-icon" />,
                email:element.email,
                name:element.first_name+" "+element.last_name,
                phone:element.phone1,
                title:element?.title,
                status:element.status==="F"?"Full Time":element.status==="S"?"Self Empoyed":element.status==="P"?"Part Time":element.status==="I"?"Intern":element.status==="U"?"Unemployed":element.status==="D"?"Deseaded":element.status==="N"?"NoInfo":<Link to={`/add-alumni/info/${element.id}/addemployment`}><AiOutlineFileAdd className='icon'/></Link>,
                career:element?.career,
                //end:element?.end,
                Action:element.title?<span>
                  <Link to={`/add-alumni/info/${element.id}/addemployment`}><AiOutlineFileAdd className='icon'/></Link>
                  <Link to={`/alumni/updateemployement/${element.emp_id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/alumni/deleteemployment/${element.emp_id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                </span>:null
              })
              i+=1
            });
            setData(alumnilist);
            setDatatodownload(alumnilist2)
        }catch(err) {
            console.log(err);
            //navigate('/error');
        }
    }

    getcrcusers();

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

  return (
    <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div onClick={saveExcel} className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
              </div>
            </div>
            <DynamicTable mockdata={data} />
      </div>
  )
}
