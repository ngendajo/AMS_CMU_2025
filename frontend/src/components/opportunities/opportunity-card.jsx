import React from "react";
import "./opportunity-card.css";

const OpportunityCard = ({
  title,
  description,
  date,
  location,
  link,
  renderActions
}) => {
  return (
    <div className="opportunity-card">
      <div className="card-header"><p>{title}</p></div>
      <p className="card-description">{description}</p>
      {location && <p className="card-meta">Location: {location}</p>}
      {date && <p className="card-meta">Apply by: {date}</p>}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          View Details
        </a>
      )}
      <div className="card-actions">
        {renderActions && renderActions()}
      </div>
    </div>
  );
};

export default OpportunityCard;
