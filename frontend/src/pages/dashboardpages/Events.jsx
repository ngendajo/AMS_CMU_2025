import '../EventCards.css'
import React, {useState, useEffect} from 'react'
import useAuth from '../../hooks/useAuth';
import axios from "axios";

export default function Events() {

  const [data, setData] = useState([]);
    let {auth}= useAuth() 

    
    useEffect(() =>{
    
        const getData = async () =>{
            try{
                const response = await axios.get('http://127.0.0.1:8000/api/event/',{
                    headers: {
                        "Authorization": 'Bearer ' + String(auth.accessToken),
                        "Content-Type": 'multipart/form-data'
                    },
                    withCredentials:true
                });
                var eventlist=[]
                response.data.forEach(e=>{
                
                eventlist.push({
                    title:e.title, 
                    description:e.description,
                    startDate:e.startDate,
                    image_url:e.image_url
                })
                })
                setData(eventlist)
            }catch(err) {
                console.log(err);
            }
        }
    
        getData();
    
    },[auth])

  
  function Card(events) {
    const [isClicked, setIsClicked] = useState(false);
    function handleClick() {
      setIsClicked(!isClicked);
      
    }
    return (
      <div className={`card ${isClicked ? "clicked" : ""}`} onClick={handleClick} >
        <h2>{events.title}</h2>
        <p>{events.description}</p>
        <div className="imageContainer">
          <img src={"http://localhost:8000"+events.image_url}  alt='' width={75} height={75} ></img>
        </div>
      </div>
    );
  }


  return (
    
    <div className="card-list">
      {data.map((item, index) => (
        <Card key={index} title={item.title} description={item.description} image_url={item.image_url} />
      ))}
    </div>


  )
}
