import "./userList.css";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './register.css'
import baseUrl from "../../../api/baseUrl";

export default function EditEp() {

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const navigate = useNavigate();
    const [types, setTypes] = useState([{'Art':'A','Clubs':'C','Professional':'P','Sports':'S','Science':'SC','d':'A'}]);
    let {auth}= useAuth();
    const params = useParams();

    const handleDelete = () => {
        
        axios.delete(baseUrl+'/ep/'+params.id+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        ).then(res =>{
            console.log(res)
            navigate('/alumni/eps')
        })
      };

    let updateep = (e)=> {
        e.preventDefault()
        axios.post(baseUrl+'/updateep/'+params.id+"/", {
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
        navigate('/alumni/eps')
    })
    .catch(error => console.log(error))
       
    }
    useEffect(() =>{
    
        const getEp = async () =>{
            try{
                const response = await axios.get(baseUrl+'/ep/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                setTitle(data[0].title);
                setType(data[0].type)
                setTypes([{'Art':'A','Clubs':'C','Professional':'P','Sports':'S','Science':'SC','d':data[0].type}])
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getEp();
    
    },[auth,params])
  return (
    <div className='alumni-list-body'>
        <p>
            <Link className="line" to="/alumni/eps">Go back</Link>
        </p>
        <center><h1>Update Ep form</h1></center>
            <form onSubmit={updateep} className='form-element'>
                      <div className="grade-info"></div>  
                        <label> 
                            Ep title:
                            <input 
                            type="text" name="title" value={title} placeholder="Enter title"
                            onChange={event => setTitle(event.target.value)}
                            />
                            
                        </label> 
                        <label>
                            Ep type:
                            
                                {types.map((t,i)=>{
                                   return <select key={i} name='type' onChange={event => setType(event.target.value)}>

                                        {t.d===t.Art ? <option value={t.Art} selected>Art</option>
                                        :<option value={t.Art}>Art</option>}

                                        {t.d===t.Professional ? <option value={t.Professional} selected>Professional</option>
                                        :<option value={t.Professional}>Professional</option>}

                                        {t.d===t.Clubs ? <option value={t.Clubs} selected>Clubs</option>
                                        :<option value={t.Clubs}>Clubs</option>}

                                        {t.d===t.Sports ? <option value={t.Sports} selected>Sports</option>
                                        :<option value={t.Sports}>Sports</option>}

                                        {t.d===t.Science ? <option value={t.Science} selected>Science</option>
                                        :<option value={t.Science}>Science</option>}

                                    </select>
                                    
                            })}
                        </label>
                    <center><button type="submit">Update</button></center>
        </form>
        
        <Link onClick={handleDelete} className="line" to="#">Delete Ep</Link>
    </div>
  )
}
