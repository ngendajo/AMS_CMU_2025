import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import OpportunityTable from '../../components/DashboardComponents/Opportunitypart/OpportunityTable';
import '../../components/DashboardComponents/Opportunitypart/opportunity.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AddOpportunity from '../../components/DashboardComponents/Opportunitypart/AddOpportunity';
import baseUrl from '../../api/baseUrl';

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user = jwtDecode(auth.accessToken);
  // const userRole = user.is_superuser ? "admin" : user.is_crc ? "staff" : "alumni";
  console.log(auth.user.id);

  const handleApprove = async (opportunityId) => {
    if (user.is_superuser || user.is_crc) {
      const opportunity = opportunities.find(op => op.id === opportunityId);
      const approved = !opportunity.approved;

      const updatedOpportunities = opportunities.map((opportunity) => {
        if (opportunity.id === opportunityId) {
          return { ...opportunity, approved };
        }
        return opportunity;
      });

      setOpportunities(updatedOpportunities);

      try {
        await axios.patch(baseUrl+"/opportunity/"+opportunityId+"/approve",
        { approved },
        {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'application/json'
          }
        }
        ).then(res => {
          console.log(res);
          alert(approved ? "Approved successfully!" : "Disapproved successfully!");
          navigate('/opportunities');
        })
        .catch(error => console.log(error.response.data));
      } catch (error) {
      }
    }
  };


  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(baseUrl+'/opportunity');
      console.log(response.data);
      setOpportunities(response.data);
    } catch (error) {
      console.log(error);
      navigate('/error');
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);


  // Filter opportunities based on user identity
  const filteredOpportunities = opportunities.filter(opportunity => {
    if (user.is_superuser || user.is_crc) {
      return true;  // admin and staff can see all opportunities
    } else {
      return opportunity.approved;  // alumni can only see the approved ones
    }
  });

  return (
    <div className="opportunity-table">
      <h1>Explore Job Opportunities!</h1>
      <OpportunityTable opportunities={filteredOpportunities} onApprove={handleApprove}/>
      {
        auth.user.is_superuser || auth.user.is_crc?<AddOpportunity />:null
      }
      
    </div>
  );
}

export default Opportunities;
