import React from "react";
import "./tabbed-card-page.css";

const TabbedCardPage = ({
  tabs = [],
  activeTab,
  setActiveTab,
  renderCards,
  renderFinalTab,
  showCreateButton = false,
  onCreateClick
}) => {
  const handleSelectChange = (e) => {
    setActiveTab(e.target.value);
  };

  const content = activeTab === "Support Requests" ? renderFinalTab() : renderCards();

  return (
    <div className="opportunity-page">
      <div className="tabs-container">
        {/* Desktop Tabs */}
        <div className="tabs desktop-tabs">
          {tabs.filter(tab => tab !== "Support Requests").map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "active" : ""}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="tabs mobile-tabs">
          <select value={activeTab} onChange={handleSelectChange}>
            {tabs.filter(tab => tab !== "Support Requests").map(tab => (
              <option key={tab} value={tab}>{tab}</option>
            ))}
          </select>
        </div>

        {/* Always Show Support Requests Button */}
        <button
          className={`support-tab ${activeTab === "Support Requests" ? "active" : ""}`}
          onClick={() => setActiveTab("Support Requests")}
        >
          Support Requests
        </button>
      </div>

      {showCreateButton && activeTab !== "Support Requests" && (
        <button className="create-new-button" onClick={onCreateClick}>
          Create Draft
        </button>
      )}

      <div className="opportunity-cards-container">
        {content}
      </div>
    </div>
  );
};

export default TabbedCardPage;
