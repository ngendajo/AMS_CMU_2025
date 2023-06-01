import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import axios from "axios";

export const CombDetails = ({ id }) => {
    const [name, setName] = useState("");
    let {auth} = useAuth();
    const navigate = useNavigate();


    let updatecomb = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/combination/'+id+"/", {
            'name':name
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
        navigate('/alumni')
    })
    .catch(error => console.log(error))
       
    }

    useEffect(()=> {
        getData()
    }, [])

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/combination/?id='+id, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(auth.accessToken)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setName(data[0].name);
        }
        
    }
    function closeLogin(e) {
        navigate('/alumni')
        document.getElementById("closeLogin").style.display = "none";
    }
  return (
    <>
      <div className="popup" id="closeLogin">
            <div className="popup-inner user-reg">
                <MdCancel className='cancellogin' onClick={closeLogin}/>
                <h2>Update Combination form </h2>
                
                    <form onSubmit={updatecomb} className='form-element'>
                        
                    <label> 
                        Combination Name:
                        <input 
                        type="text" name="name" value={name} placeholder="Enter name"
                        onChange={event => setName(event.target.value)}
                        />
                        
                    </label>
                    <center><span onClick={closeLogin} className='cancel'>Cancel</span><button type="submit">Update</button></center>
                </form>
            </div>
        </div>
    </>
  );
};
