import React, { useState, useEffect } from "react";
import "./AddData.css";
import baseUrl from "../api/baseUrl";
import axios from "../api/axios";
import GradeForm from "../components/AddData/addGradeData";
import GradeList from "../components/AddData/listGradeData";

const AddData = () => {
  const [expanded, setExpanded] = useState(null);
  const [showSingleStudentForm, setShowSingleStudentForm] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [positionFlags, setPositionFlags] = useState({
    is_crc: false,
    is_teacher: false,
    is_librarian: false,
    is_mama: false,
  });

  const [cityOther, setCityOther] = useState(false);
  const [countryOther, setCountryOther] = useState(false);
  const [mamas, setMamas] = useState([]);

  const toggleSection = (section) => {
    if (expanded === section) {
      setExpanded(null);
      if (section === "students") setShowSingleStudentForm(false);
    } else {
      setExpanded(section);
    }
  };

  const handlePositionChange = (value) => {
    setPositionFlags({
      is_crc: value === "crc",
      is_teacher: value === "teacher",
      is_librarian: value === "librarian",
      is_mama: value === "mother",
    });
  };

  useEffect(() => {
    axios.get(baseUrl + '/options/mamas/') //get all mamas
    .then((res) => {
        setMamas(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch mamas:", err);
      });
  }, []);


  return (
    <div className="add-data-container">
      <h1 className="page-title">Add Data</h1>

      {/* Add Grade & Families */}
      <div className="white-card">
        <div className="section-header" onClick={() => toggleSection("grade")}>
          <h2>Add Grade & Families</h2>
          <span>{expanded === "grade" ? "▲" : "▼"}</span>
        </div>
        {expanded === "grade" && (
        <GradeForm /> 
        )}
      </div>

      {/* Add Students (Bulk + One) */}
      <div className="white-card">
        <div className="section-header" onClick={() => toggleSection("students")}>
          <h2>Add Students</h2>
          <span>{expanded === "students" ? "▲" : "▼"}</span>
        </div>
        {expanded === "students" && (
          <div className="form-section">
            <label className="required">Upload Excel File</label>
            <input type="file" accept=".xlsx, .xls" />
            <button>Upload</button>

            <div className="inline-link">
              <p onClick={() => setShowSingleStudentForm(!showSingleStudentForm)}>
                {showSingleStudentForm ? "Hide" : "Or Add One Student"}
              </p>
            </div>

            {showSingleStudentForm && (
              <div className="nested-section">
                <label className="required">Username</label>
                <input type="text" />

                <label className="required">Registration Number</label>
                <input type="text" />

                <label className="required">First Name</label>
                <input type="text" />

                <label className="required">Rwandan Name</label>
                <input type="text" />

                <label className="required">Gender</label>
                <select>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>

                <label>Date of Birth</label>
                <input type="date" />

                <label>Phone</label>
                <input type="tel" />

                <label>Alternate Phone</label>
                <input type="tel" />

                <label>Email</label>
                <input type="email" />

                <label>Alternate Email</label>
                <input type="email" />

                <label className="required">Password</label>
                <input type="password" />

                <label className="required">Confirm Password</label>
                <input type="password" />

                <label className="required">Family</label>
                <select>
                  <option value="">Select family</option>
                  <option value="1">Family 1</option>
                  <option value="2">Family 2</option>
                </select>

                <label>Graduation Status</label>
                <input type="text" />

                <label>Origin District</label>
                <select>
                  <option value="">Select</option>
                  <option value="bugesera">Bugesera</option>
                  <option value="nyarugenge">Nyarugenge</option>
                </select>

                <label>Origin Sector</label>
                <select>
                  <option value="">Select</option>
                  <option value="kacyiru">Kacyiru</option>
                  <option value="nyamirambo">Nyamirambo</option>
                </select>

                <label>Current City</label>
                <select onChange={(e) => setCityOther(e.target.value === "other")}>
                  <option value="">Select</option>
                  <option value="kigali">Kigali</option>
                  <option value="huye">Huye</option>
                  <option value="other">Other</option>
                </select>
                {cityOther && <input type="text" placeholder="Enter city" />}

                <label>Current Country</label>
                <select onChange={(e) => setCountryOther(e.target.value === "other")}>
                  <option value="">Select</option>
                  <option value="rwanda">Rwanda</option>
                  <option value="uganda">Uganda</option>
                  <option value="other">Other</option>
                </select>
                {countryOther && <input type="text" placeholder="Enter country" />}

                <label>Health Issue</label>
                <input type="text" />

                <label>Marital Status</label>
                <select>
                  <option value="">Single</option>
                  <option value="1">Married</option>
                  <option value="2">Divorced</option>
                  <option value="3">Widowed</option>
                </select>

                <label>Life Status</label>
                <input type="text" />

                <label>Has Children?</label>
                <select>
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>

                <label>National Exam Score</label>
                <input type="number" />

                <label>Max National Exam Score</label>
                <input type="number" />

                <label>Mention</label>
                <input type="text" />

                <button>Add Student</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Staff */}
      <div className="white-card">
        <div className="section-header" onClick={() => toggleSection("staff")}>
          <h2>Add Staff Account</h2>
          <span>{expanded === "staff" ? "▲" : "▼"}</span>
        </div>
        {expanded === "staff" && (
          <div className="form-section">
            <label className="required">Username</label>
            <input type="text" />

            <label className="required">Registration Number</label>
            <input type="text" />

            <label className="required">First Name</label>
            <input type="text" />

            <label>Middle Name</label>
            <input type="text" />

            <label className="required">Rwandan Name</label>
            <input type="text" />

            <label className="required">Gender</label>
            <select>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>

            <label>Date of Birth</label>
            <input type="date" />

            <label>Phone</label>
            <input type="tel" />

            <label>Alternate Phone</label>
            <input type="tel" />

            <label>Email</label>
            <input type="email" />

            <label>Alternate Email</label>
            <input type="email" />

            <label className="required">Password</label>
            <input type="password" />

            <label className="required">Confirm Password</label>
            <input type="password" />

            <label className="required">Position</label>
            <select onChange={(e) => handlePositionChange(e.target.value)}>
              <option value="">Select position</option>
              <option value="crc">CRC</option>
              <option value="teacher">Teacher</option>
              <option value="librarian">Librarian</option>
              <option value="mother">Mother</option>
            </select>

            <div className="checkbox-inline">
              <label htmlFor="superuser">Superuser</label>
              <input
                id="superuser"
                type="checkbox"
                checked={isSuperuser}
                onChange={(e) => setIsSuperuser(e.target.checked)}
              />
            </div>


            <button>Add Staff</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default AddData;

