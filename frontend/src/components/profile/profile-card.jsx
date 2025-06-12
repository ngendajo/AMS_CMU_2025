import React, { useState, useEffect, useMemo } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './profile-card.css';

import countryList from 'react-select-country-list'

const ProfileCard = () => {
  const [user, setUser] = useState([]);
  const { auth } = useAuth();
  const [user_id, setUser_id] = useState();
  const [kid_id, setKid_id] = useState(); 
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // change current address (from Joseph)
  const options = useMemo(() => countryList().getData(), []);
  const sectorsByDistrict = {
   'Gasabo':[
     'Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana',
     'Jali', 'Kacyiru', 'Kimihurura', 'Kimiromko', 'Kinyinya',
     'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'
   ],
   'Kicukiro':['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
   'Nyarugenge':[
     'Gitega', 'Kanyinya', 'Kigali', 'Kimisagara',
     'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo',
     'Nyarugenge', 'Rwezamenyo'
   ],
   'Burera':['Bungwe','Butaro','Cyanika','Cyeru','Gahunga','Gatebe','Gitovu','Kagogo','Kinoni','Kinyababa','Kivuye','Nemba','Rugarama','Rugengabari','Ruhunde','Rusarabuye','Rwerere'],
   'Gakenke':[
     'Busengo', 'Coko', 'Cyabingo', 'Gakenke', 'Gashenyi', 'Janja', 'Kamubuga',
     'Karambo', 'Kivuruga', 'Mataba', 'Minazi', 'Mugunga', 'Muhondo', 'Muyongwe',
     'Muzo', 'Nemba', 'Ruli', 'Rusasa', 'Rushashi'
   ],
   'Gicumbi':[
     'Bukure', 'Bwisige', 'Byumba', 'Cyumba', 'Giti', 'Kageyo', 'Kaniga', 'Manyagiro',
     'Miyove', 'Mukarange', 'Muko', 'Mutete', 'Nyamiyaga', 'Nyankenke', 'Rubaya',
     'Rukomo', 'Rushaki', 'Rutare', 'Ruvune', 'Rwamiko', 'Shangasha'
   ],
   'Musanze':['Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi', 'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro'],
   'Rulindo':[
     'Base', 'Burega', 'Bushoki', 'Buyoga', 'Cyinzuzi', 'Cyungo',
     'Kinihira', 'Kisaro', 'Masoro', 'Mbogo', 'Murambi', 'Ngoma',
     'Ntarabana', 'Rukozo', 'Rusiga', 'Shyorongi', 'Tumba'
   ],
   'Gisagara':["Gikonko", "Gishubi", "Kansi", "Kibirizi", "Kigembe", "Mamba", "Muganza", "Mugombwa", "Mukingo", "Musha", "Ndora", "Nyanza", "Save"],
   'Huye':['Gishamvu', 'Huye', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'],
   'Kamonyi':[
     'Gacurabwenge', 'Karama', 'Kayenzi', 'Kayumbu', 'Mugina',
     'Musambira', 'Ngamba', 'Nyamiyaga', 'Nyarubaka', 'Rugarika',
     'Rukoma', 'Runda'
   ],
   'Muhanga':[
     'Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga',
     'Mushishiro', 'Nyabinoni', 'Nyamabuye', 'Nyarusange', 'Rongi',
     'Rugendabari', 'Shyogwe'
   ],
   'Nyamagabe':[
     'Buruhukiro', 'Cyanika', 'Gasaka', 'Gatare', 'Kaduha',
     'Kamegeri', 'Kibirizi', 'Kibumbwe', 'Kitabi', 'Mbazi',
     'Mugano', 'Musange', 'Musebeya', 'Mushubi', 'Nkomane',
     'Tare', 'Uwinkingi'
   ],
   'Nyanza':[
     'Busasamana', 'Busoro', 'Cyabakamyi', 'Kibirizi', 'Kigoma',
     'Mukingo', 'Muyira', 'Ntyazo', 'Nyagisozi', 'Rwabicuma'
   ],
   'Nyaruguru':[
     'Busanze', 'Cyahinda', 'Kibeho', 'Kivu', 'Mata',
     'Muganza', 'Munini', 'Ngera', 'Ngoma', 'Nyabimata',
     'Nyagisozi', 'Ruheru', 'Ruramba', 'Rusenge'
   ],
   'Ruhango':['Bweramana', 'Byimana', 'Kabagali', 'Kinazi', 'Kinihira', 'Mbuye', 'Mwendo', 'Ntongwe', 'Ruhango'], 
   'Bugesera':['Gashora','Juru','Kamabuye','Mareba','Mayange','Musenyi','Mwogo','Ngeruka','Ntarama','Nyamata','Nyarugenge','Rilima','Ruhuha','Rweru','Shyara'],
    'Gatsibo':['Gasange', 'Gatsibo', 'Gitoki', 'Kabarore', 'Kageyo', 'Kiramuruzi', 'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'],
   'Kayonza':[
     'Gahini', 'Kabare', 'Kabarondo',
     'Mukarange', 'Murama', 'Murundi',
     'Mwiri', 'Ndego', 'Nyamirama',
     'Rukara', 'Ruramira', 'Rwinkwavu'
   ],
   'Kirehe':['Gahara', 'Gatore', 'Kigarama', 'Kigina', 'Kirehe', 'Mahama', 'Mpanga', 'Musaza', 'Mushikiri', 'Nasho', 'Nyamugari', 'Nyarubuye'],
   'Ngoma':['Gashanda', 'Jarama', 'Karembo', 'Kazo', 'Kibungo', 'Mugesera', 'Murama', 'Mutenderi', 'Remera', 'Rukira', 'Rukumberi', 'Rurenge', 'Sake', 'Zaza'],
   'Nyagatare':[
     'Gatunda', 'Karama', 'Karangazi', 'Katabagemu', 'Kiyombe',
     'Matimba', 'Mimuri', 'Mukama', 'Musheri', 'Nyagatare',
     'Rukomo', 'Rwempasha', 'Rwimiyaga', 'Tabagwe'
   ],
   'Rwamagana':[
     "Fumbwe", "Gahengeri", "Gishali", "Karenge", "Kigabiro", "Muhazi",
     "Munyaga", "Munyiginya", "Musha", "Muyumbu", "Mwulire", "Nyakaliro",
     "Nzige", "Rubona"
   ],
    'Karongi':[
     'Bwishyura', 'Gishari', 'Gishyita', 'Gitesi', 'Mubuga', 'Murambi',
     'Murundi', 'Mutuntu', 'Rubengera', 'Rugabano', 'Ruganda', 'Rwankuba', 'Twumba'
   ],
   'Ngororero':[
     'Bwira', 'Gatumba', 'Hindiro', 'Kabaya', 'Kageyo',
     'Kavumu', 'Matyazo', 'Muhanda', 'Muhororo', 'Ndaro',
     'Ngororero', 'Nyange', 'Sovu'
   ],
   'Nyabihu':['Bigogwe', 'Jenda', 'Jomba', 'Kabatwa', 'Karago', 'Kintobo', 'Mukamira', 'Muringa', 'Rambura', 'Rugera', 'Rurembo', 'Shyira'],
   'Nyamasheke':[
     'Bushekeri', 'Bushenge', 'Cyato', 'Gihombo', 'Kagano',
     'Kanjongo', 'Karambi', 'Karengera', 'Kirimbi', 'Macuba',
     'Mahembe', 'Nyabitekeri', 'Rangiro', 'Ruharambuga', 'Shangi'
   ], 
   'Rubavu':[
     'Bugeshi', 'Busasamana', 'Cyanzarwe',
     'Gisenyi', 'Kanama', 'Kanzenze',
     'Mudende', 'Nyakiriba', 'Nyamyumba',
     'Nyundo', 'Rubavu', 'Rugerero'
   ],
   'Rusizi':[
     'Bugarama', 'Butare', 'Bweyeye', 'Gashonga', 'Giheke', 'Gihundwe',
     'Gikundamvura', 'Gitambi', 'Kamembe', 'Muganza', 'Mururu', 'Nkanka',
     'Nkombo', 'Nkungu', 'Nyakabuye', 'Nyakarenzo', 'Nzahaha', 'Rwimbogo'
   ],
   'Rutsiro':['Boneza', 'Gihango', 'Kigeyo', 'Kivumu', 'Manihira', 'Mukura', 'Murunda', 'Musasa', 'Mushonyi', 'Mushubati', 'Nyabirasi', 'Ruhango', 'Rusebeya'], 
  };
  const commonIndustry = [
    "Agriculture, Forestry, and Fishing",
    "Art, Design, and Performance",
    "Beauty and Personal Care",
    "Business and Management",
    "Construction and Engineering",
    "Dining and Hospitality Services",
    "Education and Training",
    "Energy and Utilities",
    "Finance and Banking",
    "Government and Public Service",
    "Healthcare and Medical Services",
    "Information Technology and Software Development",
    "Legal Services",
    "Logistics and Transportation",
    "Manufacturing and Production",
    "Marketing, Sales, and Customer Service",
    "Media and Communication",
    "Real Estate and Property Management",
    "Research and Development",
    "Security and Law Enforcement",
    "Social Work and Community Services",
    "Sports and Recreation",
    "Telecommunications",
    "Trade and Skilled Labor",
    "Others / Not Specified"
]

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(baseUrl + '/kid/' + auth.user.id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        setUser_id(auth.user.id);
        //console.log("API response data:", response.data.data);
        setUser(response.data);
        setKid_id(response.data.basic_information.kid_id);
      } catch (err) {
        //console.log(baseUrl + '/users/' + auth.user.id)
        console.log(err);
      }
    };

    getUsers();
  }, [auth, refreshTrigger, user_id]);

  // useEffect(() => {
  //   if (user) {
  //     console.log("User state updated:", user);
  //   }
  // }, [user]);

  const sortStudyLevel = (studies) => {
    const levelOrder = {
      C: 1,
      A1: 2,
      A0: 3,
      M: 4,
      PHD: 5,
    };
    return studies.sort((a, b) => {
      const levelComparison = levelOrder[a.level] - levelOrder[b.level];
      if (levelComparison !== 0) {
        return levelComparison;
      }
      return a.degree.localeCompare(b.degree);
    });
  }

  const getStudy = async () => {
    try {
        const response = await axios.get(baseUrl + '/alumni-academic/?id=' + user_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        var studies = []
        response.data.forEach(element => {
          studies.push({
            // "id": element.id,
            // "alumn": element.alumn.id,
            "level": element.level,
            "degree": element.degree,
            "college": element.college,
            "location": element.location,
            "scholarship": element.scholarship,
            "scholarship_details": element.scholarship_details,
            "status": element.status
          })
        })
        setStudy(sortStudyLevel(studies));
      
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    getStudy();
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
  }

  const getEmploy = async () => {
    try {
      if (user_id != null) {
        const response = await axios.get(baseUrl + '/alumni-employment/?id=' + user_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        console.log(response.data);
        var jobs = []
        response.data.forEach(element => {
          jobs.push({
            // "id": element.id,
            // "alumn": element.alumn.id,
            "title": element.title,
            "status": element.status,
            "company": element.company,
            "industry": element.industry,
            "start_date": element.start_date,
            "end_date": element.end_date
          })
        })
        setEmployment(sortJobDate(jobs));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEmploy();
  }, [auth, user_id]);

  const [editMode, setEditMode] = useState(false);
  const [requestMode, setRequestMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    rwandaOrNot: '',
    districtOrSector: '',
    countryOrCity: ''
  });
  const [maritalStatus, setMaritalStatus] = useState('');
  const [children, setChildren] = useState('');

  const [newStudies, setNewStudies] = useState([]);
  const [newJobs, setNewJobs] = useState([]);

  useEffect(() => {
    if (user.length > 0) {
      setMaritalStatus(user[0].alumn.marital_status);
      setChildren(user[0].alumn.kids);
      setCurrentAddress({
        rwandaOrNot: user[0].alumn.currresidence_in_rwanda,
        districtOrCountry: user[0].alumn.currresidence_district_or_country,
        sectorOrCity: user[0].alumn.currresidence_sector_or_city
      });
    }
  }, [user]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
  const toggleRequestMode = () => {
    setRequestMode(!requestMode);
  };
  const toggleMode = () => {
    if (activeTab === 'personal') {
      editMode ? handleSaveChanges() : toggleEditMode();
    } else if (activeTab === 'academic') {
      requestMode ? handleRequestAcademic() : toggleRequestMode();
    } else if (activeTab === 'employment') {
      requestMode ? handleRequestEmployment() : toggleRequestMode();
    }
  };

  const handleSaveChanges = async () => {
    if (!currentAddress.districtOrCountry.trim() || !currentAddress.sectorOrCity.trim()) {
      alert('Please fill out all fields of current address.');
      return;
    }
    axios.put(baseUrl+'/kid/'+user_id+"/", {
      "current_county": currentAddress.districtOrCountry,
      "marital_status": maritalStatus,
      "has_children": children,
      "current_district_or_city": currentAddress.sectorOrCity,
    },
    {
      headers: {
        "Authorization": 'Bearer ' + String(auth.accessToken),
        "Content-Type": 'application/json'
      }
    }
    )
    .then(res =>{
        console.log(res)
        alert("Saved successfully") 
        setEditMode(false);
        setRefreshTrigger(prev => prev + 1);
    })
    .catch(error => console.log(error.response))
    
  };
  const handleMaritalStatusChange = (e) => {
    setMaritalStatus(e.target.value);
  };
  const handleChildrenChange = (e) => {
    setChildren(e.target.value);
  };
  const handleCurrentAddressChange = (key, value) => {
    setCurrentAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'rwandaOrNot' ? { districtOrCountry: '' } : {}),
      ...(key === 'rwandaOrNot' ? { sectorOrCity: '' } : {}),
      ...(key === 'districtOrCountry' ? { sectorOrCity: '' } : {})
    }));
  };
  
  // academic
  const validateStudy = (studies) => {
    for (let study of studies) {
      if (
        !study.level ||
        !study.degree ||
        !study.university ||
        !study.country ||
        !study.city ||
        !study.scholarship ||
        !study.status ||
        (study.scholarship !== "NS" && !study.scholarship_details)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleRequestAcademic = async () => {
    try {
      if (!validateStudy(study)) {
        alert("Please fill out all fields for the studies.");
        return;
      }
      if (newStudies.length > 0 && !validateStudy(newStudies)) {
        alert("Please fill out all fields for the new studies.");
        return;
      }
      const createResponse = await axios.post(baseUrl + '/bulk_create_studies/', newStudies, {
        headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken),
          "Content-Type": 'application/json'
        }
      });
      console.log(createResponse);
      const updateResponse = await axios.put(baseUrl + '/bulk-update-studie/', study, {
        headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken),
          "Content-Type": 'application/json'
        }
      });
      console.log(updateResponse);
      await getStudy();
      alert("Saved successfully");
      setRequestMode(false);
      setNewStudies([]);
    } catch (error) {
      console.log(error.response);
    }
  };
  const handleAddStudy = () => {
    setNewStudies([...newStudies, {
        "alumn": kid_id,
        "level": '',
        "degree": '',
        "university": '',
        "country": '',
        "city": '',
        "scholarship": '',
        "scholarship_details": '',
        "status": ''
    }]);
  };
  const handleStudyChange = (index, event) => {
    const { name, value } = event.target;
    const updatedStudies = [...newStudies];
    const [field, fieldIndex] = name.split('-');
    updatedStudies[index] = {
      ...updatedStudies[index],
      [field]: value
    };
    if (field === 'scholarship' && value === 'NS') {
      updatedStudies[index].scholarship_details = '';
    }
    setNewStudies(updatedStudies);
  };
  const handleDeleteS = async (event) => {
    const confirmed = window.confirm('Are you sure you want to delete this study?');
        if (!confirmed) {
            return;
        }
    try {
      await axios.delete(`${baseUrl}/deletestudie/${event}/delete/`, {
        headers: {
          "Authorization": `Bearer ${auth.accessToken}`,
          "Content-Type": 'application/json'
        }
      });
      await getStudy();
    } catch (err) {
      console.log(err);
    }
  };
  const handleCancelS = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this study?');
        if (!confirmed) {
            return;
        }
    const updatedStudies = newStudies.filter((_, i) => i !== index);
    setNewStudies(updatedStudies);
  };
  
  // employment
  const validateJob = (jobs) => {
    for (let job of jobs) {
      if (
        !job.title ||
        !job.status ||
        !job.company ||
        !job.industry ||
        !job.start_date ||
        (job.on_going === false && !job.end_date)
      ) {
        return false;
      }
    }
    return true;
  };
  const handleRequestEmployment = async () => {
    try {
      if (!validateJob(employment)) {
        alert("Please fill out all fields for the jobs.");
        return;
      }
      if (newJobs.length > 0 && !validateJob(newJobs)) {
        alert("Please fill out all fields for the new jobs.");
        return;
      }
      const createResponse = await axios.post(baseUrl + '/employments/bulk_create_update/', newJobs, {
        headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken),
          "Content-Type": 'application/json'
        }
      });
      console.log(createResponse);
      const updateResponse = await axios.put(baseUrl + '/employments/bulk_create_update/', employment, {
        headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken),
          "Content-Type": 'application/json'
        }
      });
      console.log(updateResponse);
      await getEmploy();
      alert("Saved successfully");
      setRequestMode(false);
      setNewJobs([]);
    } catch (error) {
      console.log(error.response);
    }
  };
  const handleAddJob = () => {
    setNewJobs([...newJobs, {
      "alumn": kid_id,
      "title": '',
      "status": '',
      "company": '',
      "career": '',
      "start_date": '',
      "end_date": '',
      "on_going": false
    }]);
  };
  const handleJobChange = (index, event) => {
    const { name, type, checked, value } = event.target;
    const updatedJobs = [...newJobs];
    const inputValue = type === 'checkbox' ? checked : value;
    const [field, fieldIndex] = name.split('-');
    updatedJobs[index] = {
      ...updatedJobs[index],
      [field]: inputValue
    };
    if (field === 'on_going' && checked) {
      updatedJobs[index].end_date = '';
    }
    setNewJobs(updatedJobs);
  };
  const handleDeleteE = async (event) => {
    const confirmed = window.confirm('Are you sure you want to delete this employment?');
        if (!confirmed) {
            return;
        }
    try {
      await axios.delete(`${baseUrl}/employment/${event}/delete/`, {
        headers: {
          "Authorization": `Bearer ${auth.accessToken}`,
          "Content-Type": 'application/json'
        }
      });
      await getEmploy();
    } catch (err) {
      console.log(err);
    }
  };
  const handleCancelE = (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this employment?');
        if (!confirmed) {
            return;
        }
    const updatedJobs = newJobs.filter((_, i) => i !== index);
    setNewJobs(updatedJobs);
  };

  // parser
  const getEPSLabel = (eps) => {
    switch (eps) {
      case 'art_center':
        return 'Art';
      case 'sport':
        return 'Sport';
      case 'science_center':
        return 'Sciences';
      case 'club':
        return 'Club';
      case 'professional':
        return 'Professional';
      case 'programming': 
        return 'Programming';
      default:
        return '';
    }
  };
  const getChildrenLabel = (kid) => {
    switch (kid) {
      case 'yes':
        return 'Yes';
      case 'no':
        return 'No';
      default:
        return '';
    }
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
  const getScholarshipLabel = (scholarship) => {
    switch (scholarship) {
      case 'F':
        return 'Full Scholarship by ';
      case 'P':
        return 'Partial Scholarship by ';
      case 'S':
        return 'Self Sponsor';
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
  const getTypeLabel = (type) => {
    switch (type) {
      case 'F':
        return 'Full Time';
      case 'P':
        return 'Part Time';
      case 'S':
        return 'Self-Employed';
      case 'I':
        return 'Intern';
      default:
        return '';
    }
  };
  const handleLevelChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].level = value;
    setStudy(updatedStudy);
  };
  const handleDegreeChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].degree = value;
    setStudy(updatedStudy);
  };
  const handleInstitutionChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].university = value;
    setStudy(updatedStudy);
  };
  const handleCountryChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].country = value;
    setStudy(updatedStudy);
  };
  const handleCityChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].city = value;
    setStudy(updatedStudy);
  };
  const handleScholarshipChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].scholarship = value;
    if (value === 'NS') {
      updatedStudy[index].scholarship_details = '';
    }
    setStudy(updatedStudy);
  };
  const handleScholarshipDetailsChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].scholarship_details = value;
    setStudy(updatedStudy);
  };
  const handleStudyStatusChange = (index, value) => {
    const updatedStudy = [...study];
    updatedStudy[index].status = value;
    setStudy(updatedStudy);
  };
  const handleTitleChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].title = value;
    setEmployment(updatedJob);
  };
  const handleTypeChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].status = value;
    setEmployment(updatedJob);
  };
  const handleCompanyChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].company = value;
    setEmployment(updatedJob);
  };
  const handleFieldChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].career = value;
    setEmployment(updatedJob);
  };
  const handleStartTimeChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].start_date = value;
    setEmployment(updatedJob);
  };
  const handleOngoingChange = (index, checked) => {
    const updatedJob = [...employment];
    updatedJob[index].on_going = checked;
    if (checked) {
      updatedJob[index].end_date = '';
    }
    setEmployment(updatedJob);
  };
  const handleEndTimeChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].end_date = value;
    setEmployment(updatedJob);
  };


  // layout starts here
  const renderContent = () => {

    //const combinationStyle = (combination) => combination.replace(/-/g, ', ')

    switch (activeTab) {
      case 'personal':
        return (
          <>
            <div className="profile-table">
              <table className="fixed-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Rwandan Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Place of Birth</th>
                  </tr>
                </thead>
                <tbody>
                {user && (
                  <tr>
                    <td>{user.basic_information?.first_name}</td>
                    <td>{user.basic_information?.rwandan_name}</td>
                    <td>{user.basic_information?.gender}</td>
                    <td>{user.basic_information?.date_of_birth}</td>
                    <td>{user.place_of_birth?.origin_district}, {user.place_of_birth?.origin_sector}</td>
                  </tr>
                )}
                </tbody>
              </table>
              <table className={`fixed-table rest ${editMode ? 'edit-mode' : ''}`}>
                <thead>
                  <tr>
                    <th>ASYV Affiliation</th>
                    <th>Combination</th>
                    <th>LEAP Programs</th>
                    <th>S4, S5, S6 Grades</th>
                    <th>National Exam</th>
                  </tr>
                </thead>
                <tbody>
                {user && (
                  <tr>
                    <td>{`Grade: ${user.affiliation?.grade_info?.grade_name}`}<br />
                        {`Family: ${user.affiliation?.family_name}
                        (No.${user.affiliation?.family_number})`}</td>
                    <td>{user.academic_combinations?.[user.academic_combinations.length - 1]?.combination_name}</td>
                    <td>{user.leap_activities?<>
                      {user.leap_activities.map((ep,j)=>(
                        <span key={j}>
                          {`${j+1}.${ep.leap_name} (${getEPSLabel(ep.category)})`}<br />
                        </span>
                      ))}
                    </>:<></>}
                    </td>
                    <td>{`${user.kid?.s4marks}%,
                          ${user.kid?.s5marks}%,
                          ${user.kid?.s6marks}%`}</td> 
                    <td>{`${user.national_exam_results?.points_achieved}/${user.national_exam_results?.maximum_points} 
                          (${user.national_exam_results?.mention })`}</td>
                  </tr>
                  )}
                </tbody>
              </table>
              <table className={`fixed-table rest last ${editMode ? 'edit-mode' : ''}`}>
                <thead>
                  <tr>
                    <th>Marital Status</th>
                    <th>Children</th>
                    <th>Current Address</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {user && (
                  <tr>
                    <td>{user.personal_status?.marital_status}</td>
                    <td>{user.personal_status?.has_children === true ? 'True': 'False'}</td>
                    <td>{user.current_address?.current_district_or_city}, {user.current_address?.current_county}</td>
                  </tr>
                )}
                {editMode ? (
                    <tr>
                      <td>
                        <select value={maritalStatus} onChange={handleMaritalStatusChange}>
                        <option value="" disabled>Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </td>
                      <td>
                        <select value={children} onChange={handleChildrenChange}>
                          <option value="" disabled>Select Children</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </td>
                      <td>
                        <>
                        <select
                          value={currentAddress.rwandaOrNot.toString()}
                          onChange={(e) => handleCurrentAddressChange('rwandaOrNot', e.target.value)}
                        >
                          <option value="yes">Rwanda</option>
                          <option value="no">Abroad</option>
                        </select>
                        {currentAddress.rwandaOrNot === "yes" ? (
                          <>
                            <select value={currentAddress.districtOrCountry} onChange={(e) => handleCurrentAddressChange('districtOrCountry', e.target.value)} >
                            <option value="" disabled>Select District</option>
                              {Object.keys(sectorsByDistrict).map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                            </select>
                            <select value={currentAddress.sectorOrCity} onChange={(e) => handleCurrentAddressChange('sectorOrCity', e.target.value)} >
                            <option value="" disabled>Select Sector</option>
                              {currentAddress.districtOrCountry && sectorsByDistrict[currentAddress.districtOrCountry].map((sector) => (
                                <option key={sector} value={sector}>
                                  {sector}
                                </option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            <select value={currentAddress.districtOrCountry} onChange={(e) => handleCurrentAddressChange('districtOrCountry', e.target.value)} >
                            <option value="" disabled>Select Country</option>
                              {options.map((option) => (
                                <option key={option.value} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <input
                            type="text"
                            placeholder="City"
                            value={currentAddress.sectorOrCity}
                            onChange={(e) => handleCurrentAddressChange('sectorOrCity', e.target.value)}
                            />
                          </>
                        )}
                        </>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                ) : (
                    <tr>
                      <td>{maritalStatus}</td>
                      <td>{getChildrenLabel(children)}</td>
                      <td>{(currentAddress.districtOrCountry && currentAddress.sectorOrCity) && `${currentAddress.districtOrCountry}, ${currentAddress.sectorOrCity}`}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'academic':
        return (
          <>
            <div className="profile-table">
              <table className={`detail-table ${requestMode ? 'request-mode' : ''}`}>
                <thead>
                  <tr>
                    <th>Degree</th>
                    <th>Institution</th>
                    <th>Location</th>
                    <th>Scholarship</th>
                    <th>Study Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {requestMode ? (
                  <>
                  {study.map((stu, i) => (
                    <tr key={i}>
                      <td>
                        <select
                          value={stu.level}
                          onChange={(e) => handleLevelChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Degree</option>
                          <option value="A1">Advanced Diploma</option>
                          <option value="A0">Bachelor</option>
                          <option value="M">Master</option>
                          <option value="PHD">Ph.D.</option>
                          <option value="C">Certificate</option>
                        </select>
                        <input
                          type="text"
                          value={stu.degree}
                          onChange={(e) => handleDegreeChange(i, e.target.value)}
                          placeholder="Details"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={stu.university}
                          onChange={(e) => handleInstitutionChange(i, e.target.value)}
                          placeholder="Institution"
                        />
                      </td>
                      <td>
                        <select
                          value={stu.country}
                          onChange={(e) => handleCountryChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Country</option>
                            {options.map((option) => (
                              <option key={option.value} value={option.label}>
                                {option.label}
                              </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={stu.city}
                          onChange={(e) => handleCityChange(i, e.target.value)}
                          placeholder="City"
                        />
                      </td>
                      <td>
                        <select
                          value={stu.scholarship}
                          onChange={(e) => handleScholarshipChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="F">Full</option>
                          <option value="P">Partial</option>
                          <option value="NS">No Scholarship</option>
                        </select>
                        {stu.scholarship !== "NS" && <input
                          type="text"
                          value={stu.scholarship_details}
                          onChange={(e) => handleScholarshipDetailsChange(i, e.target.value)}
                          placeholder="Details"
                        />}
                      </td>
                      <td>
                        <select
                          value={stu.status}
                          onChange={(e) => handleStudyStatusChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="O">Ongoing</option>
                          <option value="C">Completed</option>
                          <option value="S">Suspended</option>
                          <option value="D">Dropped Out</option>
                        </select>
                      </td>
                      <td className="delete-cell">
                        <button onClick={()=>handleDeleteS(stu.id)} className="delete-button">-</button>
                      </td>
                    </tr>
                  ))}
                  {newStudies.map((newStudy, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          name={`level-${index}`}
                          value={newStudy.level}
                          onChange={(e) => handleStudyChange(index, e)}
                        >
                          <option value="" disabled>Select Degree</option>
                          <option value="C">Certificate</option>
                          <option value="A0">Bachelor</option>
                          <option value="A1">Advanced Diploma</option>
                          <option value="M">Master</option>
                          <option value="PHD">Ph.D.</option>
                        </select>
                        <input
                          type="text"
                          name={`degree-${index}`}
                          value={newStudy.degree}
                          onChange={(e) => handleStudyChange(index, e)}
                          placeholder="Details"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name={`university-${index}`}
                          value={newStudy.university}
                          onChange={(e) => handleStudyChange(index, e)}
                          placeholder="Institution"
                        />
                      </td>
                      <td>
                        <select
                          name={`country-${index}`}
                          value={newStudy.country}
                          onChange={(e) => handleStudyChange(index, e)}
                        >
                          <option value="" disabled>Select Country</option>
                            {options.map((option) => (
                              <option key={option.value} value={option.label}>
                                {option.label}
                              </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name={`city-${index}`}
                          value={newStudy.city}
                          onChange={(e) => handleStudyChange(index, e)}
                          placeholder="City"
                        />
                      </td>
                      <td>
                        <select
                          name={`scholarship-${index}`}
                          value={newStudy.scholarship}
                          onChange={(e) => handleStudyChange(index, e)}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="F">Full</option>
                          <option value="P">Partial</option>
                          <option value="NS">No Scholarship</option>
                        </select>
                        {newStudy.scholarship !== "NS" && <input
                          type="text"
                          name={`scholarship_details-${index}`}
                          value={newStudy.scholarship_details}
                          onChange={(e) => handleStudyChange(index, e)}
                          placeholder="Details"
                        />}
                      </td>
                      <td>
                        <select
                          name={`status-${index}`}
                          value={newStudy.status}
                          onChange={(e) => handleStudyChange(index, e)}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="O">Ongoing</option>
                          <option value="C">Completed</option>
                          <option value="S">Suspended</option>
                          <option value="D">Dropped Out</option>
                        </select>
                      </td>
                      <td className="delete-cell">
                        <button onClick={()=>handleCancelS(index)} className="delete-button">-</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th>
                      <button className="addStudy" onClick={handleAddStudy}>
                        Add Study
                      </button>
                    </th>
                  </tr>
                  </>
                ) : (
                  study.length > 0 ? (
                    study.map((stu, i) => (
                      <tr key={i}>
                        <td>{getLevelLabel(stu.level)+stu.degree}</td>
                        <td>{stu.college}</td>
                        <td>{stu.location}</td>
                        <td>{getScholarshipLabel(stu.scholarship)+stu.scholarship_details}</td>
                        <td>{getStudyStatusLabel(stu.status)}</td>
                        <td></td>
                      </tr>
                    )
                  )
                 ): (
                  <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'gray' }}>
                    No further education record
                  </td>
                </tr>
                 )
                 )}
                </tbody>
              </table>
            </div>    
          </>
        );
      case 'employment':
        return (
          <>
            <div className="profile-table">
              <table className={`detail-table ${requestMode ? 'request-mode' : ''}`}>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Job Type</th>
                    <th>Company</th>
                    <th>Job Industry</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {requestMode ? (
                  <>
                  {employment.map((emp, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          value={emp.title}
                          onChange={(e) => handleTitleChange(i, e.target.value)}
                          placeholder="Title"
                        />
                      </td>
                      <td>
                        <select
                          value={emp.status}
                          onChange={(e) => handleTypeChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="F">Full Time</option>
                          <option value="P">Part Time</option>
                          <option value="S">Self-Employed</option>
                          <option value="I">Intern</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={emp.company}
                          onChange={(e) => handleCompanyChange(i, e.target.value)}
                          placeholder="Company"
                        />
                      </td>
                      <td>
                        <select
                          value={emp.career}
                          onChange={(e) => handleFieldChange(i, e.target.value)}
                        >
                          <option value="" disabled>Select Industry</option>
                          {commonIndustry.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          value={emp.start_date}
                          onChange={(e) => handleStartTimeChange(i, e.target.value)}
                        />
                        {!emp.on_going && <input
                          type="date"
                          value={emp.end_date}
                          onChange={(e) => handleEndTimeChange(i, e.target.value)}
                        />}
                        <div className="check-box">
                          Ongoing:
                          <input
                            type="checkbox"
                            checked={emp.on_going}
                            onChange={(e) => handleOngoingChange(i, e.target.checked)}
                          />
                        </div>
                      </td>
                      <td className="delete-cell">
                        <button onClick={()=>handleDeleteE(emp.id)} className="delete-button">-</button>
                      </td>
                    </tr>
                  ))}
                  {newJobs.map((newJob, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          name={`title-${index}`}
                          value={newJob.title}
                          onChange={(e) => {handleJobChange(index, e)}}
                          placeholder="Title"
                        />
                      </td>
                      <td>
                        <select
                          name={`status-${index}`}
                          value={newJob.status}
                          onChange={(e) => handleJobChange(index, e)}
                        >
                          <option value="" disabled>Select Job Type</option>
                          <option value="F">Full Time</option>
                          <option value="P">Part Time</option>
                          <option value="S">Self-Employed</option>
                          <option value="I">Intern</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name={`company-${index}`}
                          value={newJob.company}
                          onChange={(e) => handleJobChange(index, e)}
                          placeholder="Company"
                        />
                      </td>
                      <td>
                        <select
                          name={`career-${index}`}
                          value={newJob.career}
                          onChange={(e) => handleJobChange(index, e)}
                        >
                          <option value="" disabled>Select Industry</option>
                          {commonIndustry.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          name={`start_date-${index}`}
                          value={newJob.start_date}
                          onChange={(e) => handleJobChange(index, e)}
                        />
                        {!newJob.on_going && <input
                          type="date"
                          name={`end_date-${index}`}
                          value={newJob.end_date}
                          onChange={(e) => handleJobChange(index, e)}
                        />}
                        <div className="check-box">
                          Ongoing:
                          <input
                            type="checkbox"
                            name={`on_going-${index}`}
                            checked={newJob.on_going}
                            onChange={(e) => handleJobChange(index, e)}
                          />
                        </div>
                      </td>
                      <td className="delete-cell">
                        <button onClick={()=>handleCancelE(index)} className="delete-button">-</button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th>
                      <button className="addJob" onClick={handleAddJob}>
                        Add Job
                      </button>
                    </th>
                  </tr>
                  </>
                ) : (
                  employment.length > 0 ? (
                  employment.map((emp, i) => (
                    <tr key={i}>
                      <td>{emp.title}</td>
                      <td>{getTypeLabel(emp.status)}</td>
                      <td>{emp.company}</td>
                      <td>{emp.career}</td>
                      <td>{emp.start_date}<br/>{"to "+(emp.on_going ? "Present" : emp.end_date)}</td>
                      <td></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'gray' }}>
                    No employment record
                  </td>
                </tr>
                )
                )
                }
                </tbody>
              </table>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (tab) => {
    if (editMode || requestMode) {
      alert('Please save your changes before switching tabs.');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-tabs">
        <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => handleTabChange('personal')}>Personal</button>
        <button className={activeTab === 'academic' ? 'active' : ''} onClick={() => handleTabChange('academic')}>Academic</button>
        <button className={activeTab === 'employment' ? 'active' : ''} onClick={() => handleTabChange('employment')}>Employment</button>
      </div>
      <div className={`profile-whitecard ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
        {renderContent()}
        <button onClick={toggleMode} className="change">
          {editMode ? "Save" :
            requestMode ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;