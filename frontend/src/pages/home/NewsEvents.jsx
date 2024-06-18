import { React, useState, useEffect } from "react"
import './Home.css'
import HomeHeaderNews from '../../components/home/home_header_news'
import HomeBannerNews from '../../components/home/home_banner_news'
import { News } from "../../components/home/home_news";
import HomeFooter from '../../components/home/home_footer'
import LoginPopUp from '../../components/home/login_pop_up'

import placeholder1 from '../../static/images/gallery1.jpg'
import placeholder2 from '../../static/images/gallery2.jpg'
import placeholder3 from '../../static/images/gallery3.jpg'

const NewsEvents = () => {

  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginPopup = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#top2') {
        const element = document.getElementById('top2');
        if (element) {
            element.scrollIntoView();
        }
    }
}, []);

  return (
    <div id="top2">
      {/* 1. header: */}
      <HomeHeaderNews onLoginClick={toggleLoginPopup}/>

      {/* 2. banner: */}
      <HomeBannerNews/>

      {/* 3. news: */}
      <div className="cards">
        <div className="cards-wrapper">
            <News
                imgSrc={placeholder1}
                imgAlt="image1"
                description="Honoring the 30th Commemoration of the 1994 Genocide Against the Tutsi"
                date="Apr 30, 2024"
                link="card1"
            />
            <News
                imgSrc={placeholder2}
                imgAlt="image2"
                description="On the 10th Anniversary of Anne Heyman's Passing"
                date="Jan 31, 2024"
                link="card2"
            />
            <News
                imgSrc={placeholder3}
                imgAlt="image3"
                description="An ASYV Kid Launches Rwanda's First Sign Language Club"
                date="Feb 29, 2024"
                link="card3"
            />
        </div>
      </div>
      
      {/* 4. footer: */}
      <HomeFooter/>

      {/* 5. login: */}
      <LoginPopUp showLogin={showLogin} toggleLoginPopup={toggleLoginPopup}/>
      
    </div>
  );
};

export default NewsEvents;