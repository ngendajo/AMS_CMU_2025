import '../EventCards.css'
import React, {useState, useEffect} from 'react'
import useAuth from '../../hooks/useAuth';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { Link, useNavigate } from "react-router-dom";

import styled from 'styled-components';

// You can style your pagination component
// thanks to styled-components.
// Use inner class names to style the controls.
const MyPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: 'active', // default to "selected"
})`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style-type: none;
  padding: 0 5rem;
  heights: 100%;

  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    border: gray 1px solid;
    cursor: pointer;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

export default function Events() {

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
  }

    
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
                    id:e.id,
                    image_url:e.image_url,
                    startDate:e.startDate,
                    endDate:e.endDate
                })
                })
                setData(eventlist)
            }catch(err) {
                console.log(err);
            }
        }
    
        getData();
    
    },[auth])

  function CardSmall(events) {
    var sDate=formatDateTime(new Date(events.startDate));
    const [isClicked, setIsClicked] = useState(false);
    
    function handleClick() {
        console.log(events);
        setIsClicked(!isClicked);
        navigate('/event/'+events.id);
    }

    return (
      <div className={`card ${isClicked ? "clicked" : ""}`} onClick={handleClick} >
        <div className="imageContainer">
          <img src={"http://localhost:8000"+events.image_url}  alt='' width={75} height={75} ></img>
        </div>
        <h2>{events.title}</h2>
        <p>{events.description}</p>
        <p>{sDate}</p>
       <Link to={"/event/"+events.id} className='link'>Event Detail</Link>
      </div>
    );
  }

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + 6;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentEvents = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / 6);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <div className="listWithPage">
        <center><Link to={'/add-event/'} className='new-event'>Add a New Event</Link></center>
    <div className="card-list">
      {currentEvents.map((item, index) => (
        <div className="CardSmall">
        <CardSmall key={index} id={item.id} title={item.title} startDate={item.startDate} description={item.description} image_url={item.image_url} />
        </div>
      ))}
    </div>

    <MyPaginate
    breakLabel="..."
    nextLabel="next >"
    onPageChange={handlePageClick}
    pageRangeDisplayed={5}
    pageCount={pageCount}
    previousLabel="< previous"
    renderOnZeroPageCount={null}
    />
    </div>
  )
}
