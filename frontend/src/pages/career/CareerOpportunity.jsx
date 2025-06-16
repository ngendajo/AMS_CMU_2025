import React, { useState, useEffect } from 'react';
import TabbedCardPage from '../../components/opportunities/tabbed-card-page';
import OpportunityCard from '../../components/opportunities/opportunity-card';
import SupportRequestTable from '../../components/opportunities/support-request-table';

import './CareerOpportunity.css';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import baseUrl from '../../api/baseUrl';

const CareerOpportunity = () => {
  const { auth } = useAuth();

  const [activeTab, setActiveTab] = useState('Full Time');
  const [opportunities, setOpportunities] = useState([]);
  const [creatingNew, setCreatingNew] = useState(false);
  const [supportRequests, setSupportRequests] = useState([]);

  const TABS = [
    'Full Time',
    'Part Time',
    'Internship',
    'Volunteer',
    'Professional',
    'Support Requests'
  ];

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(baseUrl + '/opportunity');
      const sorted = response.data.sort((a, b) => a.approved - b.approved);
      setOpportunities(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const filtered = opportunities.filter(op => op.op_type === activeTab);

  const handleApprove = async (id, approved) => {
    try {
      await axios.patch(baseUrl + `/opportunity/${id}/approve`, { approved: !approved }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": 'application/json'
        }
      });
      alert(!approved ? "Posted successfully" : "Removed successfully");
      fetchOpportunities();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEdit = async (id, approved, data) => {
    try {
      await axios.put(baseUrl + `/opportunity/${id}/update/`, data, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": 'application/json'
        }
      });
      alert(approved ? "Posted successfully" : "Saved successfully");
      fetchOpportunities();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateNew = async (data) => {
    if (!data) return setCreatingNew(false);
    try {
      await axios.post(baseUrl + '/opportunity/create/', data, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": 'application/json'
        }
      });
      alert("Created successfully");
      fetchOpportunities();
      setCreatingNew(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestSupport = (op) => {
    const timestamp = new Date().toLocaleString();
    setSupportRequests(prev => [
      ...prev,
      {
        title: op.title,
        type: op.op_type,
        timestamp,
        status: 'Pending'
      }
    ]);
    alert("CRC support requested.");
    // TODO: Add backend integration here
  };

  const renderCards = () => {
    const cards = [];

    if (creatingNew) {
      cards.push(
        <OpportunityCard
          key="new"
          title=""
          description=""
          date=""
          type={activeTab}
          renderActions={() => (
            <>
              <button onClick={() => handleCreateNew(null)}>Cancel</button>
              <button onClick={() => alert("Save logic here")}>Save</button>
            </>
          )}
        />
      );
    }

    filtered.forEach((job) => {
      if (auth.user.is_alumni && !job.approved) return;
      cards.push(
        <OpportunityCard
          key={job.id}
          title={job.title}
          description={job.description}
          date={job.diedline}
          link={job.link}
          type={job.op_type}
          renderActions={() => (
            <>
              <button onClick={() => alert("Apply logic here")}>Apply</button>
              <button onClick={() => handleRequestSupport(job)}>Request CRC Support</button>
              {(auth.user.is_crc || auth.user.is_superuser) && (
                <>
                  <button onClick={() => handleApprove(job.id, job.approved)}>
                    {job.approved ? "Remove" : "Post"}
                  </button>
                  <button onClick={() => alert("Edit logic here")}>Edit</button>
                </>
              )}
            </>
          )}
        />
      );
    });

    return cards;
  };

  const renderFinalTab = () => (
    <SupportRequestTable requests={supportRequests} />
  );

  return (
    <TabbedCardPage
      tabs={TABS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderCards={renderCards}
      renderFinalTab={renderFinalTab}
      showCreateButton={(auth.user.is_crc || auth.user.is_superuser) && activeTab !== 'Support Requests'}
      onCreateClick={() => setCreatingNew(true)}
    />
  );
};

export default CareerOpportunity;
