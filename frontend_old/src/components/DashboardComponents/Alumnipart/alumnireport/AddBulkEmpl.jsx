
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { BiExport } from "react-icons/bi";
import React, { useState,useEffect  } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from "react-dropzone"; 
import axios from 'axios';
import useAuth from '../../../../hooks/useAuth';
import "../alumni.css";
import { useNavigate } from "react-router-dom";
import baseUrl from '../../../../api/baseUrl';

const columns = [
    { header: 'id', key: 'id' },
    { header: 'email', key: 'email' },
    { header: 'name', key: 'name' },
    { header: 'phone_number', key: 'phone' },
    { header: 'grade_name', key: 'grade_name' },
    { header: 'family_name', key: 'family_name' },
    { header: 'combination_name', key: 'combination_name' },
    { header: 'title', key: 'title' },
    { header: 'employ_status', key: 'employ_status' },
    { header: 'career', key: 'career' },
    { header: 'description', key: 'description' },
    { header: 'company', key: 'company' }
  ];
  const workSheetName = 'ASYV_Alumni_Employ_Data';
  const workBookName = 'ASYV_Alumni_Employ_Data';
  const EMAIL_REGIX =/\S+@\S+\.\S+/; 
export default function AddBulkStudies() {
    const [data, setData]= useState([]);
    const [data2, setData2]= useState([]);
    const [data4, setData4]= useState([]);
    const [datafinal, setDatafinal]= useState([]);
    const {auth} = useAuth();
    const [datatodownload, setDatatodownload] = useState([]);
    const navigate = useNavigate();

    useEffect(() =>{
    
      const users = async () =>{
          try{
              const response = await axios.get(baseUrl+'/employment/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              var alumnilist2=[]
              console.log(response.data)
              response.data.forEach(element => {
                
                alumnilist2.push({
                  id:element.alumn_id,
                  email:element.email,
                  name:element.last_name+" "+element.first_name,
                  phone:element.phone1,
                  gender:element.gender,
                  grade_name:element.grade_name,
                  family_name:element.family_name,
                  combination_name:element.combination_name,
                  title:element?.title,
                  company:element?.company,
                  description:element?.description,
                  employ_status:element.status==="F"?"Full Time":element.status==="S"?"Self Empoyed":element.status==="P"?"Part Time":element.status==="I"?"Intern":element.status==="U"?"Unemployed":element.status==="D"?"Deseaded":element.status==="N"?"NoInfo":null,
                  career:element?.career
                })
              });
              setDatatodownload(alumnilist2);
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      users();
  
  },[auth])

    function findemptycell(arr) {
      
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
          if(arr[i].title===""||arr[i].description===""||arr[i].career===""||arr[i].employ_status===""||arr[i].company==="" ){
            newArr[index] = arr[i];
                index++;
          }
       }
       return [...new Set(newArr)];
    }

    function findDuplicatesid(arr) {
      
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].id === arr[j].id) {
                newArr[index] = arr[i];
                index++;
             }
          }
       }
       return [...new Set(newArr)];
    }
    
    
      
    const handleFileUpload = (files) => {
      if (files.length > 0) {
        const reader =new FileReader();
        reader.readAsBinaryString(files[0]);
        reader.onload = (e) =>{
          const data = e.target.result;
          const workbook=XLSX.read(data, {type: 'binary'});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parseData = XLSX.utils.sheet_to_json(sheet);
          
          setDatafinal(parseData)
          let results =findDuplicatesid(parseData)
          results.sort((a, b) => {
            let fa = a.id,
                fb = b.id;
        
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
        
        let results4 =findemptycell(parseData)
          results4.sort((a, b) => {
            let fa = a.id,
                fb = b.id;
        
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
        setData4(results4)
        
          setData(results)
        }
      }
    }
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
  const handleSubmit = async (ele) =>{
    try{
        let title=ele.title,career=ele.career,description=ele.description,
        company=ele.company,job_status=ele.employ_status;
         if(title===""||company===""||career===""||job_status==="")
      {
        alert("There is a column which has empty values")
      }
      else{
        axios.post(baseUrl+'/employment/', {
      "title":title,
      "status":job_status.toUpperCase().startsWith("F",0)?"F":job_status.toUpperCase().startsWith("P",0)?"P":job_status.toUpperCase().startsWith("S",0)?"S":job_status.toUpperCase().startsWith("I",0)?"I":job_status.toUpperCase().startsWith("U",0)?"U":job_status.toUpperCase().startsWith("D",0)?"D":"N",
      "description":description===undefined?"NS":description,
      "company":company,
      "alumn":ele.id,
      "career":career===undefined?"":career,
      "start_date":"NS",
      "end_date":"Up to now"
      },
      {
          headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
          }
      }
  )
  .then(res =>{
      console.log(res)
  })
}  
      
  }catch(err){
      console.log(err);
    }
    }
  
  function savedata(){
    if(datafinal.length>0){
      datafinal.forEach((ele)=>{
        handleSubmit(ele)
      })
      navigate('/alumni/employment/')
    }
  }
      
 
  return (
    <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div onClick={saveExcel} className='export-staff'>
                  <span>Export xlsx to use</span><BiExport/>
                </div>
              </div>
              <div>
              <Dropzone onDrop={handleFileUpload} multiple={false}> 
                            {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                
                                    <span><strong className="browse">Browse</strong> <strong>a excel .xlsx file</strong><br/> or drag and drop</span>
                                
                                </div>
                            </section>
                            )}
                        </Dropzone>
              </div>
            </div>
              <div>
                <div className="errormessage">
                  {data.length>0? 
                    <>
                      <h1>Duplicate id</h1>
                      {
                        data.map((ele,key)=>{
                          return <p key={key}>Id:{ele.id},Email:{ele.email}, Names {ele.last_name} {ele.first_name}</p>
                        })
                      }
                    </>
                    
                    :
                    data4.length>0?
                    <>
                      <h1>unexcepted null values</h1>
                      {
                        data4.map((ele,key)=>{
                          return <p key={key}>{ele.phone_number}, {ele.email}, Names {ele.last_name} {ele.first_name}</p>
                        })
                      }
                    </>:
                    datafinal.length>0?
                    <div className="wellchecked">
                      <h1>Data well checked</h1>
                      <h2 onClick={savedata}>comfirm submition</h2>
                    </div>:
                    null

                  }
                  
                </div>
              </div>
      </div>
  )
}
