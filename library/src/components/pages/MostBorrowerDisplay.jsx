import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import baseUrl from "../../api/baseUrl";
import moment from 'moment';
//import DynamicTable from './dinamicTable/DynamicTable';
import ResponsiveTable from './ResponsiveTable';

const MostBorrowerDisplay = ({ start_date, end_date }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let {auth} = useAuth();

  const formatDate = (date) => {
	const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = baseUrl+'/mostborrower/';
        let url1 = baseUrl+'/gborrower/';

        // Check if start_date and end_date props are provided
        if (start_date && end_date) {
            if(end_date<start_date){
                setError("End date is less data start date")
            }else{
                setError("")
                url += `?start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}`;
                url1 += `?start_date=${formatDate(start_date)}&end_date=${formatDate(end_date)}`;
            }
          
        }
        const response = await axios.get(url,{
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'multipart/form-data'
            },
            withCredentials:true 
        });
        const response1 = await axios.get(url1,{
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'multipart/form-data'
            },
            withCredentials:true 
        });
        console.log(response1.data)
        setData2(response1.data);
        setData(response.data);
        var borrowerlist=[]
                var i=1
                response.data.forEach(e=>{
                    borrowerlist.push({
                    No:i,
                    "Last Name":e.last_name,
                    "First Name":e.first_name,
                    "Grade Name":e.grade_name,
                    "Family Name":e.family_name,
                    "issue_count":e.issue_count
                })
                i=i+1
                })
                setData1(borrowerlist);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth,start_date, end_date]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
        {start_date && end_date?
            <h2>From {moment(start_date).format("Do MMMM YYYY, h:mm:ss a").toLocaleString()} to {moment(end_date).format("Do MMMM YYYY, h:mm:ss a").toLocaleString()}, Most Borrower Student(s):</h2>:
            <h2>This Month, Most Borrower Student(s):</h2>
        }
        <ol>
          {data.length===0?
          <h2>No data</h2>:
          <ResponsiveTable data={data1} />
            }
        </ol>
    </div>
  );
};

export default MostBorrowerDisplay;
