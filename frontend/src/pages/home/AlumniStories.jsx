import { React, useState, useEffect } from "react"
import './Home.css'
import HomeHeaderAlumni from '../../components/home/home_header_alumni'
import HomeBannerAlumni from '../../components/home/home_banner_alumni'
import { Alumni } from "../../components/home/home_alumni";
import HomeFooter from '../../components/home/home_footer'
import LoginPopUp from '../../components/home/login_pop_up'

import placeholder1 from '../../static/images/gallery1.jpg'
import placeholder2 from '../../static/images/gallery2.jpg'
import placeholder3 from '../../static/images/gallery3.jpg'

const AlumniStories = () => {

  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginPopup = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#top3') {
        const element = document.getElementById('top3');
        if (element) {
            element.scrollIntoView();
        }
    }
}, []);

  return (
    <div id="top3">
      {/* 1. header: */}
      <HomeHeaderAlumni onLoginClick={toggleLoginPopup}/>

      {/* 2. banner: */}
      <HomeBannerAlumni/>

      {/* 3. alumni: */}
      <div className="cards">
        <div className="cards-wrapper">
            <Alumni
                imgSrc={placeholder1}
                imgAlt="image1"
                title="A Story of Transformation"
                description="Salem Isezerano '23"
                buttonText="READ MORE"
                link="card1"
            />
            <Alumni
                imgSrc={placeholder2}
                imgAlt="image2"
                title="Anne's Vision for Me, and All of Rwanda"
                description="Emmanuel Nkundunkundiye '12"
                buttonText="READ MORE"
                link="card2"
            />
            <Alumni
                imgSrc={placeholder3}
                imgAlt="image3"
                title="What ASYV Means to Me"
                description="Pacifique Rutamu '13"
                buttonText="READ MORE"
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

export default AlumniStories;