import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MostBorrowerDisplay = ({ start_date: propStartDate, end_date: propEndDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '/api/mostborrower/';

        // Check if start_date and end_date props are provided
        if (start_date && end_date) {
          url += `?start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }

        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [start_date, end_date]);

  useEffect(() => {
    // Set default values for start_date and end_date if props are not provided
    if (!propStartDate || !propEndDate) {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      setStartDate(firstDayOfMonth.toISOString());
      setEndDate(lastDayOfMonth.toISOString());
    } else {
      // Use provided props
      setStartDate(propStartDate);
      setEndDate(propEndDate);
    }
  }, [propStartDate, propEndDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Most Borrowed Books</h1>
      <table>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Grade Name</th>
            <th>Family Name</th>
            <th>Combination Name</th>
            <th>Issue Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.last_name}</td>
              <td>{item.first_name}</td>
              <td>{item.grade_name}</td>
              <td>{item.family_name}</td>
              <td>{item.combination_name}</td>
              <td>{item.issue_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostBorrowerDisplay;
