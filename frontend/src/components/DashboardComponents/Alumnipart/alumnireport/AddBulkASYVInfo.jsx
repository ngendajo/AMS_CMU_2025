import React from 'react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { BiExport } from "react-icons/bi";
import { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from "react-dropzone"; 
import "../alumni.css";

const columns = [
    { header: 'email', key: 'email' },
    { header: 'first_name', key: 'first_name' },
    { header: 'last_name', key: 'last_name' },
    { header: 'phone_number', key: 'phone1' },
    { header: 'martal_status', key: 'marital_status' },
    { header: 'gender', key: 'gender' },
    { header: 'kids', key: 'kids' },
    { header: 'father', key: 'father' },
    { header: 'mother', key: 'mother' },
    { header: 'place_of_origin', key: 'place_of_birth' },
    { header: 'current_residence', key: 'CurrResidence' },
    { header: 'grade', key: 'grade_name' },
    { header: 'family', key: 'family' },
    { header: 'combination', key: 'combination_name' },
    { header: 'eps', key: 'eps' },
    { header: 's4_marks', key: 's4marks' },
    { header: 's5_marks', key: 's5marks' },
    { header: 's6_marks', key: 's6marks' },
    { header: 'national_exam_result', key: 'ne' },
    { header: 'maximum_aggregate_in_ne', key: 'maxforne' },
    { header: 'job_title', key: 'job_title' },
    { header: 'job_status', key: 'job_status' },
    { header: 'description', key: 'description' },
    { header: 'company', key: 'company' },
    { header: 'study_level', key: 'study_level' },
    { header: 'degree', key: 'degree' },
    { header: 'university', key: 'university' },
    { header: 'country', key: 'country' },
    { header: 'scholarship', key: 'scholarship' },
    { header: 'study_status', key: 'study_status' }
  ];
  const workSheetName = 'ASYV_Alumni_Data';
  const workBookName = 'ASYV_Alumni_Data';
export default function AddBulkASYVInfo() {
    const [data, setData]= useState([]);

    function findDuplicatesinemail(arr) {
      //let datatobechecked=[]
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].email === arr[j].email) {
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
          setData(findDuplicatesinemail(parseData))
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
  console.log(data)
      
 
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
                  {data.length>0? <h1>Duplicate data</h1>:null}
                  {
                    data.map((ele,key)=>{
                      return <p key={key}>{ele.email}, Names {ele.last_name} {ele.first_name}</p>
                    })
                  }
                </div>
              </div>
      </div>
  )
}
