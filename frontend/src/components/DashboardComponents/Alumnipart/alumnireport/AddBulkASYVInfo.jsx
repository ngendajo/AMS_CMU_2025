import React from 'react';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { BiExport } from "react-icons/bi";

const columns = [
    { header: 'Email', key: 'email' },
    { header: 'First Name', key: 'first_name' },
    { header: 'Last Name', key: 'last_name' },
    { header: 'Phone number', key: 'phone1' },
    { header: 'Martal Status', key: 'marital_status' },
    { header: 'Gender', key: 'gender' },
    { header: 'Kids', key: 'kids' },
    { header: 'Father', key: 'father' },
    { header: 'Mother', key: 'mother' },
    { header: 'Place of Origin', key: 'place_of_birth' },
    { header: 'Current Residence', key: 'CurrResidence' },
    { header: 'Grade', key: 'grade_name' },
    { header: 'Family', key: 'family' },
    { header: 'Combination', key: 'combination_name' },
    { header: 'S4 Marks', key: 's4marks' },
    { header: 'S5 Marks', key: 's5marks' },
    { header: 'S6 Marks', key: 's6marks' },
    { header: 'National Exam Result', key: 'ne' },
    { header: 'Maximum Aggregate in NE', key: 'maxforne' }
  ];
  const workSheetName = 'ASYV_Alumni_Data';
  const workBookName = 'ASYV_Alumni_Data';
export default function AddBulkASYVInfo() {
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
  return (
    <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div onClick={saveExcel} className='export-staff'>
                  <span>Export xlsx to use</span><BiExport/>
                </div>
                <div className='export-staff'>
                  <span>Import xlsx</span><BiExport/>
                </div>
              </div>
            </div>
      </div>
  )
}
