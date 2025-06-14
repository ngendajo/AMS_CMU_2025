import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from '../../hooks/useAuth';

// Fetch API data helper
async function fetchAlumniData(accessToken, year = "", gender = "") {
  try {
    const response = await axios.get(
      `${baseUrl}/alumni-trends/?year=${year}&gender=${gender}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log("API response:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching alumni data:", error);
    throw error;
  }
}

// Line chart for overall outcome trends
function TrendsLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="graduation_year" />
        <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
        <Tooltip formatter={(val) => `${val}%`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="employment_only_percent"
          stroke="#8884d8"
          name="Employment Only"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="further_edu_only_percent"
          stroke="#82ca9d"
          name="Further Education Only"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="both_percent"
          stroke="#ffc658"
          name="Both"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="neither_percent"
          stroke="#ff7300"
          name="Neither"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Bar chart for employment status distribution
function EmploymentStatusBarChart({ statusDistribution }) {
  if (!statusDistribution) return null;

  const data = Object.entries(statusDistribution).map(([status, { count, percent }]) => ({
    status,
    count,
    percent,
    label: `${status} (${count})`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 100, top: 20, bottom: 20, right: 30 }}
      >
        <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
        <YAxis dataKey="status" type="category" width={120} />
        <Tooltip formatter={(val) => `${val}%`} />
        <Bar dataKey="percent" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Bar chart for industry distribution
function IndustryBarChart({ industryDistribution }) {
  if (!industryDistribution) return null;

  const data = Object.entries(industryDistribution).map(([industry, { count, percent }]) => ({
    industry,
    count,
    percent,
    label: `${industry} (${count})`,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 180, top: 20, bottom: 20, right: 30 }}
      >
        <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
        <YAxis dataKey="industry" type="category" width={180} />
        <Tooltip formatter={(val) => `${val}%`} />
        <Bar dataKey="percent" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Main dashboard component
export default function AlumniOutcomesDashboard() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGender, setSelectedGender] = useState(""); 
  const [error, setError] = useState(null);
  const genderOptions = [
    { label: "All", value: "" },
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
  ];

  useEffect(() => {
    if (!auth?.accessToken) return;
  
    fetchAlumniData(auth.accessToken, selectedYear,  selectedGender,)
      .then((res) => setData(res))
      .catch((e) => setError(e.message));
  }, [auth, selectedGender, selectedYear]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Alumni Outcomes Trends</h2>
      <TrendsLineChart data={data} />

      <div style={{ marginTop: 40, marginBottom: 20 }}>
        <label>
          Select Graduation Year:{" "}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ padding: "5px", fontSize: "1rem" }}
          >
            <option value="">All</option>
            {[...new Set(data.map((d) => d.graduation_year))].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        </label>
        <label>
          Select Gender:{" "}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            style={{ padding: "5px", fontSize: "1rem" }}
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Employment Status Distribution</h3>
      <EmploymentStatusBarChart statusDistribution={data[0]?.employment_status_distribution} />

      <h3 style={{ marginTop: 40 }}>Industry Distribution</h3>
      <IndustryBarChart industryDistribution={data[0]?.industry_distribution} />
    </div>
  );
}
