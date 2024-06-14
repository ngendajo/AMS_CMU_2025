import React, { useState } from "react";
import "./News.css";

export const News = ({
  imgSrc,
  imgAlt,
  description,
  date,
  link
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
    <div className="News-card-container">
      
      {imgSrc && link && (
        <a href={link} className="News-card-link" onHover= {openModal}>
        {  <img src={imgSrc} alt={imgAlt} className="News-card-img" />}
        </a>
      )}


      {description && <p className="News-card-description">{description}</p>}
      {date && <p className="News-card-btn">{date}</p>}

      {isModalOpen && (
        <div id="myModal" className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" id="img01" src={imgSrc} alt={imgAlt} />
          <div id="caption">{description}</div>
        </div>
      )}
    </div>
  );
};
