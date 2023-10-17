import "./userList.css";
import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import './register.css'
import baseUrl from "../../../api/baseUrl";

export default function AddEp() {
    const {auth} = useAuth();
    const navigate =useNavigate()
    let registerEp = (e )=> {
        e.preventDefault()
        axios.post(baseUrl+'/ep/', {
            'title':e.target.title.value,
            'type':e.target.type.value
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        alert(res.data.title+" created successfully")
        navigate('/alumni/eps')
    })
    .catch(error => console.log(error.response.data))
        
    }
  return (
    <div className='alumni-list-body'>
        <center><h1>Add a new Ep form</h1></center>
        <form onSubmit={registerEp} className='form-element'>
            <div className="grade-info">
                <label>
                    Ep title:
                    <input
                        type='text'
                        name='title'
                        placeholder='title'
                    />
                </label>
                <label>
                    Type:
                    <select name='type'>
                        <option value="A">Arts</option>
                        <option value="C">Clubs</option>
                        <option value="S">Sports</option>
                        <option value="SC">Sciences</option>
                        <option value="P">Professional</option>
                    </select>
                </label>
        </div>
                <center><button type="submit">Save</button></center>
    </form>
    <p>
        <Link className="line" to="/alumni/eps">Go back</Link>
    </p>
    </div>
  )
}
