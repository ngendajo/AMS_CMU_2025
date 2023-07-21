import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Editcombination() {
    const [combination_name, setCombination_name] = useState("");
    const {auth} = useAuth();
    const params = useParams();
    const navigate =useNavigate()

    const handleDelete = () => {
        
        axios.delete('http://127.0.0.1:8000/api/combination/'+params.id+'/delete/',
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

    useEffect(() =>{
    
        const getCombination = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/combination/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                setCombination_name(data[0].combination_name)
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getCombination();
    
    },[auth,params])
    
    let updatecomb = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/combination/'+params.id+"/", {
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
