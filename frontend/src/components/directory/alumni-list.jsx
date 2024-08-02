import React from 'react';
import "./alumni-list.css";

const AlumniList = ({ alumni, onSelect }) => {
    return (
        <div className="alumni-list">
            {alumni.map((alum) => {
                const profilePic = alum.profilePic;
                return (
                    <div key={alum.id} className="alumni-item" onClick={() => onSelect(alum)}>
                        <img src={profilePic} alt="Profile" className="alumni-pic" />
                        <div className="alumni-name">{alum.firstName} {alum.lastName}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default AlumniList;