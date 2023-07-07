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
    { header: 'llace_of_origin', key: 'place_of_birth' },
    { header: 'current_residence', key: 'CurrResidence' },
    { header: 'grade', key: 'grade_name' },
    { header: 'family', key: 'family' },
    { header: 'combination', key: 'combination_name' },
    { header: 'eps', key: 'eps' },
    { header: 's4_marks', key: 's4marks' },
    { header: 's5_marks', key: 's5marks' },
    { header: 's6_marks', key: 's6marks' },
    { header: 'national_exam_result', key: 'ne' },
    { header: 'maximum_aggregate_in_ne', key: 'maxforne' }
  ];
  const workSheetName = 'ASYV_Alumni_Data';
  const workBookName = 'ASYV_Alumni_Data';
export default function AddBulkASYVInfo() {
    const [data, setData]= useState([]);

      
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
          setData(parseData)
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
              {/* {data.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) =>(
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) =>(
                      <tr key={index}>
                        {Object.values(row).map((value, index) => (
                          <td key={index}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} */}
      </div>
  )
}
