import React from 'react';
import Front_Story1 from "../../Static/Images/Front_Story1.jfif"
import Front_Story2 from "../../Static/Images/Front_Story2.jpg"
import Front_Story3 from "../../Static/Images/Front_Story3.jpg"
import Front_Story4 from "../../Static/Images/Front_Story4.jpg"


const HomeStory = () => {
  return (
    <div className="container">

      {/* ----------------- Left Part ----------------- */}
      <div className="left-column">
        <h1><br/><br/>Our Story</h1>
        <h2>It all began with one woman</h2><br/>
        <div className="left-text">In 2005, while attending a talk about the Genocide against the Tutsi in Rwanda, Anne Heyman learned that the country had 1.2 million orphans. Without a systemic solution to support the well-being and development of Rwanda’s vast orphan population, many were being left behind.</div><br/><br/>

        <div className="image-container">
          <div className="image-wrapper top-left">
            <img src={Front_Story1} alt="Image 1" />
          </div>
          <div className="image-wrapper bottom-right">
            <img src={Front_Story2} alt="Image 2" />
          </div>
        </div>
      </div>
      <div className="spacer"></div>


      {/* ----------------- Right Part ----------------- */}
      <div className="right-column">
        <br/><br/><br/>
        <div className="image-container">
          <div className="image-wrapper top-right">
            <img src={Front_Story3} alt="Image 3" />
          </div>
          <div className="image-wrapper bottom-left">
            <img src={Front_Story4} alt="Image 4" />
          </div>
        </div>
        <div className="right-text">Anne recognized that to address their orphan crisis following the Holocaust, Israel built residential communities that ensured the orphans’ safety, security, and development. Anne was inspired to bring this model to Rwanda. From there, thanks to Anne’s perseverance, the Agahozo-Shalom Youth Village was founded.
                              In 2008, ASYV opened its gates to the first class of 128 students.</div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* ---------------------------CSS----------------------------- */}
      <style>{`
        .container {
          display: flex;
          margin-left: 5%;
          margin-right: 5%;
        }

        .left-column,
        .right-column {
          flex-basis: 48%;
        }

        .spacer {
          flex-basis: 6%;
        }

        .left-column h2 {
          color: #F0A459;
        }

        .left-text {
          font-size: 14px;
          line-height: 21px;
          text-align: left;
          border-left: 6px solid #F49D47;
          padding-left: 10px;
        }

        .right-text {
          font-size: 14px;
          line-height: 21px;
          text-align: left;
          border-right: 6px solid #F49D47;
          padding-right: 10px;
        }

        .image-container {
          position: relative;
          height: 300px;
          margin-bottom: 20px;
        }

        .image-wrapper {
          position: absolute;
          width: 280px;
          height: 170px;
          overflow: hidden;
        }

        .image-wrapper img {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5%;
        }

        .top-left {
          top: 0;
          left: 0;
        }

        .bottom-right {
          bottom: 0;
          right: 0;
        }

        .top-right {
          top: 0;
          right: 0;
        }

        .bottom-left {
          bottom: 0;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default HomeStory;
