import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../components/DashboardComponents/Newspart/News.css';


const NewsCard = ({ imageSrc, title, description, time }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const options = { timeZone: 'Africa/Nairobi' };
    return dateObject.toLocaleDateString('en-US', options);
  };

  return (
    <div className="news-card">
      <img src={imageSrc} alt={title} />
      <div className="news-content">
        <h2>{title}</h2>
        <p>{description.substring(0, 75) + '...'}</p>
        <span>{formatDate(time)}</span>
        <button onClick={() => setShowFullDescription(true)}>→</button>
        {showFullDescription && (
          <div className="description-box">
            <p>{description}</p>
            <button onClick={() => setShowFullDescription(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

const News = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/news/')
      .then(response => {
        console.log(response.data);
        setNewsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching News data:', error);
      });
  }, []);


  return (
    <div className="news-container">
      {newsData.map((news) => (
        <NewsCard
          key={news.id}
          imageSrc={`http://localhost:8000${news.image_url}`}
          title={news.title}
          description={news.description}
          time={news.date}
        />
      ))}
    </div>
  );
};


export default News;
