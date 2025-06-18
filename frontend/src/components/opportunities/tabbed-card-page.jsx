import React, { useState, useEffect } from "react";
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
  const [prevTab, setPrevTab] = useState(tabs[0]);

  // Track last non-support tab to return from Support Requests
  useEffect(() => {
    if (activeTab !== "Support Requests") {
      setPrevTab(activeTab);
    }
  }, [activeTab]);

  const handleSelectChange = (e) => {
    setActiveTab(e.target.value);
  };

  const content = activeTab === "Support Requests"
    ? renderFinalTab()
    : renderCards();

  return (
    <div className="opportunity-page">
      <div className="tabs-container">
        {/* Desktop Tabs */}
        <div className="tabs desktop-tabs">
          {tabs.filter(tab => tab !== "Support Requests").map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
          <button
            className={`tab-button ${activeTab === "Support Requests" ? "active" : ""}`}
            onClick={() => setActiveTab("Support Requests")}
          >
            Support Requests
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="mobile-tabs">
          {activeTab !== "Support Requests" ? (
            <div className="mobile-tab-controls-row">
              <button
                className="support-tab"
                onClick={() => setActiveTab("Support Requests")}
              >
                Support Requests
              </button>
              <select value={activeTab} onChange={handleSelectChange}>
                {tabs.filter(tab => tab !== "Support Requests").map(tab => (
                  <option key={tab} value={tab}>{tab}</option>
                ))}
              </select>
            </div>
          ) : (
            <button
              className="back-tab-button"
              onClick={() => setActiveTab(prevTab)}
            >
              ← Back to {prevTab}
            </button>
          )}
        </div>


      </div>

      {showCreateButton && activeTab !== "Support Requests" && (
        <button className="create-new-button" onClick={onCreateClick}>
          Create Draft
        </button>
      )}

      {activeTab === "Support Requests" ? (
        <div className="support-requests-container">
          {content}
        </div>
      ) : (
        <div className="opportunity-cards-container">
          {content}
        </div>
      )}
    </div>
  );
};

export default TabbedCardPage;
