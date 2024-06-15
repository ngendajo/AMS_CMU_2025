
import React, { useState } from "react";
import "./Dashboard-card.css";


export const DashboardCard = ({
  imgSrc,
  imgAlt,
  buttonText,

  link,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="Dash-card-container">
      {imgSrc && imgAlt && (
        <img src={imgSrc} alt={imgAlt} className="Dash-card-img"  onHover= {openModal} />
      )}
       
      {buttonText && link && (
        <a href={link} className="Dash-card-btn">
          {buttonText}
        </a>
      )}
      {isModalOpen && (
        <div id="myModal" className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" id="img01" src={imgSrc} alt={imgAlt} />
        
        </div>
      )}
    </div>
  );
};
