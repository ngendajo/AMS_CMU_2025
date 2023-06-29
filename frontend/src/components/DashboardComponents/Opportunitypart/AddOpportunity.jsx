import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import './register.css'

export default function AddOpportunity() {
    const {auth} = useAuth(); // 获取auth对象，用于身份验证
    const navigate = useNavigate() // 用于导航到其他页面
    const [id, setId] = useState("");  // 定义状态变量并给初始值
    const [title, setTitle] = useState("");  // 定义状态变量并给初始值
    const [user, setUser] = useState("");
    const [description, setDescription] = useState("");
    const [approved, setApproved] = useState("");
    const [post_time, setPost_time] = useState("");

    // registerGrade函数处理表单提交事件
    let registerOpportunity = (e)=> {
        e.preventDefault()  // 阻止默认的表单提交行为，不然直接刷新页面了
        console.log('Submit clicked'); // for test----------
        axios.post('http://127.0.0.1:8000/api/opportunity/create/',
        {
            'id': id,
            'title': title,
            'user': user,
            'description': description,
            'approved': approved,
            'post_time': post_time  //用setPost_time函数将更新后的数组赋值给post_time状态变量
        },
        {
            headers: {  // 请求头
                "Authorization": 'Bearer ' + String(auth.accessToken),  // 验证身份
                "Content-Type": 'application/json'  // 指定了请求的内容类型为JSON格式
            }
        }
    )
    .then(res => {
        console.log(res); // 输出响应数据
        navigate('/opportunities')  // 导航到这个页面
    })
    .catch(error => console.log(error))

    }

      // handleInputChange函数处理输入框的值变化事件
      const handleInputChange = (event) => {
          const { name, value } = event.target;
          if (name === "title") {
            setTitle(value);  // 用set..函数将更新后的数组赋值给相对应的状态变量
          } else if (name === "user") {
            setUser(value);
          } else if (name === "description") {
            setDescription(value);
          } else if (name === "approved") {
            setApproved(value);
          } else if (name === "post_time") {
            setPost_time(value);
          } else if (name === "id") {
            setId(value);
          }
      };

    return (
      <div className="add-opportunity-container">  {/* className is to match css */}
        <h1>Add Opportunity</h1>
        <form onSubmit={registerOpportunity}>
          <label>
            Id:
            <input type="number" name="id" value={id} onChange={handleInputChange} />  {/* onChange-用户输入或更改数据时，更新相关的状态变量 */}
          </label>
          <label>
            Title:
            <input type="text" name="title" value={title} onChange={handleInputChange} />
          </label>
          <label>
            User:
            <input type="number" name="user" value={user} onChange={handleInputChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={description} onChange={handleInputChange} />
          </label>
          <label>
            Approved:
            <input type="checkbox" name="approved" checked={approved} onChange={handleInputChange} />
          </label>
          <label>
            Post Time:
            <input type="date" name="post_time" value={post_time} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>  {/* 提交按钮，点击该按钮将触发registerOpportunity函数来处理表单的提交事件 */}
        </form>
      </div>
    );

}
