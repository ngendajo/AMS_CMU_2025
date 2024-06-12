import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback } from 'react';
import React, {useState, useEffect} from 'react';
import axios from "axios";
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../api/baseUrl';

export default function Schedule() {
    const [data, setData] = useState([]);
    let {auth}= useAuth() 
    var eventlist=[]
    const navigate=useNavigate();

  const localizer = momentLocalizer(moment)

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title+"\n"+event.desc),
    []
  )

  useEffect(() =>{
    const fetchEvents = async () => {
      try {
        const response = await axios.get(baseUrl+'/event/',{
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'multipart/form-data'
            },
          withCredentials:true
        });
        response.data.forEach(e=>{
          eventlist.push({
          id:e.id,
          title:e.title,
          start: new Date(e.startDate),
          end: new Date(e.endDate),
          desc: e.description
          })
        })
        setData(eventlist);
      } catch (error) {
        console.log(error);
        navigate('/error');
      }
    };
    fetchEvents();
  },[auth])

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  )
}
