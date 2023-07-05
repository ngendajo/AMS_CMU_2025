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

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const user = jwtDecode(auth.accessToken);
  // const userRole = user.is_superuser ? "admin" : user.is_crc ? "staff" : "alumni";
  console.log(auth.user.id);

  const handleApprove = async (opportunityId) => {
    // 根据opportunityId更新opportunities数组中相应对象的approved属性
    if (user.is_superuser || user.is_crc) {
      const updatedOpportunities = opportunities.map((opportunity) => {
        if (opportunity.id === opportunityId) {
          return { ...opportunity, approved: true };
        }
        return opportunity;
      });

    setOpportunities(updatedOpportunities);

    // 发送approve请求到后端
    try {
      await axios.patch("http://localhost:8000/api/opportunity/"+opportunityId+"/approve",
      { approved: true },
      {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
      ).then(res =>{
        console.log(res)
        alert("Approved successfully")
        navigate('/opportunities')
    })
    .catch(error => console.log(error.response.data));  // Update "approved" status
    } catch (error) {
    }
   }
  };

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/opportunity');
      setOpportunities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);


  // 根据用户角色过滤机会
  const filteredOpportunities = opportunities.filter(opportunity => {
    if (user.is_superuser || user.is_crc) {  // admin和staff可以看到所有机会
      return true;
    } else {  // alumni只能看到已经approve的机会
      return opportunity.approved;
    }
  });

  return (
    <div className="opportunity-table">
      <h1>Explore Job Opportunities!</h1>
      <OpportunityTable opportunities={filteredOpportunities} onApprove={handleApprove} />
      {/*<OpportunityTable opportunities={opportunities} onApprove={handleApprove} userRole={userRole} />*/}
      <AddOpportunity />
    </div>
  );
}

export default Opportunities;
