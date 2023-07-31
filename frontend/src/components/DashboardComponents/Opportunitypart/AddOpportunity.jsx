import React, {useState} from 'react';
//import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import './register.css'

export default function AddOpportunity() {
    const {auth} = useAuth(); // get auth object，to check identity
    const navigate = useNavigate()
    const [title, setTitle] = useState("");
    const [setUser] = useState("");
    const [description, setDescription] = useState("");
    const [post_time, setPost_time] = useState("");
    //const [showOpportunityList, setShowOpportunityList] = useState(false); // track if button is clicked

    // registerOpportunity for form submit event
    let registerOpportunity = (e)=> {
        e.preventDefault()  // prevent the default submission behavior, otherwise will refresh the page

        const opportunityData = {
            title: title,
            user: auth.user.id,
            description: description,
            post_time: post_time
        };

        axios.post('http://127.0.0.1:8000/api/opportunity/create/', opportunityData, {
            headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),  // check identity
                    "Content-Type": 'application/json'  // Specifies the request is in JSON format
            }
        })
        .then(res => {
            console.log(res); // output response data
            navigate('/')
        })
        .catch(error => console.log(error))
    };

      // handleInputChange is to handle the input box value change event
      const handleInputChange = (event) => {
          const { name, value } = event.target;
          if (name === "title") {
            setTitle(value);  // assigns the updated array to the corresponding state variable
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
            Description
            <textarea name="description" value={description} onChange={handleInputChange} />
          </label>
          <label>
            Post Time
            <input type="date" name="post_time" value={post_time} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>  {/* invoke registerOpportunity function to handle form submit event */}
        </form>

      </div>
    );

}


