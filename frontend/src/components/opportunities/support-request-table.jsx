import React from "react";
import "./support-request-table.css";

const SupportRequestTable = ({ requests }) => {
  const hasRequests = requests && requests.length > 0;

  return (
    <div className="requests-wrapper">
      {/* Desktop Table View */}
      <div className="requests-table">
        {hasRequests ? (
          <table>
            <thead>
              <tr>
                <th>Opportunity Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Requested At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={idx}>
                  <td>{req.title}</td>
                  <td>{req.company || "N/A"}</td>
                  <td>{req.type}</td>
                  <td>{req.timestamp}</td>
                  <td>{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-requests-message">No support requests yet.</div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="requests-mobile">
        {hasRequests ? (
          requests.map((req, idx) => (
            <div className="request-card" key={idx}>
              <p><strong>Title:</strong> {req.title}</p>
              <p><strong>Company:</strong> {req.company || "N/A"}</p>
              <p><strong>Type:</strong> {req.type}</p>
              <p><strong>Requested:</strong> {req.timestamp}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </div>
          ))
        ) : (
          <div className="no-requests-message">No support requests yet.</div>
        )}
      </div>
    </div>
  );
};

export default SupportRequestTable;
