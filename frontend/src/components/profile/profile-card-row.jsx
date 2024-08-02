import React, { useState, useEffect, useMemo } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import './profile-card.css';

import countryList from 'react-select-country-list'

const ProfileCard = () => {
  const [user, setUser] = useState([]);
  const { auth } = useAuth();
  const [alumn_id, setAlumn_id] = useState();
  const [study, setStudy] = useState([]);
  const [employment, setEmployment] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');

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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(baseUrl + '/alumni/?id=' + auth.user.id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        setAlumn_id(response.data[0].alumn.id);
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUsers();
  }, [auth]);

  const getStudy = async () => {
    try {
      if (alumn_id != null) {
        const response = await axios.get(baseUrl + '/studie/?alumn_id=' + alumn_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        console.log(response.data);
        setStudy(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  useEffect(() => {
    getStudy();
  }, [auth, alumn_id]);

  const getEmploy = async () => {
    try {
      if (alumn_id != null) {
        const response = await axios.get(baseUrl + '/employment/?alumn_id=' + alumn_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        console.log(response.data);
        setEmployment(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEmploy();
  }, [auth, alumn_id]);

  const [editMode, setEditMode] = useState(false);
  const [requestMode, setRequestMode] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentAddress, setCurrentAddress] = useState({
    rwandaOrNot: '',
    districtOrSector: '',
    countryOrCity: ''
  });
  const [maritalStatus, setMaritalStatus] = useState('');
  const [children, setChildren] = useState('');

  const [newStudies, setNewStudies] = useState([]);
  const [newLevel, setNewLevel] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newScholarship, setNewScholarship] = useState('');
  const [newScholarshipDetails, setNewScholarshipDetails] = useState('');
  const [newStudyStatus, setNewStudyStatus] = useState('');
  
  const [newJobs, setNewJobs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newField, setNewField] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newOngoing, setNewOngoing] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  useEffect(() => {
    if (user.length > 0) {
      setEmail(user[0].email);
      setPhone(user[0].phone1);
      setCurrentAddress({
        rwandaOrNot: user[0].alumn.currresidence_in_rwanda || '',
        districtOrCountry: user[0].alumn.currresidence_district_or_country || '',
        sectorOrCity: user[0].alumn.currresidence_sector_or_city || ''
      });
      setMaritalStatus(user[0].alumn.marital_status || '');
      setChildren(user[0].alumn.kids || '');
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

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const handleSaveChanges = async () => {
    if (!validatePhone(phone)) {
        alert('Invalid phone format. Please enter a valid phone number.');
        return;
      }
    if (!currentAddress.districtOrCountry.trim() || !currentAddress.sectorOrCity.trim()) {
      alert('Please fill out all fields of current address.');
      return;
    }
    axios.put(baseUrl+'/alumni/update-profile/'+alumn_id+"/", {
      "currresidence_in_rwanda": currentAddress.rwandaOrNot === 'true',
      "currresidence_district_or_country": currentAddress.districtOrCountry,
      "currresidence_sector_or_city": currentAddress.sectorOrCity,
      "marital_status": maritalStatus,
      "kids": children === 'true',
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
        alert("Updated successfully") 
        setEditMode(false);
    })
    .catch(error => console.log(error.response))
    
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
  const handleMaritalStatusChange = (e) => {
    setMaritalStatus(e.target.value);
  };
  const handleChildrenChange = (e) => {
    const value = e.target.value === 'true';
    setChildren(value);
  };

  // academic and employment
  const validateNewStudy = () => {
    return newLevel.trim() !== '' && newDegree.trim() !== '' &&
           newInstitution.trim() !== '' &&
           newCountry.trim() !== '' && newCity.trim() !== '' &&
           newScholarship.trim() !== '' && newScholarshipDetails.trim() !== '' &&
           newStudyStatus.trim() !== '';
  };
  const validateNewJob = () => {
    return newTitle.trim() !== '' &&
           newType.trim() !== '' &&
           newCompany.trim() !== '' &&
           newField.trim() !== '' &&
           newStartTime.trim() !== '' && newOngoing.trim() !== '' && newEndTime.trim() !== '';
  };
  const handleRequestAcademic = () => {
    if (newStudies.length > 0 && !validateNewStudy()) {
      alert("Please fill out all fields for the new study.");
      return;
    }
    if (newStudies.length > 0 && validateNewStudy()) {
      // const updatedStudy = [...study, ...newStudies];
      // setStudy(updatedStudy);
      axios.post(baseUrl+'/studie/', {
        "alumn": user[0].alumn_id,
        "level": newStudies.level,
        "degree": newStudies.degree,
        "university": newStudies.university,
        "country": newStudies.country,
        "city": newStudies.city,
        "scholarship": newStudies.scholarship,
        "scholarship_details": newStudies.scholarship_details,
        "status": newStudies.status,
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
          getStudy();
          alert("Created successfully")
          setRequestMode(false);
        })
        .catch(error => console.log(error.response))
      setNewStudies([]);
    }
  };
  const handleAddStudy = () => {
    if (newStudies.length === 0) {
      const newStudy = { level: newLevel, degree: newDegree,
                         university: newInstitution,
                         country: newCountry, city: newCity,
                         scholarship: newScholarship, scholarship_details: newScholarshipDetails,
                         status: newStudyStatus, };
      setNewStudies([...newStudies, newStudy]);
      setNewLevel('');
      setNewDegree('');
      setNewInstitution('');
      setNewCountry('');
      setNewCity('');
      setNewScholarship('');
      setNewScholarshipDetails('');
      setNewStudyStatus('');
    }
    else {
      alert("You can only add one study at a time.");}
  };
  const handleRequestEmployment = () => {
    if (newJobs.length > 0 && !validateNewJob()) {
      alert("Please fill out all fields for the new job.");
      return;
    }
    if (newJobs.length > 0 && validateNewJob()) {
      console.log(newJobs)
        axios.post(baseUrl+'/employment/', {
        "alumn": alumn_id,
        "title": newJobs[0].title,
        "status": newJobs[0].type,
        "company": newJobs[0].company,
        "career": newJobs[0].field,
        "start_date": newJobs[0].statusS,
        "on_going": newJobs[0].ongoing,
        "end_date": newJobs[0].statusE,
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
          getEmploy();
          alert("Created successfully")
          setRequestMode(false);
        })
        .catch(error => console.log(error.response))
      // const updatedJob = [...employment, ...newJobs];
      // setEmployment(updatedJob);
      setNewJobs([]);
    }
  };
  const handleAddJob = () => {
    if (newJobs.length === 0) {
      const newJob = { title: newTitle,
                       type: newType,
                       company: newCompany,
                       field: newField,
                       statusS: newStartTime, ongoing: newOngoing, statusE: newEndTime };
      setNewJobs([newJob]);
      setNewTitle('');
      setNewType('');
      setNewCompany('');
      setNewField('');
      setNewStartTime('');
      setNewOngoing('');
      setNewEndTime('');
    }
    else {
      alert("You can only add one job at a time.");}
  };
  const getLevelLabel = (level) => {
    switch (level) {
      case 'C':
        return 'Certificate of ';
      case 'A0':
        return 'Bachelor in ';
      case 'A1':
        return 'Advanced Diploma of ';
      case 'M':
        return 'Master in ';
      case 'PHD':
          return 'Ph.D. in ';
      default:
        return '';
    }
  };
  const getScholarshipLabel = (scholarship) => {
    switch (scholarship) {
      case 'F':
        return 'Full: ';
      case 'P':
        return 'Partial: ';
      case 'NS':
        return 'No Scholarship';
      default:
        return '';
    }
  };
  const getStudyStatusLabel = (status) => {
    switch (status) {
      case 'O':
        return 'Ongoing';
      case 'C':
        return 'Completed';
      case 'S':
        return 'Suspended';
      case 'D':
        return 'Dropped Out';
      default:
        return '';
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
  const getFieldLabel = (field) => {
    switch (field) {
      case 'IT':
        return 'Information Technology';
      case 'M':
        return 'Marketing';
      case 'DS':
        return 'Data Science';
      case 'D':
        return 'Design';
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
    setEmployment(updatedJob);
  };
  const handleEndTimeChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].end_date = value;
    setEmployment(updatedJob);
  };


  // layout starts here
  const renderContent = () => {

    const dateFormat = (dateOfBirth) => {
      const [month, date, year] = dateOfBirth.split('-');
      return `${year}-${month}-${date}`;
    };

    const emailFormat = (email) => {
      let segments = [];
      for (let i = 0; i < email.length; i += 18) {
        segments.push(email.substring(i, i + 18));
      }
      return segments.join('\n');
    };

    const combinationStyle = (combination) => combination.replace(/-/g, ', ')

    switch (activeTab) {
      case 'personal':
        return (
          <>
            <div className="profile-table">
              <table className="fixed-table1">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Place of Birth</th>
                  </tr>
                </thead>
                <tbody>
                {user.map((use, i) => (
                  <tr>
                    <td>{use.first_name}</td>
                    <td>{use.last_name}</td>
                    <td>{use.alumn.gender}</td>
                    <td>{dateFormat(use.alumn.date_of_birth)}</td>
                    <td>{`${use.alumn.place_of_birth_district_or_country},
                          ${use.alumn.place_of_birth_sector_or_city}`}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              <table className="fixed-table">
                <thead>
                  <tr>
                    <th>ASYV Grade</th>
                    <th>Combination</th>
                    <th>Extracurricular</th>
                    <th>S4, S5, S6 Grades</th>
                    <th>National Exam</th>
                  </tr>
                </thead>
                <tbody>
                {user.map((use, i) => (
                  <tr>
                    <td>{`${use.alumn.family.grade.grade_name},
                          ${use.alumn.family.family_name}
                          (No.${use.alumn.family.family_number})`}</td>
                    <td>{combinationStyle(use.alumn.combination.combination_name)}</td>
                    <td>{`${use.alumn.eps[0].title} (${use.alumn.eps[0].type}),
                          ${use.alumn.eps[1].title} (${use.alumn.eps[1].type})`}</td>
                    <td>{`${use.alumn.s4marks}%,
                          ${use.alumn.s5marks}%,
                          ${use.alumn.s6marks}%`}</td>
                    <td>{`${use.alumn.ne}/${use.alumn.maxforne} 
                          (${use.alumn.decision === "P" ? "Pass" : "Fail"})`}</td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <table className={`fixed-table ${editMode ? 'edit-mode' : ''}`}>
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Current Address</th>
                    <th>Marital Status</th>
                    <th>Children</th>
                  </tr>
                </thead>
                <tbody>
                {editMode ? (
                    <tr>
                      <td>
                        <input
                          type="text"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </td>
                      <td>
                        <>
                        <select
                          value={currentAddress.rwandaOrNot.toString()}
                          onChange={(e) => handleCurrentAddressChange('rwandaOrNot', e.target.value === 'true')}
                        >
                          <option value="true">Rwanda</option>
                          <option value="false">Abroad</option>
                        </select>
                        {currentAddress.rwandaOrNot ? (
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
                        <select value={children ? "true" : "false"} onChange={handleChildrenChange}>
                          <option value="" disabled>Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </td>
                    </tr>
                ) : (
                    <tr>
                      <td>{emailFormat(email)}</td>
                      <td>{phone}</td>
                      <td>{`${currentAddress.districtOrCountry}, ${currentAddress.sectorOrCity}`}</td>
                      <td>{maritalStatus}</td>
                      <td>{children ? "Yes" : "No"}</td>
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
                          <option value="C">Certificate</option>
                          <option value="A0">Bachelor</option>
                          <option value="A1">Advanced Diploma</option>
                          <option value="M">Master</option>
                          <option value="PHD">Ph.D.</option>
                        </select>
                        <input
                          type="text"
                          value={stu.degree}
                          onChange={(e) => handleDegreeChange(i, e.target.value)}
                          placeholder="Degree"
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
                        <input
                          type="text"
                          value={stu.scholarship_details}
                          onChange={(e) => handleScholarshipDetailsChange(i, e.target.value)}
                          placeholder="Details"
                        />
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
                    </tr>
                  ))}
                  {newStudies.map((newStudy, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value)}
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
                          value={newDegree}
                          onChange={(e) => {setNewDegree(e.target.value)}}
                          placeholder="Degree"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newInstitution}
                          onChange={(e) => setNewInstitution(e.target.value)}
                          placeholder="Institution"
                        />
                      </td>
                      <td>
                        <select
                          value={newCountry}
                          onChange={(e) => setNewCountry(e.target.value)}
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
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="City"
                        />
                      </td>
                      <td>
                        <select
                          value={newScholarship}
                          onChange={(e) => setNewScholarship(e.target.value)}
                        >
                          <option value="" disabled>Select Type</option>
                          <option value="F">Full</option>
                          <option value="P">Partial</option>
                          <option value="NS">No Scholarship</option>
                        </select>
                        <input
                          type="text"
                          value={newScholarshipDetails}
                          onChange={(e) => setNewScholarshipDetails(e.target.value)}
                          placeholder="Details"
                        />
                      </td>
                      <td>
                        <select
                          value={newStudyStatus}
                          onChange={(e) => setNewStudyStatus(e.target.value)}
                        >
                          <option value="" disabled>Select Status</option>
                          <option value="O">Enrolled</option>
                          <option value="C">Graduated</option>
                          <option value="S">On leave</option>
                          <option value="W">Withdrawn</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">
                      <button className="addStudy" onClick={handleAddStudy}>
                        Add Study
                      </button>
                    </td>
                  </tr>
                  </>
                ) : (
                  study.map((stu, i) => (
                    <tr key={i}>
                      <td>{getLevelLabel(stu.level)+stu.degree}</td>
                      <td>{stu.university}</td>
                      <td>{stu.country+", "+stu.city}</td>
                      <td>{getScholarshipLabel(stu.scholarship)+stu.scholarship_details}</td>
                      <td>{getStudyStatusLabel(stu.status)}</td>
                    </tr>
                  )))}
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
                          <option value="IT">Information Technology</option>
                          <option value="M">Marketing</option>
                          <option value="DS">Data Science</option>
                          <option value="D">Design</option>
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
                    </tr>
                  ))}
                  {newJobs.map((newJob, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={newJob.newTitle}
                          onChange={(e) => {setNewTitle(e.target.checked)}}
                          placeholder="Title"
                        />
                      </td>
                      <td>
                        <select
                          value={newJob.newType}
                          onChange={(e) => setNewType(e.target.value)}
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
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          placeholder="Company"
                        />
                      </td>
                      <td>
                        <select
                          value={newField}
                          onChange={(e) => setNewField(e.target.value)}
                        >
                          <option value="" disabled>Select Job Type</option>
                          <option value="I">IT</option>
                          <option value="P">Part Time</option>
                          <option value="S">Self-Employed</option>
                          <option value="I">Intern</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          value={newStartTime}
                          onChange={(e) => setNewStartTime(e.target.value)}
                        />
                        {!newOngoing && <input
                          type="date"
                          value={newEndTime}
                          onChange={(e) => handleEndTimeChange(e.target.value)}
                        />}
                        <div className="check-box">
                          Ongoing:
                          <input
                            type="checkbox"
                            checked={newOngoing}
                            onChange={(e) => setNewOngoing(e.target.value)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4">
                      <button className="addJob" onClick={handleAddJob}>
                        Add Job
                      </button>
                    </td>
                  </tr>
                  </>
                ) : (
                  employment.map((emp, i) => (
                    <tr key={i}>
                      <td>{emp.title}</td>
                      <td>{getTypeLabel(emp.status)}</td>
                      <td>{emp.company}</td>
                      <td>{getFieldLabel(emp.career)}</td>
                      <td>{emp.start_date+" to "+(emp.on_going ? "Present" : emp.end_date)}</td>
                    </tr>
                  )))}
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
            requestMode ? "Submit" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;