import React from 'react';

const ResumeBuilderPage = () => {
  return (
    <div style={{ height: '100%', width: '100%', borderRadius:"8px" ,  border: "5px var(--green) solid", boxShadow: "0 1px 5px var(--blackopa)"}}>
      <iframe
        src="http://localhost:5000/resume" 
        title="Reactive Resume Builder"
        style={{ height: '100%', width: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ResumeBuilderPage;
