import React, { useState, useEffect } from 'react';
import JobCard from '../../components/career/job-card';
import "./CareerOpportunity.css";

import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import baseUrl from '../../api/baseUrl';

const CareerOpportunity = () => {
    const [activeTab, setActiveTab] = useState('Full Time');
    const [opportunity, setOpportunity] = useState([]);
    const [creatingNew, setCreatingNew] = useState(false);
    const { auth } = useAuth();
    
    const fetchOpportunity = async () => {
    try {
      const response = await axios.get(baseUrl+'/opportunity');
      console.log(response.data)
      const sortedOpportunities = response.data.sort((a, b) => a.approved - b.approved);
      setOpportunity(sortedOpportunities);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOpportunity();
  }, []);

    const jobData = opportunity;
  
    const filteredJob = jobData.filter(job => job.op_type === activeTab);

    const handleApprove = async (jobId, approved) => {
      try {
        await axios.patch(baseUrl + "/opportunity/" + jobId + "/approve",
        { approved: !approved },
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert(!approved ? "Posted successfully" : "Removed successfully");
          fetchOpportunity();
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    const handleSaveEdit = async (jobId, approved, opportunityData) => {
      try {
        await axios.put(baseUrl + "/opportunity/" + jobId + "/update/", opportunityData,
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert(approved ? "Posted successfully" : "Saved successfully");
          fetchOpportunity();
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    const handleCreateNew = async (opportunityData) => {
      if (opportunityData === null) {
        setCreatingNew(false);
        return;
      }
      try {
        await axios.post(baseUrl + "/opportunity/create/", opportunityData,
          {
            headers: {
              "Authorization": 'Bearer ' + String(auth.accessToken),
              "Content-Type": 'application/json'
            }
          }
        ).then(res => {
          console.log(res);
          alert("Created successfully");
          fetchOpportunity();
          setCreatingNew(false);
        }).catch(error => console.log(error.response.data));
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div className="job-page">
        <div className="tabs">
          <button onClick={() => setActiveTab('Full Time')} className={activeTab === 'Full Time' ? 'active' : ''}>Full Time</button>
          <button onClick={() => setActiveTab('Part Time')} className={activeTab === 'Part Time' ? 'active' : ''}>Part Time</button>
          <button onClick={() => setActiveTab('Internship')} className={activeTab === 'Internship' ? 'active' : ''}>Internship</button>
          <button onClick={() => setActiveTab('Volunteer')} className={activeTab === 'Volunteer' ? 'active' : ''}>Volunteer</button>
          <button onClick={() => setActiveTab('Professional')} className={activeTab === 'Professional' ? 'active' : ''}>Proffesional Development</button>
        </div>
        {(auth.user.is_crc || auth.user.is_superuser) && (
          <button onClick={() => setCreatingNew(true)} className="create-new-button">Create Draft</button>
        )}
        <div className="job-cards-container">
        {creatingNew && (
          <JobCard
            alumni='false'
            title=""
            type={activeTab}
            description=""
            date=""
            link=""
            approved={false}
            onApprove={() => handleApprove(null, false)}
            onSave={(x) => handleCreateNew(x)}
            isNew={true}
          />
        )}
        {auth.user.is_alumni && (
          filteredJob.map(job => (
            job.approved ?
            <JobCard
              key={job.id}
              alumni='true'
              title={job.title}
              type={job.op_type}
              description={job.description}
              date={job.diedline}
              link={job.link}
              approved={job.approved}
            />
            : null
          ))
        )}
        {(auth.user.is_crc || auth.user.is_superuser) && (
        filteredJob.map(job => (
          <JobCard
            key={job.id}
            alumni='false'
            title={job.title}
            type={job.op_type}
            description={job.description}
            date={job.diedline}
            link={job.link}
            approved={job.approved}
            onApprove={() => handleApprove(job.id, job.approved)}
            onChange={(x) => handleSaveEdit(job.id, job.approved, x)}
          />
        ))
      )}
      </div>
    </div>
  );
};

export default CareerOpportunity;