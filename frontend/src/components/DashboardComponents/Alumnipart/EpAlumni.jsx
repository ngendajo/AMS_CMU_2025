
import useAuth from "../../../hooks/useAuth";
import { Table } from "./Table";
import { useParams } from 'react-router';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineFileAdd } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { PiPasswordFill } from "react-icons/pi";
import baseUrl from "../../../api/baseUrl";
import baseUrlforImg from "../../../api/baseUrlforImg";

const columns = [
  { header: 'No', key: 'no' },
  { header: 'Email', key: 'email' },
  { header: 'Name', key: 'name' },,
  { header: 'Phone number', key: 'phone1' },
  { header: 'Grade', key: 'grade_name' },
  { header: 'Family', key: 'family' },
  { header: 'Combination', key: 'combination_name' },
  { header: 'Enrishment Program', key: 'ep' }
];
const workSheetName = 'Alumni_Report';
const workBookName = 'Alumni_Report';

export default function EpAlumni() {
  const [data, setData] = useState([]); /*useState钩子声明了一个名为data的状态变量,用于存储获取到的校友信息数据. 对应的更新函数setData，初始值为一个空数组[] */
  const [datatodownload, setDatatodownload] = useState([]); 
  const {auth} = useAuth(); /* 使用 useAuth 钩子从上下文中获取了 auth 对象 */
  const [ep, setEp] = useState("");
  
  const params = useParams();

  function epType(type){
    if(type==="A")
    {
      return "Arts Center";
    }
    if(type==="C")
    {
      return "Clubs";
    }
    if(type==="SC")
    {
      return "Science Center";
    }
    if(type==="S")
    {
      return "Sports";
    }
  }
  function getEps(eps)
  {
    var epslist=" ";
  for(var i=0;i<eps.length;i++){
    if(i===eps.length-1){
      epslist+=eps[i].title+" from "+epType(eps[i].type)
    }else{
      epslist+=eps[i].title+" from "+epType(eps[i].type)+", "
    }
  }
  return epslist
  }

  useEffect(() =>{ /* 用 useEffect 钩子定义了一个副作用函数。副作用函数是在组件渲染完成后执行的函数 */
    
    const getalumniusers = async () =>{
        try{
            const response = await axios.get(baseUrl+'/alumnilistbyep/?ep_id='+params.id,{ /* 用 axios 库发送了一个异步 GET 请求*/
                headers: { /* 请求头 */
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });

            /*当请求成功后，通过遍历 response.data 中的每个元素，构建了一个 alumnilist 数组，其中每个元素包含了校友的相关信息*/
            var alumnilist=[]
            var alumnilist2=[]
            var i=1
            var e=""
            response.data.forEach(element => {
              if(i===1){
                e=element.ep_title;
              }
              alumnilist.push({
                id:i, 
                image:<img src={baseUrlforImg+element.image_url} alt="logo" className="user-image-icon" />,
                email:element.email,
                first_name:element.first_name,
                 last_name:element.last_name,
                phone:element.phone1,
                grade:element.grade_name==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.grade_name,
                family:element.family_name==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.family_name,
                combination:element.combination_name==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.combination_name,
                user_id:<span> 
                  <Link to={`/alumniprofile/${element.id}`}><ImProfile className='icon'/></Link>
                  <Link to={`/add-alumni/${element.id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/delete-alumni/${element.id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                      <Link to={`/reset-alumn-password/${element.id}`}> <PiPasswordFill className='icon'/></Link>
                </span>
              })
              alumnilist2.push({
                no:i,
                email:element.email,
                 name:element.first_name+" "+element.last_name,
                 phone1:element.phone1, 
                 grade_name:element.grade_name,
                 family:element.family_name,
                 combination_name:element.combination_name,
                 ep:element.ep_title
               })
              i+=1
            });
            
            setData(alumnilist); /* 使用 setData 更新了 data 的值为 alumnilist */
            setEp(e)
            setDatatodownload(alumnilist2)
        }catch(err) {
            console.log(err);
        }
    }

    getalumniusers();

},[auth])

const workbook = new Excel.Workbook();

  const saveExcel = async () => {
    try {
      if(datatodownload.length>0){
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
      }else{
        alert("Please Wait for 2 minutes....")
      }
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
                <h1>List of alumni from {ep} Enrishment Program</h1>
                <div onClick={saveExcel} className='export-staff'>
                  <span>Export xlsx</span><BiExport/>
                </div>
                <div className='add-staff'>
                  <Link to="/alumni/combinations/" className='link'>Go Back</Link>
                </div>
              </div>
            </div>
              <div className="listtable">
                <Table mockData={data} />
              </div>
      </div>
  )
}

