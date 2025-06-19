import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, CartesianGrid
} from 'recharts';
import axios from 'axios';
import baseUrl from '../../api/baseUrl';
import CollegesList from './college-list';

// Helper function to aggregate distributions from multiple year objects
const aggregateDistributions = (dataArray, key) => {
  // dataArray: array of yearly data objects
  // key: which distribution key to aggregate, e.g. 'employment_status_distribution'
  const agg = {};
  dataArray.forEach(item => {
    const dist = item[key];
    if (dist) {
      Object.entries(dist).forEach(([category, val]) => {
        if (!agg[category]) {
          agg[category] = { count: 0, percent: 0 };
        }
        agg[category].count += val.count || 0;
        agg[category].percent += val.percent || 0; // Percent aggregation might not be meaningful but included here if needed
      });
    }
  });
  return agg;
};
// Helper function to aggregate colleges attendance count
const aggregateColleges = (dataArray) => {
  const agg = {};
  dataArray.forEach(item => {
    const colleges = item.most_attended_colleges;
    if (colleges) {
      colleges.forEach(college => {
        if (!agg[college.college]) {
          agg[college.college] = { attendance_count: 0 };
        }
        agg[college.college].attendance_count += college.attendance_count || 0;
      });
    }
  });
  // Return as array for BubbleChart usage
  return Object.entries(agg).map(([college, val]) => ({
    college,
    attendance_count: val.attendance_count,
  }));
};

const AlumniOutcomesDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    axios.get(baseUrl + '/alumni-trends/')
      .then(res => setData(res.data.yearly_outcomes))
      .catch(err => console.error('Error loading data:', err));
  }, []);

  const yearOptions = data.map(item => ({
    value: item.graduation_year,
    label: item.graduation_year.toString()
  }));

  const filteredData = selectedYears.length
    ? data.filter(d => selectedYears.some(y => y.value === d.graduation_year))
    : data;

  const collegeData = aggregateColleges(filteredData);
  const employmentStatusData = aggregateDistributions(filteredData, 'employment_status_distribution');
  const industryData = aggregateDistributions(filteredData, 'industry_distribution'); 

  const selectedYearsSorted = filteredData
    .map(d => d.graduation_year)
    .sort((a, b) => a - b);

  // Define metric pairs: count + percent keys and labels
  const metrics = [
    { 
      keyCount: "total_alumni", labelCount: "Total Alumni", 
      keyPercent: null, labelPercent: null 
    },
    { 
      keyCount: "employment_only", labelCount: "Employment Only (Count)", 
      keyPercent: "employment_only_percent", labelPercent: "Employment Only (%)"
    },
    { 
      keyCount: "further_edu_only", labelCount: "Further Edu Only (Count)", 
      keyPercent: "further_edu_only_percent", labelPercent: "Further Edu Only (%)"
    },
    { 
      keyCount: "both", labelCount: "Both (Count)", 
      keyPercent: "both_percent", labelPercent: "Both (%)"
    },
    { 
      keyCount: "neither", labelCount: "Neither (Count)", 
      keyPercent: "neither_percent", labelPercent: "Neither (%)"
    }
  ];

  console.log("Filtered data for chart:", filteredData);

  return (
    <div className="trends-wrapper">
      {/* Year Selector */}
      <div className="select-width">
        <label className="block text-lg font-medium mb-2">Select Years</label>
        <Select
          isMulti
          options={yearOptions}
          value={selectedYears}
          onChange={setSelectedYears}
          placeholder="Select one or more years..."
        />
      </div>

      {/* Line Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <XAxis dataKey="graduation_year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="employment_only_percent" stroke="#8884d8" name="Employment Only (%)" />
            <Line type="monotone" dataKey="further_edu_only_percent" stroke="#82ca9d" name="Further Edu Only (%)" />
            <Line type="monotone" dataKey="both_percent" stroke="#ffc658" name="Both (%)" />
            <Line type="monotone" dataKey="neither_percent" stroke="#ff4d4f" name="Neither (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>


      {/* Scrollable Transposed Table with Counts & Percents */}
      <div className="scrollable-table-container">
        <table className="trend-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Metric</th>
              {selectedYearsSorted.map(year => (
                <th key={year} className="px-4 py-2 text-left">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(metric => (
              <tr key={metric.keyCount} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium whitespace-nowrap">
                  {metric.labelCount}
                  {metric.labelPercent && <><br />{metric.labelPercent}</>}
                </td>
                {selectedYearsSorted.map(year => {
                  const yearData = filteredData.find(d => d.graduation_year === year);
                  return (
                    <td key={year} className="px-4 py-2 whitespace-nowrap">
                      {yearData ? (
                        <>
                          {metric.keyCount && yearData[metric.keyCount] !== undefined
                            ? yearData[metric.keyCount]
                            : "-"}
                          {metric.keyPercent && yearData[metric.keyPercent] !== undefined && (
                            <div className="text-gray-500 text-xs">
                              ({yearData[metric.keyPercent]}%)
                            </div>
                          )}
                        </>
                      ) : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CollegesList data={collegeData} />
    </div>
  );
};

export default AlumniOutcomesDashboard;
