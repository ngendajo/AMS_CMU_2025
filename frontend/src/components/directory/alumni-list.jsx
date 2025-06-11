import React from 'react';
import "./alumni-list.css";

const AlumniList = ({ alumni, onSelect, lastRef }) => {
    return (
        <div className="alumni-list">
            {alumni.map((alum, index) => {
                const isLastItem = index === alumni.length - 1;
                const profilePic = alum.profilePic;
                return (
                    <div
                        key={alum.id}
                        className="alumni-item"
                        onClick={() => onSelect(alum)}
                        ref={isLastItem ? lastRef : null}
                    >
                        <img src={profilePic} alt="Profile" className="alumni-pic" />
                        <div className="alumni-name">
                            {alum.firstName} {alum.lastName}
                            <br />
                            ({alum.gradeName} - {alum.familyName} - {alum.combinationName})
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AlumniList;
