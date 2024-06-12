import useAuth from '../../../../hooks/useAuth';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import { StudieTable } from '../StudieTable';
//import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../../api/baseUrl';
import baseUrlforImg from '../../../../api/baseUrlforImg';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';

import DynamicTable from "./dinamicTable/DynamicTable";

const columns = [
  { header: 'No', key: 'no' },
  { header: 'Email', key: 'email' },
  { header: 'Name', key: 'name' },
  { header: 'Phone number', key: 'phone' },
  { header: 'Level', key: 'level' },
  { header: 'Degree', key: 'degree' },
  { header: 'University', key: 'university' },
  { header: 'Scholarship', key: 'scholarship' },
  { header: 'Sholarship Details', key: 'scholarship_details' },
  { header: 'Study Status', key: 'status' }
];
const workSheetName = 'Alumni_Study_Report';
const workBookName = 'Alumni_Study_Report';


export default function Studies() {
  const [data, setData] = useState([]);
  const [datatodownload, setDatatodownload] = useState([]);
  
  const {auth} = useAuth();

  //const navigate=useNavigate();

  useEffect(() =>{
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get(baseUrl+'/studie/',{
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
              alumnilist.push({
                id:i, 
                image:<img src={baseUrlforImg+element.image_url} alt="logo" className="user-image-icon" />,
                email:element.email,
                name:element.first_name+" "+element.last_name,
                // phone:element.phone1,
                degree:element.level==="PHD"? "PHD":element.level==="M"? "Masters":element.level==="A0"? "Bachelors":element.level==="A1"? "Diploma":element.level==="C"? "Certificate":element.level==="NMS"? "No further studies":element.level==="N"? "No Info":element.level==="D"? "Deceased":null,
                field:element?.degree,
                university:element?.university,
                country:element?.country,
                scholarship:element.scholarship==="F"?"Full Scholarship":element.scholarship==="P"?"Partial Scholarship":element.scholarship==="NS"?"Self Sponsored":element.scholarship==="D"?"Deseaded":element.scholarship==="NMS"?"No Futher Studies":element.scholarship==="N"?"No Info":null,
                scholarship_details:element.scholarship_details,
                status:element.status==="D"?"Droped_Out":element.status==="S"?"Suspended":element.status==="O"?"On_Going":element.status==="C"?"Completed":element.status==="De"?"Deseaded":element.status==="NMS"?"No Futher Studies":element.status==="N"?"NoInfo":<Link to={`/add-alumni/info/${element.id}/study`}><AiOutlineFileAdd className='icon'/></Link>,
                Action:element.study_id?<span>
                  <Link to={`/add-alumni/info/${element.id}/study`}><AiOutlineFileAdd className='icon'/></Link>
                  <Link to={`/alumni/updatestudie/${element.study_id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/alumni/deletestudy/${element.study_id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                </span>:null
              })
              alumnilist2.push({
                no:element.alumn_id,
                email:element.email,
                name:element.first_name+" "+element.last_name,
                phone:element.phone1,
                level:element.level==="PHD"? "PHD":element.level==="M"? "Masters":element.level==="A0"? "Bachelors":element.level==="A1"? "Diploma":element.level==="C"? "Certificate":element.level==="NMS"? "No further studies":element.level==="N"? "No Info":element.level==="D"? "Deceased":null,
                degree:element?.degree,
                university:element?.university,
                country:element?.country,
                scholarship:element.scholarship==="F"?"Full Scholarship":element.scholarship==="P"?"Partial Scholarship":element.scholarship==="D"?"Deseaded":element.scholarship==="NMS"?"No Futher Studies":element.scholarship==="N"?"No Info":null,
              })
              i+=1
            });
            setData(alumnilist);
            setDatatodownload(alumnilist2);
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
