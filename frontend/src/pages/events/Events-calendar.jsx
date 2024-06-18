import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import './Events.css';
import image from "../../static/images/events.jpg"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Events-calendar.css';


const EventsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState([
    {
      id: 1,
      date: '2024-04-30',
      title: 'Alumni Graduation Celebration of Ingaji Grade',
      description: 'Details about the event...',
      link: '/events/1'
    },
    {
      id: 2,
      date: '2024-01-31',
      title: "ASYV Graduates Reunion: Alumni Day",
      description: 'Details about the event...',
      link: '/events/2'
    },
    {
      id: 3,
      date: '2024-02-29',
      title: 'An ASYV Kid Launches Rwanda\'s First Sign Language Club',
      description: 'Details about the event...',
      link: '/events/3'
    },
    {
      id: 4,
      date: '2024-02-29',
      title: 'Another event on the same date',
      description: 'Details about another event...',
      link: '/events/4'
    }
  ]);

  const onDateChange = date => {
    setSelectedDate(date);
  };

  const eventsOnSelectedDate = events.filter(
    event => event.date === selectedDate.toISOString().slice(0, 10)
  );

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().slice(0, 10);
      if (events.find(event => event.date === formattedDate)) {
        return 'highlight';
      }
    }
    return null;
  };

  return (
    <div >
      <div className="below-header">
      <Link to="/events" className="card-view">Card View</Link>
      </div>
      <div className="EventsCalendarContainer">
        <div className="calendar-side">
          <Calendar
            onChange={onDateChange}
            value={selectedDate}
            tileClassName={tileClassName}
          />
        </div>
        <div className="events-side">
          {eventsOnSelectedDate.length > 0 ? (
            eventsOnSelectedDate.map(event => (
              <div key={event.id} className="event-card">
                <img src={image} alt={event.title} className="event-image" />
                <div className="event-details">
                  <div className='title'>{event.title}</div>
                  <p>{event.description}</p>
                  <p>{event.date}</p>
                  <a href={event.link}>Read More</a>
                </div>
              </div>
            ))
          ) : (
            <p>No events on this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;