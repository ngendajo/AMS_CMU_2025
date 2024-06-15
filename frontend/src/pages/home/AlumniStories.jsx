import { React, useState } from "react"
import './Home.css'
import HomeHeaderAlumni from '../../components/home/home_header_alumni'
import HomeBannerAlumni from '../../components/home/home_banner_alumni'
import { Alumni } from "../../components/home/home_alumni";
import HomeFooter from '../../components/home/home_footer'
import LoginPopUp from '../../components/home/login_pop_up'

const AlumniStories = () => {

  const [showLogin, setShowLogin] = useState(false);

  const toggleLoginPopup = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      {/* 1. header: */}
      <HomeHeaderAlumni onLoginClick={toggleLoginPopup}/>

      {/* 2. banner: */}
      <HomeBannerAlumni/>

      {/* 3. alumni: */}
      <div className="cards">
        <div className="cards-wrapper">
            <Alumni
                imgSrc="https://www.colorhexa.com/957967.png"
                imgAlt="image1"
                title="A Story of Transformation"
                description="Salem Isezerano '23"
                buttonText="READ MORE"
                link="card1"
            />
            <Alumni
                imgSrc="https://www.colorhexa.com/957967.png"
                imgAlt="image2"
                title="Anne's Vision for Me, and All of Rwanda"
                description="Emmanuel Nkundunkundiye '12"
                buttonText="READ MORE"
                link="card2"
            />
            <Alumni
                imgSrc="https://www.colorhexa.com/957967.png"
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