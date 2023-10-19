import useAuth from '../../../../hooks/useAuth';
import { Table } from '../Table';
import { BiEditAlt,BiExport } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { AiOutlineFileAdd } from "react-icons/ai";
import { ImProfile } from "react-icons/im";
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { PiPasswordFill } from "react-icons/pi";
import baseUrl from '../../../../api/baseUrl';
import baseUrlforImg from '../../../../api/baseUrlforImg';

const columns = [
  { header: 'No', key: 'no' },
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
  { header: 'Current Residence', key: 'currresidence' },
  { header: 'Grade', key: 'grade_name' },
  { header: 'Family', key: 'family' },
  { header: 'Combination', key: 'combination_name' },
  { header: 'Enrishment Programs', key: 'eps' },
  { header: 'S4 Marks', key: 's4marks' },
  { header: 'S5 Marks', key: 's5marks' },
  { header: 'S6 Marks', key: 's6marks' },
  { header: 'National Exam Result', key: 'ne' },
  { header: 'Maximum Aggregate in NE', key: 'maxforne' },
  { header: 'Decision', key: 'decision' },
  { header: 'Life Status', key: 'life_status' }
];
const workSheetName = 'Alumni_Report';
const workBookName = 'Alumni_Report';

export default function ASYVInfo() {
    const [data, setData] = useState([]); /*useState钩子声明了一个名为data的状态变量,用于存储获取到的校友信息数据. 对应的更新函数setData，初始值为一个空数组[] */
    const [datatodownload, setDatatodownload] = useState([]); 
    const {auth} = useAuth(); /* 使用 useAuth 钩子从上下文中获取了 auth 对象 */
  const navigate=useNavigate();

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
            const response = await axios.get(baseUrl+'/alumnilist/',{ /* 用 axios 库发送了一个异步 GET 请求*/
                headers: { /* 请求头 */
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });

            /*当请求成功后，通过遍历 response.data 中的每个元素，构建了一个 alumnilist 数组，其中每个元素包含了校友的相关信息*/
            var alumnilist=[]
            var i=1
            console.log(response.data)
            response.data.forEach(element => {
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
              i+=1
            });
            setData(alumnilist); /* 使用 setData 更新了 data 的值为 alumnilist */
        }catch(err) {
            console.log(err);
        }
    }

    getalumniusers();

},[auth])

  useEffect(() =>{ /* 用 useEffect 钩子定义了一个副作用函数。副作用函数是在组件渲染完成后执行的函数 */
    
    const getusers = async () =>{
        try{
            const response = await axios.get(baseUrl+'/alumni/',{ /* 用 axios 库发送了一个异步 GET 请求*/
                headers: { /* 请求头 */
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });

            /*当请求成功后，通过遍历 response.data 中的每个元素，构建了一个 alumnilist 数组，其中每个元素包含了校友的相关信息*/
            
            var alumnilist2=[]
            var i=1
            console.log(response.data)
            Array.isArray(response.data)?
            response.data.forEach(element => {
              alumnilist2.push({
               no:i,
               email:element.email,
                first_name:element.first_name,
                last_name:element.last_name,
                phone1:element.phone1, 
                marital_status:element.alumn==null?"Null":element.alumn.marital_status,
                gender:element.alumn==null?"Null":element.alumn.gender,
                kids:element.alumn==null?"Null":element.alumn.kids?"Yes":"No",
                father:element.alumn==null?"Null":element.alumn.father,
                mother:element.alumn==null?"Null":element.alumn.mother,
                place_of_birth:element.alumn==null?"Null":element.alumn.place_of_birth,
                currresidence:element.alumn==null?"Null":element.alumn.currresidence,
                grade_name:element.alumn==null?"Null":element.alumn.family.grade.grade_name,
                family:element.alumn==null?"Null":element.alumn.family.family_name,
                combination_name:element.alumn==null?"Null":element.alumn.combination.combination_name,
                eps:element.alumn==null?"Null":element.alumn.eps.length>0?getEps(element.alumn.eps):element.alumn.eps.length,
                s4marks:element.alumn==null?"Null":element.alumn.s4marks,
                s5marks:element.alumn==null?"Null":element.alumn.s5marks,
                s6marks:element.alumn==null?"Null":element.alumn.s6marks,
                ne:element.alumn==null?"Null":element.alumn.ne,
                maxforne:element.alumn==null?"Null":element.alumn.maxforne,
                decision:element.alumn==null?"Null":element.alumn.decision=="P"?"Pass":"Fail",
                life_status:element.alumn==null?"Null":element.alumn.life_status=="A"?"Alive":"Died"
              })
              i+=1
            }):null;
            setDatatodownload(alumnilist2);
            console.log(alumnilist2)
        }catch(err) {
            console.log(err);
            // navigate('/error');
        }
    }

    getusers();

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
      // navigate('/error');
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
                <div className='add-staff'>
                  <Link to="/add-alumni" className='link'>Add Alumni</Link><IoIosAdd className='addicon'/>
                </div>
              </div>
            </div>
              <div className="listtable">
                <Table mockData={data} />
              </div>
      </div>
  )
}
