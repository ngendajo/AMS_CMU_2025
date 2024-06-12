import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';

// Define NewsCard
const NewsCard = ({ imageSrc, title, description, time }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const cardStyle = {
    position: 'relative',
    width: '22%',
    marginBottom: '55px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const imageStyle = {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
  };

  const titleStyle = {
    fontSize: '17px',
    marginBottom: '7px',
  };

  const descriptionStyle = {
    fontSize: '14px',
    marginBottom: '10px',
  };

  const timeStyle = {
    fontSize: '12px',
    color: '#888',
  };

  const showButtonStyle = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const options = { timeZone: 'Africa/Nairobi' };
    return dateObject.toLocaleDateString('en-US', options);
  };


  return (
    <div style={cardStyle}>
      <img src={imageSrc} alt={title} style={imageStyle} />
      <div style={{ marginTop: '10px' }}>
        <h2 style={titleStyle}>{title}</h2>
        <p style={descriptionStyle}>
          {description.substring(0, 75) + '...'}
        </p>
        <span style={timeStyle}>{formatDate(time)}</span>
        <button onClick={() => setShowFullDescription(true)} style={showButtonStyle}>
           →
        </button>
      </div>
      {showFullDescription && (
        <div
          style={{
            position: 'absolute',
            top: '2/5',
            left: '25%',
            width: '200px',
            backgroundColor: '#aaaaaa',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p style={{ fontSize: '14px', color: 'white', lineHeight: '1.5' }}>
            {description}
          </p>
          <button onClick={() => setShowFullDescription(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

// Frontpage news
const HomeNews = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    // Fetch News data from the backend
    axios.get(baseUrl+'/news/')
      .then(response => {
        console.log(response.data);
        setNewsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching News data:', error);
      });
  }, []);

  // Separate pinned news and the latest news
  console.log(newsData)
  const pinnedNews = Array.isArray(newsData)?newsData.filter((news) => news.pinned):[];
  const notPinnedNews = Array.isArray(newsData)?newsData.filter((news) => !news.pinned):[];
  notPinnedNews.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date in descending order

  // Combine pinned news and the latest news
  const allOrderedNews = [...pinnedNews, ...notPinnedNews];
  const displayNews = allOrderedNews.slice(0, 4); // display in front page

  return (
    <div id='news'>
      {/* ----------- Page Title ----------- */}
      <h1
        style={{
          fontSize: '23px',
          fontWeight: 'bold',
          color: 'orange',
          marginLeft: '6%',
          marginTop: '31px',
          marginBottom: '17px',
        }}
      >
        Latest News
      </h1>

      {/* -------------- Cards -------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 6%', flexWrap: 'wrap',}}>
        {displayNews.map((news) => (
          <NewsCard
            key={news.id}
            imageSrc={`${baseUrlforImg+news.image_url}`}
            title={news.title}
            description={news.description}
            time={news.date}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeNews;
