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

export default function ASYVInfo() {
    const [data, setData] = useState([]); /*useState钩子声明了一个名为data的状态变量,用于存储获取到的校友信息数据. 对应的更新函数setData，初始值为一个空数组[] */
  
  const {auth} = useAuth(); /* 使用 useAuth 钩子从上下文中获取了 auth 对象 */

  useEffect(() =>{ /* 用 useEffect 钩子定义了一个副作用函数。副作用函数是在组件渲染完成后执行的函数 */
    
    const getcrcusers = async () =>{
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/alumni/',{ /* 用 axios 库发送了一个异步 GET 请求*/
                headers: { /* 请求头 */
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });

            /*当请求成功后，通过遍历 response.data 中的每个元素，构建了一个 alumnilist 数组，其中每个元素包含了校友的相关信息*/
            var alumnilist=[]
            var i=1
            response.data.forEach(element => {
              alumnilist.push({
                id:i, 
                image:<img src={"http://localhost:8000"+element.image_url} alt="logo" className="user-image-icon" />,
                email:element.email,
                first_name:element.first_name,
                last_name:element.last_name,
                phone:element.phone1,
                grade:element.alumn==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.alumn.Family.grade.grade_name,
                family:element.alumn==null? <Link to={`/add-alumni/info/${element.id}`}><AiOutlineFileAdd className='icon'/></Link>:element.alumn.Family.family_name,
                user_id:<span>
                  <Link to={`/alumniprofile/${element.id}`}><ImProfile className='icon'/></Link>
                  <Link to={`/add-alumni/${element.id}`}><BiEditAlt className='icon'/></Link>
                      <Link to={`/delete-alumni/${element.id}`}>  <RiDeleteBin5Line className='icon'/></Link>
                </span>
              })
              i+=1
            });
            setData(alumnilist); /* 使用 setData 更新了 data 的值为 alumnilist */
        }catch(err) {
            console.log(err);
        }
    }

    getcrcusers();

},[auth])
  return (
    <div className='alumni-list-body'>
            <div>
              <div className='staff-header-right alumni-header-right'>
                <div className='export-staff'>
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
