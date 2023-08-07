
import React, {useState, useEffect} from 'react'
import useAuth from '../../hooks/useAuth';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './eventdetail.css';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';

export default function EventDetail() {

  const [data, setData] = useState([]);
  let {auth}= useAuth() 
  const navigate = useNavigate();
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const params = useParams();
    
  useEffect(() =>{
      const getData = async () =>{
          try{
              const response = await axios.get(baseUrl+'/event/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              console.log(response.data);
              var eventlist=[]
              response.data.forEach(e=>{
              eventlist.push({
                  id:e.id,
                  title:e.title, 
                  description:e.description,
                  startDate:e.startDate,
                  endDate:e.endDate,
                  image_url:e.image_url
              })
              })
              setData(eventlist[0])
              console.log(data);
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
      getData();
  },[auth])

  function Card(events) {
    
    var sDate=formatDateTime(new Date(events.startDate));
    var eDate=formatDateTime(new Date(events.endDate));

    return (
      <div className='cardComponenet'>
        <div className="imageContainer">
          <img src={baseUrlforImg+events.image_url}  alt='' width={175} height={175} ></img>
        </div>
        <h2>{events.title}</h2>
        <p>{events.description}</p>
        <p>{sDate}</p>
        <p>{eDate}</p>
      </div>
    );
  }

  return (
    <div className="listWithPage">
        {auth.user.is_alumni?
         null: <center><Link to={'/edit-event/'+params.id} className='new-event'>Edit/Delete Event</Link></center>
        }
        <center><div className="card">
        <Card id={data.id} title={data.title} startDate={data.startDate} endDate={data.endDate} description={data.description} image_url={data.image_url} />
    </div></center>
    </div>
    
  )
}
