import React, {useState} from 'react';
//import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import './register.css'

export default function AddOpportunity() {
    const {auth} = useAuth(); // 获取auth对象，用于身份验证
    const navigate = useNavigate() // 用于导航到其他页面
    const [title, setTitle] = useState("");  // 定义状态变量并给初始值
    const [user, setUser] = useState("");
    const [description, setDescription] = useState("");
    const [post_time, setPost_time] = useState("");
    //const [showOpportunityList, setShowOpportunityList] = useState(false);  // 来跟踪是否点击按钮

    // registerOpportunity函数处理表单提交事件
    let registerOpportunity = (e)=> {
        e.preventDefault()  // 阻止默认的表单提交行为，不然直接刷新页面了

        const opportunityData = {
            title: title,
            user: user,
            description: description,
            post_time: post_time
        };

        axios.post('http://127.0.0.1:8000/api/opportunity/create/', opportunityData, {
            headers: {  // 请求头
                    "Authorization": 'Bearer ' + String(auth.accessToken),  // 验证身份
                    "Content-Type": 'application/json'  // 指定了请求的内容类型为JSON格式
            }
        })
        .then(res => {
            console.log(res); // 输出响应数据
            navigate('/')  // 导航到这个页面
        })
        .catch(error => console.log(error))
    };

      // handleInputChange函数处理输入框的值变化事件
      const handleInputChange = (event) => {
          const { name, value } = event.target;
          if (name === "title") {
            setTitle(value);  // 用set..函数将更新后的数组赋值给相对应的状态变量
          } else if (name === "user") {
            setUser(value);
          } else if (name === "description") {
            setDescription(value);
          } else if (name === "post_time") {
            setPost_time(value);
          }
      };

    return (
      <div className="add-opportunity-container">  {/* className is to match css */}
        <h1>Add Opportunity</h1>
        <form onSubmit={registerOpportunity}>
          <label>
            Title
            <input type="text" name="title" value={title} onChange={handleInputChange} />
          </label>
          <label>
            User
            <input type="number" name="user" value={user} onChange={handleInputChange} />
          </label>
          <label>
            Description
            <textarea name="description" value={description} onChange={handleInputChange} />
          </label>
          <label>
            Post Time
            <input type="date" name="post_time" value={post_time} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>  {/* 提交按钮，点击该按钮将触发registerOpportunity函数来处理表单的提交事件 */}
        </form>


      </div>
    );

}


