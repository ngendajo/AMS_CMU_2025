import { React, useState, useEffect } from 'react';
import baseUrl from '../../api/baseUrl';
import baseUrlforImg from '../../api/baseUrlforImg';

const staticStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '60px',
    paddingRight: '60px',
  },

  title: {
    color: 'green',
    fontSize: '25px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '10px', // Add spacing between title and top of the page
  },

  // ---------------- middle ----------------
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '295px',
  },

  centerCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    //backgroundImage: `url(${imageData[currentIndex].image_url})`,
    //backgroundSize: 'cover', // Adjust the background size
    //backgroundPosition: 'center',
    margin: '12px',
  },

  textStyle: {
    maxWidth: '37%',
    fontSize: '14px',
    lineHeight: '21px',
    textAlign: 'justify',
  },

  leftArrow: {
    position: 'absolute',
    left: '26%',
    //top: '50%',
    transform: 'translateY(310%)',
    cursor: 'pointer',
    fontSize: '30px',
  },

  rightArrow: {
    position: 'absolute',
    right: '26%',
    //top: '50%',
    transform: 'translateY(310%)',
    cursor: 'pointer',
    fontSize: '30px',
  },

  // ------------- left and right sides-------------
  triangleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'relative', // enable absolute positioning
  },
};


// This is generate random index for image, so as to avoid repetition in images
const getUniqueRandomIndices = (length, num) => {
  const indices = Array.from({ length }, (_, i) => i);
  const result = [];

  for(let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * indices.length);
    result.push(indices[randomIndex]);
    indices.splice(randomIndex, 1);
  }

  return result;
}

// This is to random generate image from database
const getDynamicStyles = (imageData) => {
  const randomIndices = getUniqueRandomIndices(imageData.length, 6);

  return {
    topImageL: {
      width: '75px',
      height: '75px',
      borderRadius: '50%',
      backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[0]].image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginBottom: '20px',
    },

    topImageR: {
    width: '75px',
    height: '75px',
    borderRadius: '50%',
    backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[1]].image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: '20px',
  },

  middleImageL: {
    width: '65px',
    height: '65px',
    borderRadius: '70%',
    backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[2]].image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute', // Use absolute positioning to overlap
    top: 'calc(50% - 25px)', // Position the middle image in the middle vertically
    left: 'calc(50% - 25px + 80px)',
  },

  middleImageR: {
    width: '65px',
    height: '65px',
    borderRadius: '70%',
    backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[3]].image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute', // Use absolute positioning to overlap
    top: 'calc(50% - 25px)', // Position the middle image in the middle vertically
    right: 'calc(50% - 25px + 80px)',
  },

  bottomImageL: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[4]].image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginTop: '40px',
    top: 'calc(50% - 45px)',
  },

  bottomImageR: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundImage: `url(${baseUrlforImg+imageData[randomIndices[5]].image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginTop: '40px',
    top: 'calc(50% - 45px)',
  },

  };
};


// this is to remove HTML element in the story
const getDescriptionText = (description) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = description;
  return tempDiv.textContent || tempDiv.innerText;
};

const HomeAlumni = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageData, setImageData] = useState([]);
//  const dynamicStyles = getDynamicStyles(imageData);
//  const styles = { ...staticStyles, ...dynamicStyles };

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch(baseUrl+'/storyhomeview/');
        const data = await response.json();
        setImageData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchImageData();
  }, []);


  if (imageData.length < 6) {
    // render loading state (need at least 6 alumni images)
    return <p>Loading...</p>;
  }

  const dynamicStyles = getDynamicStyles(imageData);
  const styles = { ...staticStyles, ...dynamicStyles };

  const handleLeftArrowClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? imageData.length - 1 : prevIndex - 1));
  };

  const handleRightArrowClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === imageData.length - 1 ? 0 : prevIndex + 1));
  };


  return (
    <div>
      <h2 style={{ color: 'orange', textAlign: 'center', marginTop: '32px' }}>SUCCESS STORIES</h2>
      <h1 style={styles.title}>Learn From Our Alumni </h1>
      <div style={styles.container}>
        <div style={styles.triangleContainer}>
          <div style={styles.topImageL} />
          <div style={styles.middleImageL} />
          <div style={styles.bottomImageL} />
        </div>


        <div style={styles.centerContent}>
          <div style={styles.leftArrow} onClick={handleLeftArrowClick}>{'<'}</div>

          <div style={styles.centerCircle}>
            <img src={`${baseUrlforImg+imageData[currentIndex].image_url}`} alt="" style={{ borderRadius: '50%', width: '100%', height: '100%' }} />
          </div>

          <div style={styles.rightArrow} onClick={handleRightArrowClick}>{'>'}</div>

          <p style={{...styles.textStyle, fontWeight: 'bold'}}>
            {`${imageData[currentIndex].first_name} ${imageData[currentIndex].last_name}`}
          </p><br/>

          <p style={styles.textStyle}>
            {getDescriptionText(imageData[currentIndex].description)}
          </p>
        </div>


        <div style={styles.triangleContainer}>
          <div style={styles.topImageR} />
          <div style={styles.middleImageR} />
          <div style={styles.bottomImageR} />
        </div>
      </div>
    </div>
  );
};

export default HomeAlumni;

