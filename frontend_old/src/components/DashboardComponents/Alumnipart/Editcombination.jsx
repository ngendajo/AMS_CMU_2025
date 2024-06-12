import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import baseUrl from "../../../api/baseUrl";

export default function Editcombination() {
    const [combination_name, setCombination_name] = useState("");
    const {auth} = useAuth();
    const params = useParams();
    const navigate =useNavigate()

    useEffect(() =>{
    
        const getCombination = async () =>{
            try{
                const response = await axios.get(baseUrl+'/combination/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                if (data && data.length > 0) {
                    setCombination_name(data[0].combination_name);
                  } else {
                    console.log("No data")// Handle the case when data is undefined or empty
                  }
            }catch(err) {
                console.log(err);
                //navigate('/error');
            }
        }
    
        getCombination();
    
    },[auth,params])
    
    let updatecomb = (e )=> {
        e.preventDefault()
        axios.post(baseUrl+'/combination/'+params.id+"/", {
            'combination_name':combination_name
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        console.log(res)
        navigate('/alumni/combinations')
    })
    .catch(error => console.log(error))
       
    }
    const handleDelete = () => {
        
        axios.delete(baseUrl+'/combination/'+params.id+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        ).then(res =>{
            console.log(res)
            navigate('/alumni/combinations')
        })
      };
  return (
    <div className='alumni-list-body'>
        
        <p>
             <Link className="line" to="/alumni/combinations">Go back</Link>
        </p>
        <center><h1>Add a new Combination form</h1></center> 
        <form  onSubmit={updatecomb} className='form-element'>
            <div className="grade-info">
                <label>
                <input
                        type='text'
                        name='combination_name'
                        value={combination_name}
                        placeholder='combination name'
                        onChange={event=>setCombination_name(event.target.value)}
                    />
                </label>
            </div>        
            <center><button type="submit">Update</button></center>
        </form>
        <Link onClick={handleDelete} className="line" to="#">Delete Grade</Link>
    </div>
  )
}
