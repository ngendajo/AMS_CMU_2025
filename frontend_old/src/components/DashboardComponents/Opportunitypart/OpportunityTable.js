import React from 'react';

const formatDate = (dateString) => {
  const dateObject = new Date(dateString);
  const options = { timeZone: 'Africa/Nairobi' };
  return dateObject.toLocaleDateString('en-US', options);
};

function OpportunityTable({ opportunities, onApprove }) {
  return (
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Title</th>
          <th>Description</th>
          <th>Post Time</th>
          <th>Approved</th>
        </tr>
      </thead>
      <tbody>
        {opportunities.map((opportunity) => (
          <tr key={opportunity.id}>
            <td>{opportunity.id}</td>
            <td>{opportunity.title}</td>
            <td>{opportunity.description}</td>
            <td>{formatDate(opportunity.post_time)}</td>

            <td>
              <input
                type="checkbox"
                checked={opportunity.approved}
                onChange={() => onApprove(opportunity.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OpportunityTable;



