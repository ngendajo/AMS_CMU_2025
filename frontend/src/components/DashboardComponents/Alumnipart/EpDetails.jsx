import { MdCancel } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import React, {useState, useEffect, useContext} from 'react'
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import baseUrl from "../../../api/baseUrl";

export const EpDetails = ({ id }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [types, setTypes] = useState([{'Art':'A','Clubs':'C','Science':'SC','d':'A'}]);
    let {auth}= useAuth();


    let updateep = (e )=> {
        e.preventDefault()
        axios.post(baseUrl+'/updateep/'+id+"/", {
            'title':title,
            'type':type
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        navigate('/alumni')
    })
    .catch(error => console.log(error))
       
    }

    useEffect(()=> {
        getData()
    }, [])

    let getData = async() =>{
        let response = await fetch(baseUrl+'/ep/?id='+id, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(auth.accessToken)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setTitle(data[0].title);
            setType(data[0].type)
            setTypes([{'Art':'A','Clubs':'C','Science':'SC','d':data[0].type}])
        }
        
    }
    
    const navigate = useNavigate()

    function closeLogin(e) {
        navigate('/alumni')
        document.getElementById("closeLogin").style.display = "none";
    }
  return (
    <>
      <div className="popup" id="closeLogin">
            <div className="popup-inner user-reg">
                <MdCancel className='cancellogin' onClick={closeLogin}/>
                <h2>Update Ep form </h2>
                
                    <form onSubmit={updateep} className='form-element'>
                        
                    <label> 
                        Ep title:
                        <input 
                        type="text" name="title" value={title} placeholder="Enter title"
                        onChange={event => setTitle(event.target.value)}
                        />
                        
                    </label> 
                    <label>
                        Ep type:
                        <select name='type' onChange={event => setType(event.target.value)}>
                            {types.map(t=>(
                                t.d==t.Art? <>
                                <option value={t.Art} selected>Art {t.d}{t.Art}</option>
                                <option value={t.Clubs}>Clubs</option>
                                <option value={t.Science}>Science</option>
                                </>: t.Clubs==t.d? <>
                                <option value={t.Art}>Art</option>
                                <option value={t.Clubs} selected>Clubs{t.d}{t.Clubs}</option>
                                <option value={t.Science}>Science</option>
                                </>:<>
                                <option value={t.Art}>Art</option>
                                <option value={t.Clubs}>Clubs</option>
                                <option value={t.Science} selected>Science{t.d}{t.Science}</option>
                                </>
                                
                            ))}
                            
                        </select>
                        
                    </label>
                    <center><span onClick={closeLogin} className='cancel'>Cancel</span><button type="submit">Update</button></center>
                </form>
            </div>
        </div>
    </>
  );
};
