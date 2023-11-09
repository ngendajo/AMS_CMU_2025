
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
    { header: 'study_level', key: 'study_level' },
    { header: 'degree', key: 'degree' },
    { header: 'university', key: 'university' },
    { header: 'country', key: 'country' },
    { header: 'scholarship', key: 'scholarship' },
    { header: 'scholarship_details', key: 'scholarship_details' },
    { header: 'study_status', key: 'study_status' }
  ];
  const workSheetName = 'ASYV_Alumni_Studies_Data';
  const workBookName = 'ASYV_Alumni_Data';
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
              const response = await axios.get(baseUrl+'/studie/',{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              var alumnilist2=[]
              response.data.forEach(element => {
                
                alumnilist2.push({
                  id:element.alumn_id,
                  email:element.email,
                  name:element.lastst_name+" "+element.first_name,
                  phone:element.phone1,
                  study_level:element?.level,
                  degree:element?.degree,
                  university:element?.university,
                  country:element?.country,
                  scholarship:element.scholarship==="F"?"Full Scholarship":element.scholarship==="P"?"Partial Scholarship":element.scholarship==="D"?"Deseaded":element.scholarship==="N"?"NoInfo":null,
                  scholarship_details:element.scholarship_details,
                  study_status:element.status==="D"?"Droped_Out":element.status==="S"?"Suspended":element.status==="O"?"On_Going":element.status==="C"?"Completed":null
                  
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
          if(arr[i].degree===""||arr[i].university===""||arr[i].country===""||arr[i].scholarship_details===""||arr[i].status===""||arr[i].scholarship===""  ){
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
    function findDuplicatesinnumber(arr) {
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
          for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].phone_number === arr[j].phone_number) {
                newArr[index] = arr[i];
                index++;
             }
          }
       }
       return [...new Set(newArr)];
    }
    function findDuplicatesinnumberandemailindatabase(arr) {
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < users.length; j++) {
          if ((arr[i].phone_number === users[j].phone1)) {
                newArr[index] = arr[i];
                alert("This phone number "+arr[i].phone_number+" is already exist")
              index++;
             }
             else if(arr[i].email === users[j].email){
              newArr[index] = arr[i];
              alert("This email "+arr[i].email+" is already exist")
              index++;
             }
          }
       }
       return [...new Set(newArr)];
    }
    function findincorrectlevel(arr) {
      let index = 0, newArr = [];
       for (let i = 0; i < arr.length - 1; i++) {
        if(arr[i].study_level===undefined?true:!(["A2","A1","A0","M","PHD","NMS","D","N"].includes((arr[i].study_level).toUpperCase()))){
          newArr[index] = arr[i];
                index++;
        }else{
          
          continue;
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
        let results2 =findincorrectlevel(parseData)
          results2.sort((a, b) => {
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
        setData2(results2)
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
      let level=ele.study_level,degree=ele.degree,id=ele.id
      university=ele.university,scholarship=ele.scholarship,
      country=ele.country,status=ele.study_status,scholarship_details=ele.scholarship_details
      if(level===undefined?true:!(["A2","A1","A0","M","PHD","NMS","D","N"].includes((level).toUpperCase()))||degree===undefined?true:degree===""||university===undefined?true:university===""||country===undefined?true:country===""||scholarship_details===undefined?true:scholarship_details===""||status===undefined?true:status===""||scholarship===undefined?true:scholarship==="")
      {
        console.log(level)
      }
      else{
      axios.post(baseUrl+'/studie/', {
        "alumn":id,
        "level":level,
        "degree":degree,
        "university":university,
        "scholarship":scholarship.toUpperCase().startsWith("F",0)?"F":scholarship.toUpperCase().startsWith("P",0)?"P":scholarship.toUpperCase().startsWith("NS",0)?"NS":scholarship.toUpperCase().startsWith("D",0)?"D":"N",
        "country":country,
        "scholarship_details":scholarship_details,
        "status":status.toUpperCase().startsWith("Dr",0)?"D":status.toUpperCase().startsWith("S",0)?"S":status.toUpperCase().startsWith("O",0)?"O":status.toUpperCase().startsWith("De",0)?"De":status.toUpperCase().startsWith("D",0)?"C":status.toUpperCase().startsWith("NMS",0)?"NMS":"N"
        
        }, 
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    ).catch(error => console.log(error.response.data))
          //clear input fields
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
      navigate('/alumni/studie/')
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
                    data2.length>0?
                    <>
                      <h1>Incorect Study Level</h1>
                      {
                        data2.map((ele,key)=>{
                          return <p key={key}>{ele.email}, Names {ele.last_name} {ele.first_name} Your study_level is {ele.study_level} choose in "A2","A1","A0","M","PHD","NMS","D","N"</p>
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
