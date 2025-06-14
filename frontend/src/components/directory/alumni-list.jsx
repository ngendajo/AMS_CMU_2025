import React from 'react';
import './alumni-list.css';
const AlumniList = ({ alumni, onSelect, lastRef }) => {
  return (
    <>
      {/* Desktop Table Layout */}
      <table className="desktop-table alumni-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Grade</th>
            <th>Family</th>
            <th>Combination</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((alum, index) => (
            <tr
              key={alum.id}
              onClick={() => onSelect(alum)}
              className="table-row"
              ref={index === alumni.length - 1 ? lastRef : null}
            >
              <td>
                <img src={alum.profilePic} alt="Profile" className="alumni-pic-table" />
              </td>
              <td>{alum.firstName}</td>
              <td>{alum.lastName}</td>
              <td>{alum.gradeName}</td>
              <td>{alum.familyName}</td>
              <td>{alum.combinationName}</td>
              <td>{alum.industry}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile Layout */}
      <div className="mobile-list alumni-list">
        {alumni.map((alum, index) => (
          <div
            key={alum.id}
            className="alumni-item"
            onClick={() => onSelect(alum)}
            ref={index === alumni.length - 1 ? lastRef : null}
          >
            <img src={alum.profilePic} alt="Profile" className="alumni-pic" />
            <div className="alumni-name">
              {alum.firstName} {alum.lastName}
              <br />
              ({alum.gradeName} - {alum.familyName} - {alum.combinationName})
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default AlumniList;
