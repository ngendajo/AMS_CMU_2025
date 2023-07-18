import React from 'react';

const HomeAlumni = () => {
  const missionStyle = {
    background: '#4C8061',
    marginTop: '75px',
    padding: '3%',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    textAlign: 'center',
    color: 'orange',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const contentStyle = {
    textAlign: 'center',
    color: 'white',
    fontSize: '18px',
    marginLeft: '190px',
    marginRight: '190px',
    lineHeight: '1.5',
  };

  const copyRight = {
    textAlign: 'center',
    color: '#2A503A',
    fontSize: '13px',
    fontWeight: 'bold',
  };

  return (
    <div className="mission" style={missionStyle}>

      <div style={titleStyle}>
        Our Mission and Vision
      </div>
      <br/>

      <div style={contentStyle}>
        Through healing, education, and love, the Agahozo-Shalom Youth Village empowers orphaned and vulnerable Rwandan youth to build lives of dignity and contribute to a better world.
      </div>

      <div style={copyRight}>
        <br/>
        @Copyright ASYV 2023
      </div>

    </div>
  );
};

export default HomeAlumni;

