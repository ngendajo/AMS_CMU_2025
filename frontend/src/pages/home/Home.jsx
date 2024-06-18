import { React, useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import './Home.css'
import HomeHeader from '../../components/home/home_header'
import HomeBanner from '../../components/home/home_banner'
import GalleryCarousel from "../../components/home/home_gallery"
import GenderChart from '../../components/home/home_gender'
import CombinationChart from '../../components/home/home_combination'
import { News } from "../../components/home/home_news"
import { Alumni } from "../../components/home/home_alumni"
import HomeFooter from '../../components/home/home_footer'
import LoginPopUp from '../../components/home/login_pop_up'
import GalleryCarousel from "../../components/home/gallery";

import placeholder1 from '../../static/images/gallery1.jpg'
import placeholder2 from '../../static/images/gallery2.jpg'
import placeholder3 from '../../static/images/gallery3.jpg'

export default function Home() {

    const females = 853;
    const males = 511;
    
    const hgl = 123;
    const mce = 456;
    const meg = 789;
    const mpc = 234;
    const pcb = 567;
    
    const [showLogin, setShowLogin] = useState(false);

    const toggleLoginPopup = () => {
        setShowLogin(!showLogin);
    };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#top1') {
            const element = document.getElementById('top1');
            if (element) {
                element.scrollIntoView();
            }
        }
    }, []);

    return (
    <div id="top1">
        {/* 1. header: */}
        <HomeHeader onLoginClick={toggleLoginPopup}/>
        
        {/* 2. banner: */}
        <HomeBanner/>
        
        {/* 3. gallery: */}
        <div className="gallery">
        <GalleryCarousel />
            <div className="GalleryText">
                <p>At <span className="GalleryBold">Liquidnet Family High School</span>, education extends beyond graduation. LFHS provides alumni with programs and resources to support them at every stage of their careers.</p>
                <a href="https://www.asyv.org/our-alumni" target="_blank" rel="noopener noreferrer">
                    <button>Learn More</button>
                </a>
            </div> 
        </div>
        
        {/* 4. gender: */}
        {/* 5. combination: */}
        <div className="charts">
            <GenderChart females={females} males={males} />
            <CombinationChart hgl={hgl} mce={mce} meg={meg} mpc={mpc} pcb={pcb} />
            <div className="Mission">
                <p>Through healing, education, and love, the Agahozo-Shalom Youth Village empowers orphaned and vulnerable Rwandan youth to build lives of dignity and contribute to a better world.</p>
            </div>
        </div>

<<<<<<< HEAD
        {/* 6. news: */}
=======
        {/* 4. gallery: */}
        <div className="gallery">
        <GalleryCarousel />
        <div className="GalleryText">
                <p>Liquidnet Family High School education doesn't end after graduation. 
                    LFHS offers programs & resources to alumni at every phase of their career.</p>  </div>
                    <button className="learn-more-button">Learn More</button>
           
        </div>
     

        {/* 5. news: */}
>>>>>>> d82cbe35f1a2fb35432879ab9b2a2b3cf3f6d133
        <div className="cards">
            <section className="cards-title">
                <h1>NEWS & EVENTS</h1>
                <p>Stay Updated with the Latest News and Upcoming Events</p>
            </section>
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
            <div class="view-button-news">
                <Link to="/news_and_events#top2" className="ViewMore">View More</Link>
            </div>
        </div>

        {/* 7. alumni: */}
        <div className="cards">
            <section className="cards-title">
                <h1>ALUMNI STORIES</h1>
                <p>Discover the Inspiring Journeys of Our Alumni</p>
            </section>
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
            <div class="view-button-alumni">
                <Link to="/alumni_stories#top3" className="ViewMore">View More</Link>
            </div>
        </div>

        {/* 8. footer: */}
        <HomeFooter/>

        {/* 9. login: */}
        <LoginPopUp showLogin={showLogin} toggleLoginPopup={toggleLoginPopup}/>
        
    </div>
  )
}
