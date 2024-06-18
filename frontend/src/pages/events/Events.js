import React from 'react';
import { Link } from 'react-router-dom';
import { News } from '../../components/News';
import './Events.css';
import image from "../../static/images/events.jpg"


const Events = () => {
  
  return (
    <div>
      <div className="EventsContainer">
      <Link to="/calendar" className="calendar-view-button">Calendar View</Link>
        <div className="cards">
          <div className="CardsWrapper">
            <News
              className="NewsCard"
              imgSrc={image}
              imgAlt="image1"
              description="Honoring the 30th Commemoration of the 1994 Genocide Against the Tutsi"
              date="Apr 30, 2024"
              link="card1"
            />
            <News
              className="NewsCard"
              imgSrc={image}
              imgAlt="image2"
              description="On the 10th Anniversary of Anne Heyman's Passing"
              date="Jan 31, 2024"
              link="card2"
            />
            <News
              className="NewsCard"
              imgSrc={image}
              imgAlt="image3"
              description="An ASYV Kid Launches Rwanda's First Sign Language Club"
              date="Feb 29, 2024"
              link="card3"
            />
                <News
              className="NewsCard"
              imgSrc={image}
              imgAlt="image4"
              description="An ASYV Kid Launches Rwanda's First Sign Language Club"
              date="Feb 29, 2024"
              link="card3"
            />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Events;
