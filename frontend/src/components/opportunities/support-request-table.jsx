import React from "react";
import "./support-request-table.css";

const SupportRequestTable = ({ requests }) => {
  return (
    <div className="requests-wrapper">
      {/* Desktop Table View */}
      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>Opportunity Title</th>
              <th>Type</th>
              <th>Requested At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, idx) => (
              <tr key={idx}>
                <td>{req.title}</td>
                <td>{req.type}</td>
                <td>{req.timestamp}</td>
                <td>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="requests-mobile">
        {requests.map((req, idx) => (
          <div className="request-card" key={idx}>
            <p><strong>Title:</strong> {req.title}</p>
            <p><strong>Type:</strong> {req.type}</p>
            <p><strong>Requested:</strong> {req.timestamp}</p>
            <p><strong>Status:</strong> {req.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportRequestTable;
