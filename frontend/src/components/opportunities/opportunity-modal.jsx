import React from "react";
import "./opportunity-modal.css";

const OpportunityModal = ({ opportunity, onClose, onSupportRequest }) => {
  if (!opportunity) return null;

  const handleApplyClick = () => {
    if (opportunity.link) {
      window.open(opportunity.link, "_blank");
    }
  };

  const handleSupportClick = () => {
    if (onSupportRequest) {
      onSupportRequest(opportunity);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{opportunity.title}</h2>
        <p><strong>Company:</strong> {opportunity.organization}</p>
        <p><strong>Description:</strong> {opportunity.description}</p>
        <p><strong>Deadline:</strong> {opportunity.deadline}</p>
        <p><strong>Location:</strong> {opportunity.location}</p>

        <div className="modal-buttons">
          <button onClick={handleApplyClick}>Apply</button>
          <button className="support" onClick={handleSupportClick}>Request CRC Support</button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityModal;
