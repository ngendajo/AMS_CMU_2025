
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function EditEvent() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate]=useState(null);
    const [endDate, setEndDate]=useState(null);
    const navigate = useNavigate();
    let {auth}= useAuth();
    const params = useParams();


    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

    const handleDelete = () => {
        
        axios.delete('http://127.0.0.1:8000/api/deleteevent/'+params.id+"/",
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        ).then(res =>{
            console.log(res)
            navigate('/events')
        })
      };

    let updateep = (e)=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/updateevent/'+params.id+"/", {
            'title':title,
            'description':description
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        navigate('/events')
    })
    .catch(error => console.log(error))
       
    }
    useEffect(() =>{
    
        const getEvent = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/event/?id='+params.id,{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                let data=response.data;
                setTitle(data[0].title);
                setDescription(data[0].description)
                var sDate=new Date(data[0].startDate)
                var eDate= new Date(data[0].endDate)
                setStartDate(formatDateTime(sDate))
                setEndDate(formatDateTime(eDate))
            }catch(err) {
                console.log(err);
                navigate('/error');
            }
        }
    
        getEvent();
    
    },[auth,params])
  return (
    <div className='alumni-list-body'>
        <p>
            <Link className="line" to="/events">Go back</Link>
        </p>
        <center><h1>Update Event form</h1></center>
            <form onSubmit={updateep} className='form-element'>
                      <div className="event-info"></div>  
                        <label> 
                            Event title:
                            <input 
                            type="text" name="title" value={title} placeholder="Enter title"
                            onChange={event => setTitle(event.target.value)}
                            />
                            
                        </label> 
                        <label> 
                            Event description:
                            <input 
                            type="text" name="description" value={description} placeholder="Enter Description"
                            onChange={event => setDescription(event.target.value)}
                            />
                            
                        </label> 
                        <label>
                            Start Date
                            <input type="datetime-local" name="startDate" value={startDate} onChange={event=>setStartDate(event.target.value)} />
                        </label>
                        <label>
                            End Date
                            <input type="datetime-local" name="endDate" value={endDate} onChange={event=>setEndDate(event.target.value)}/>
                        </label>


                    <center><button type="submit">Update</button></center>
        </form>
        
        <Link onClick={handleDelete} className="line" to="#">Delete Event</Link>
    </div>
  )
}
