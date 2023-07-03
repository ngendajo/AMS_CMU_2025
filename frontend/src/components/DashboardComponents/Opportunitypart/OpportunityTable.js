import React from 'react';

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
            <td>{opportunity.post_time}</td>

            <td>
              {opportunity.approved ? ( // check if opportunity.approved is true
                'Yes'
              ) : (
                <div>
                  <button onClick={() => onApprove(opportunity.id)} disabled={opportunity.approved}>
                    Approve
                  </button>
                </div>
              )}
            </td>


          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OpportunityTable;

