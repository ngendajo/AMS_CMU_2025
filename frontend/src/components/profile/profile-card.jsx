import React, { useState, useEffect, useMemo } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './profile-card.css';
const safeValue = (val) => {
  if (val === null || val === undefined || val === "") return "Not Found";
  return val;
};
const getLevelLabel = (level) => {
    switch (level) {
      case 'A1':
        return 'Advanced Diploma of ';
      case 'A0':
        return 'Bachelor in ';
      case 'M':
        return 'Master in ';
      case 'PHD':
          return 'Ph.D. in ';
      case 'C':
          return 'Certificate of ';
      default:
        return '';
    }
  };
const getStudyStatusLabel = (status) => {
  switch (status) {
    case 'O':
      return 'Ongoing';
    case 'G':
      return 'Graduated';
    case 'S':
      return 'Suspended';
    case 'D':
      return 'Dropped Out';
    default:
      return 'NA';
  }
};

const getEmployementStatusLabel = (status) => {
  switch (status) {
    case 'F':
      return 'Full-time';
    case 'P':
      return 'Part-time';
    case 'S':
      return 'Self-employed';
    case 'I':
      return 'Intern';
    default:
      return 'NA';
  }
};
const ProfileCardSection = ({
  title,
  children,
  isEditing,
  onToggleEdit,
  onCancelEdit,
  canEdit = true,
  onAddRow
}) => (
  <div className={`profile-whitecard ${isEditing ? 'edit-mode' : ''}`}>
    <h2 className="profile-section-title">{title}</h2>
    <div className="scroll-wrapper">{children}</div>
    {canEdit && (
      <div className="profile-button-group">
        {isEditing && onAddRow && (
          <button className={title.includes("Academic") ? "addStudy" : "addJob"} onClick={onAddRow}>Add New</button>
        )}
        {isEditing && (
          <button className="cancel" onClick={onCancelEdit}>Cancel</button>
        )}
        <button className="change" onClick={onToggleEdit}>{isEditing ? "Save" : "Edit"}</button>
      </div>
    )}
  </div>
);
const ProfileCard = () => {
  const [dropdownOptions, setDropdownOptions] = useState({
    marital_statuses: [],
    children_options: [],
    levels: [],
    colleges: [],
    industries: [],
    status:[],
    employement_status:[]
  });
  const { auth } = useAuth();
  const [user, setUser] = useState([]);
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [user_id, setUser_id] = useState();
  const [kid_id, setKid_id] = useState();
  const [editState, setEditState] = useState({ current: false, academic: false, employment: false });
  const [currentInfo, setCurrentInfo] = useState(null);
  //fetch kid user information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, dropdownRes] = await Promise.all([
          axios.get(baseUrl + '/kid/' + auth.user.id, {
            headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
            withCredentials: true
          }),
          axios.get(baseUrl + '/options/all-dropdowns/', { 
            headers: { Authorization: 'Bearer ' + String(auth.accessToken) },
            withCredentials: true
          })
        ]);
  
        setUser_id(auth.user.id);
        setUser([userRes.data]);
        setKid_id(userRes.data.basic_information.kid_id);
        setDropdownOptions(dropdownRes.data);  
  
      } catch (err) {
        console.error(err);
      }
    };
  
    if (auth?.user?.id) fetchData();
  }, [auth]);
  const sortStudyLevel = (studies) => {
    const levelOrder = { C: 1, A1: 2, A0: 3, M: 4, PHD: 5 };
    return studies.sort((a, b) => {
      const levelComparison = levelOrder[a.level] - levelOrder[b.level];
      return levelComparison !== 0 ? levelComparison : a.degree.localeCompare(b.degree);
    });
  };

  const getStudy = async () => {
    try {
      const response = await axios.get(`${baseUrl}/alumni-academic/?id=${user_id}`, {
        headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
        withCredentials: true
      });
      const studies = response.data.map(element => ({
        id: element.id,
        alumn: element.alumn,
        level: element.level,
        degree: element.degree,
        college: element.college,
        country: element.location,
        scholarship: element.scholarship,
        scholarship_details: element.scholarship_details,
        status: element.status
      }));
      setStudy(sortStudyLevel(studies));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user_id) getStudy();
  }, [auth, user_id]);

  const sortJobDate = (jobs) => {
    return jobs.sort((a, b) => {
      if (a.end_date !== b.end_date) {
        if (a.end_date === "") return 1;
        if (b.end_date === "") return -1;
        return new Date(a.end_date) - new Date(b.end_date);
      }
      return new Date(a.start_date) - new Date(b.start_date);
    });
  };

  const getEmployment = async () => {
    try {
      const response = await axios.get(`${baseUrl}/alumni-employment/?id=${user_id}`, {
        headers: { Authorization: 'Bearer ' + String(auth.accessToken), "Content-Type": 'multipart/form-data' },
        withCredentials: true
      });
      const jobs = response.data.map(element => ({
        id: element.id,
        alumn: element.alumn,
        title: element.title,
        status: element.status,
        company: element.company,
        industry: element.industry,
        start_date: element.start_date,
        end_date: element.end_date,
        on_going: element.end_date === ""
      }));
      setEmployment(sortJobDate(jobs));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user_id) getEmployment();
  }, [auth, user_id]);
//Edit employment data
  const saveEmploymentData = async () => {
    console.log("called api to save employment data")
    console.log("Data sent to backend:", {
      employment: employment
    });
    try {
      await axios.put(`${baseUrl}/alumni-employment/?id=${user_id}`, {
        employment: employment
      }, {
        headers: {
          Authorization: 'Bearer ' + String(auth.accessToken),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      alert('Employment data saved!');
      getEmployment();
    } catch (error) {
      console.error(error);
      alert('Failed to save employment data.');
    }
  };
  //Edit academic data
  const saveStudyData = async () => {
    console.log("called api to save academics data")
    console.log("Data sent to backend:", {
      academic: study
    });
    try {
      await axios.put(`${baseUrl}/alumni-academic/?id=${user_id}`, {
        academic: study
      }, {
        headers: {
          Authorization: 'Bearer ' + String(auth.accessToken),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      alert('Academic data saved!');
      getStudy();
    } catch (error) {
      console.error(error);
      alert('Failed to save academic data.');
    }
  };
//Edit current info
  const saveCurrentInfo = async () => {
    try {
      await axios.put(`${baseUrl}/kid/${user_id}`, currentInfo, {
        headers: {
          Authorization: 'Bearer ' + String(auth.accessToken),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      alert('Current info saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save current info.');
    }
  };

  const collegeLookup = Object.fromEntries(
    dropdownOptions.colleges.map(c => [c.value, c.location])
  );
  //console.log(collegeLookup);

  
 const renderSection = (
  data,
  setData,
  fields,
  editing = false,
  isEmploymentSection = false,
  isAcademicSection = false
) => (
  <>
    <div className="profile-table desktop-only">
      <table className="fixed-table">
        <thead>
          <tr>{fields.map((f, i) => <th key={i}>{f.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              {fields.map((f, j) => {
                const val = typeof f.value === 'function' ? f.value(item) : item[f.value];

                // Dropdown editing
                if (editing && f.dropdownKey && dropdownOptions[f.dropdownKey]) {
                  return (
                    <td key={j}>
                      <select
                        value={item[f.value] ?? ""}
                        onChange={(e) => {
                          const updated = [...data];
                          updated[i][f.value] = e.target.value;

                          // Example: for academics, update location dynamically when college changes
                          if (isAcademicSection && f.value === 'college') {
                            // Suppose you have a map: collegeId -> {city, country}
                            const locationInfo = collegeLookup[e.target.value]; // define this in scope
                            //console.log(e.target.value);
                            updated[i]['location'] = `${locationInfo.location}`;
                          }

                          setData(updated);
                        }}
                        style={{ width: "100%" }}
                      >
                        <option value="" disabled>Select...</option>
                        {dropdownOptions[f.dropdownKey].map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                  );
                }

                // For academic location: make it readonly (no input) or just display string
                if (isAcademicSection && f.value === 'country') {
                  return <td key={j}>{val || '-'}</td>;
                }

                // Editable input field
                if (editing) {
                  return (
                    <td key={j}>
                      <input
                        type="text"
                        value={item[f.value] ?? ""}
                        onChange={(e) => {
                          const updated = [...data];
                          updated[i][f.value] = e.target.value;
                          setData(updated);
                        }}
                        style={{ width: "100%" }}
                        // Disable input if academic section and location field
                        disabled={isAcademicSection && f.value === 'country'}
                      />
                    </td>
                  );
                }

                // Non-editing display formatting
                return (
                  <td key={j}>
                    {isEmploymentSection && f.value === 'status' ? (
                      getEmployementStatusLabel(val)
                    ) : isAcademicSection && f.value === 'college' ? (
                      dropdownOptions.colleges.find(opt => String(opt.value) === String(val))?.label ?? val
                    ) : isAcademicSection && f.value === 'level' ? (
                      getLevelLabel(val)
                    ) : isAcademicSection && f.value === 'status' ? (
                      getStudyStatusLabel(val)
                    ) : (
                      safeValue(val)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="profile-fields mobile-only">
      {data.map((item, i) => (
        <div key={i} className="entry-block">
          {fields.map((f, j) => {
            const val = typeof f.value === 'function' ? f.value(item) : item[f.value];

            if (editing && f.dropdownKey && dropdownOptions[f.dropdownKey]) {
              return (
                <div key={j}>
                  <select
                    value={item[f.value] ?? ""}
                    onChange={(e) => {
                      const updated = [...data];
                      updated[i][f.value] = e.target.value;

                      if (isAcademicSection && f.value === 'college') {
                        const locationInfo = collegeLookup[e.target.value];
                        updated[i]['location'] = `${locationInfo.location}`;
                      }

                      setData(updated);
                    }}
                    style={{ width: "100%" }}
                  >
                    <option value="" disabled>Select...</option>
                    {dropdownOptions[f.dropdownKey].map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (isAcademicSection && f.value === 'country') {
              return <div key={j}>{val || '-'}</div>;
            }

            return (
              <div key={j}>
                {editing ? (
                  <input
                    type="text"
                    value={item[f.value] ?? ""}
                    onChange={(e) => {
                      const updated = [...data];
                      updated[i][f.value] = e.target.value;
                      setData(updated);
                    }}
                    style={{ width: "100%" }}
                    disabled={isAcademicSection && f.value === 'country'}
                  />
                ) : (
                  safeValue(val)
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </>
);

  const personalFields = user.length > 0 ? [
    { label: 'First Name', value: u => u.basic_information?.first_name },
    { label: 'Rwandan Name', value: u => u.basic_information?.rwandan_name },
    { label: 'Gender', value: u => u.basic_information?.gender },
    { label: 'Date of Birth', value: u => u.basic_information?.date_of_birth },
    { label: 'Place of Birth', value: u => `${u.place_of_birth?.origin_district}, ${u.place_of_birth?.origin_sector}` }
  ] : [];
  const currentInfoFields = user.length > 0 ? [
    { label: 'Marital Status', value: u => u.personal_status?.marital_status, dropdownKey: 'marital_statuses' },
    { label: 'Children', value: u => u.personal_status?.has_children ? "Yes" : "No", dropdownKey: 'children_options' },
    { label: 'City', value: u => u.current_address?.current_district_or_city },
    { label: 'Country', value: u => u.current_address?.current_county }
  ] : [];
  const asyvIdentityFields = [
    { label: 'Grade', value: u => u.affiliation?.grade_info?.grade_name },
    { label: 'Family', value: u => u.affiliation?.family_name },
    { label: 'Combination', value: u => u.academic_combinations?.slice(-1)[0]?.combination_name }
  ];
  const asyvAcademicFields = [
    { label: 'S4 Grade', value: u => u.kid?.s4marks + '%' },
    { label: 'S5 Grade', value: u => u.kid?.s5marks + '%' },
    { label: 'S6 Grade', value: u => u.kid?.s6marks + '%' },
    { label: 'National Exam Score', value: u => `${u.national_exam_results?.points_achieved}/${u.national_exam_results?.maximum_points} (${u.national_exam_results?.mention})` }
  ];
  const leapProgramFields = [

    { label: 'Leap Program', value: u => u.leap_activities?.map((a) => `${a.leap_name}`).join(", ") || 'Not Found' }
  ];
  const academicFields = [
    { label: 'Level', value: 'level', dropdownKey: 'levels' },
    { label: 'Degree', value: 'degree' },
    { label: 'University', value: 'college', dropdownKey: 'colleges' },
    { label: 'Location', value: 'country' },
    { label: 'Status', value: 'status', dropdownKey: 'status' }
  ];
  const employmentFields = [
    { label: 'Title', value: 'title' },
    { label: 'Company', value: 'company' },
    { label: 'Status', value: 'status', dropdownKey: 'employment_status'},
    { label: 'Industry', value: 'industry', dropdownKey: 'industries' },
    { label: 'Start Date', value: 'start_date',  type: 'date' },
    { label: 'End Date', value: 'end_date', type: 'date' }
  ];
  
  return (
    <div className="profile-container vertical-cards">
      <ProfileCardSection title="Personal Info" canEdit={false}>
        {renderSection(user, setUser, personalFields)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Current Info"
        isEditing={editState.current}
        onToggleEdit={() => {
          if (editState.current) {
            saveCurrentInfo();
          }
          setEditState(prev => ({ ...prev, current: !prev.current }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, current: false }))}
      >
        {renderSection(user, setCurrentInfo, currentInfoFields, editState.current)}
      </ProfileCardSection>
      <ProfileCardSection title="ASYV Info" canEdit={false}>
        {renderSection(user, setUser, asyvIdentityFields)}
        {renderSection(user, setUser, asyvAcademicFields)}
        {renderSection(user, setUser, leapProgramFields)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Academic Info"
        isEditing={editState.academic}
        onToggleEdit={() => {
          if (editState.academic) {
            saveStudyData();
          }
          setEditState(prev => ({ ...prev, academic: !prev.academic }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, academic: false }))}
        onAddRow={() => setStudy(prev => [...prev, {}])}
      >
        {renderSection(study, setStudy, academicFields, editState.academic, false, true)}
      </ProfileCardSection>
      <ProfileCardSection
        title="Employment Info"
        isEditing={editState.employment}
        onToggleEdit={() => {
          if (editState.employment) {
            saveEmploymentData();
          }
          setEditState(prev => ({ ...prev, employment: !prev.employment }));
        }}
        onCancelEdit={() => setEditState(prev => ({ ...prev, employment: false }))}
        onAddRow={() => setEmployment(prev => [...prev, {}])}
      >
        {renderSection(employment, setEmployment, employmentFields, editState.employment, true, false)}
      </ProfileCardSection>
    </div>
  );
};
export default ProfileCard;