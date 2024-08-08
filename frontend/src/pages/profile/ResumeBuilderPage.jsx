import React from 'react';

const ResumeBuilderPage = () => {
  return (
    <div style={{ height: '100%', width: '100%', borderRadius:"8px" ,  border: "none", boxShadow: "0 1px 5px var(--blackopa)"}}>
      <iframe
        src="https://www.open-resume.com/" 
        title="Reactive Resume Builder"
        style={{ height: '100%', width: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
};

export default ResumeBuilderPage;
