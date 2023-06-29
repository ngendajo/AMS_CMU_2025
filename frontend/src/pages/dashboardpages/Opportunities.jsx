import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OpportunityTable from './OpportunityTable';
import '../../components/DashboardComponents/Opportunitypart/opportunity.css';
import '../../components/Header/searchBar.css';
import '../../components/Header/searchResultsList.css';
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
//import { Link } from "react-router-dom";
import AddOpportunity from '../../components/DashboardComponents/Opportunitypart/AddOpportunity';


function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleApprove = async (opportunityId) => {
    // 根据opportunityId更新opportunities数组中相应对象的approved属性
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

  };

/* 原来：
  useEffect(() => {  // 副作用函数
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/opportunity'); // axios is for HTTP request
        setOpportunities(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOpportunities();
  }, []);
*/
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

  return (
    <div className="opportunity-table">
      <h1>Explore Job Opportunities!</h1>
      {/*<button onClick={AddOpportunity}>Add Opportunity</button>*/}
      <OpportunityTable opportunities={opportunities} onApprove={handleApprove} /> {/* OpportunityTable: show table; opportunities: the characteristics to pass */}
      <AddOpportunity />
    </div>
  );
}

export default Opportunities;
