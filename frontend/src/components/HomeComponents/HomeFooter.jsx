import React from 'react';

const HomeFooter = () => {
  const footerStyle = {
    background: 'repeating-linear-gradient(45deg, #4C8061, #4C8061 0.25px, #3C7051 0.25px, #3C7051 0.5px)',
    marginTop: '60px',
    padding: '2%',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: -1,
  };

  const contentStyle = {
    textAlign: 'center',
    color: 'orange',
    fontSize: '20px',
    marginLeft: '190px',
    marginRight: '190px',
    lineHeight: '2',
    fontWeight: 'bold',
  };

  const copyRight = {
    textAlign: 'center',
    color: '#2A503A',
    fontSize: '15px',
    fontWeight: 'bold',
  };

  return (
    <div style={footerStyle}>

      <div style={contentStyle}>
        It takes a Village to transform a child.
      </div>

      <div style={copyRight}>

        @Copyright ASYV 2023
      </div>

    </div>
  );
};

export default HomeFooter;

