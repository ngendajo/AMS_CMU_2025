import styled from 'styled-components';
import React, { useState, useEffect, useMemo } from 'react';
import baseUrl from "../../api/baseUrl";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import baseUrlforImg from "../../api/baseUrlforImg";
import './profile-card.css';

import countryList from 'react-select-country-list'

const ProfileFirstName = styled.span`
  // font
  color: var(--black);
  font-family: Medium;
  font-size: 20px;
  // box
  margin-bottom: -5px;
`;
const ProfileLastName = styled.span`
  // font
  color: var(--black);
  font-family: Medium;
  font-size: 20px;
  // box
  margin-bottom: 5px;
`;
const ProfileEmail = styled.span`
  // font
  color: var(--black);
  font-family: Regular;
  font-size: 14px;
`;
const ProfilePhone = styled.span`
  // font
  color: var(--black);
  font-family: Regular;
  font-size: 14px;
`;
const DetailTitle = styled.p`
  // display
  white-space: nowrap;
  // font
  color: var(--green);
  font-family: Medium;
  font-size: 18px;
`;
const DetailValue = styled.p`
  // font
  color: var(--black);
  font-family: Regular;
  font-size: 16px;
  margin-top: -15px;
`;

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

  useEffect(() => {
    const getStudy = async () => {
      try {
        const response = await axios.get(baseUrl + '/studie/?alumn_id=' + alumn_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        setStudy(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getStudy();
  }, [auth, alumn_id]);

  useEffect(() => {
    const getEmploy = async () => {
      try {
        const response = await axios.get(baseUrl + '/employment/?alumn_id=' + alumn_id, {
          headers: {
            "Authorization": 'Bearer ' + String(auth.accessToken),
            "Content-Type": 'multipart/form-data'
          },
          withCredentials: true
        });
        console.log(response.data);
        setEmployment(response.data);
      } catch (err) {
        console.log(err);
      }
    };

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
  const [newDegree, setNewDegree] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newStudyStatus, setNewStudyStatus] = useState('');
  
  const [newJobs, setNewJobs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newJobStatus, setNewJobStatus] = useState('');

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
      requestMode ? handleRequestChanges() : toggleRequestMode();
    } else if (activeTab === 'employment') {
      requestMode ? handleRequestChanges() : toggleRequestMode();
    }
  };

  // personal
  // const validateEmail = (email) => {
  //   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return regex.test(email);
  // };
  // const validatePhone = (phone) => {
  //   const regex = /^[0-9]{10}$/;
  //   return regex.test(phone);
  // };
  const handleSaveChanges = async () => {
    // if (!validateEmail(email)) {
    //   alert('Invalid email format. Please enter a valid email address.');
    //   return;
    // }
    // if (!validatePhone(phone)) {
    //   alert('Invalid phone format. Please enter a valid phone number.');
    //   return;
    // }
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
    console.log(value ? "Yes" : "No");
  };

  // academic and employment
  const validateNewStudy = () => {
    return newDegree.trim() !== '' && newInstitution.trim() !== '' && newStudyStatus.trim() !== '';
  };
  const validateNewJob = () => {
    return newTitle.trim() !== '' && newCompany.trim() !== '' && newJobStatus.trim() !== '';
  };
  const handleRequestChanges = () => {
    if (newStudies.length > 0 && !validateNewStudy()) {
      alert("Please fill out all fields for the new study.");
      return;
    }
    if (newStudies.length > 0 && validateNewStudy()) {
      const updatedStudy = [...study, ...newStudies];
      setStudy(updatedStudy);
      setNewStudies([]);
    }
    if (newJobs.length > 0 && !validateNewJob()) {
      alert("Please fill out all fields for the new job.");
      return;
    }
    if (newJobs.length > 0 && validateNewJob()) {
      const updatedJob = [...employment, ...newJobs];
      setEmployment(updatedJob);
      setNewJobs([]);
    }
    setRequestMode(false);
  };
  const handleAddStudy = () => {
    if (newStudies.length === 0) {
      const newStudy = { degree: newDegree, university: newInstitution, status: newStudyStatus };
      setNewStudies([...newStudies, newStudy]);
      setNewDegree('');
      setNewInstitution('');
      setNewStudyStatus('');
    }
    else {
      alert("You can only add one study at a time.");}
  };
  const handleAddJob = () => {
    if (newJobs.length === 0) {
      const newJob = { title: newTitle, company: newCompany, status: newJobStatus };
      setNewJobs([...newJobs, newJob]);
      setNewTitle('');
      setNewCompany('');
      setNewJobStatus('');
    }
    else {
      alert("You can only add one job at a time.");}
  };
  const getStudyStatusLabel = (status) => {
    switch (status) {
      case 'O':
        return 'Enrolled';
      case 'C':
        return 'Graduated';
      case 'S':
        return 'On leave';
      case 'W':
        return 'Withdrawn';
      default:
        return '';
    }
  };
  const getJobStatusLabel = (status) => {
    switch (status) {
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
  const handleCompanyChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].company = value;
    setEmployment(updatedJob);
  };
  const handleJobStatusChange = (index, value) => {
    const updatedJob = [...employment];
    updatedJob[index].status = value;
    setEmployment(updatedJob);
  };


  // layout starts here
  const renderContent = () => {

    const dateFormat = (dateOfBirth) => {
      const [month, date, year] = dateOfBirth.split('-');
      return `${year}-${month}-${date}`;
    };

    const extractParenthesesContent = (str) => {
      const match = str.match(/\(([^)]+)\)/);
      return match ? match[1] : "";
    };

    switch (activeTab) {
      case 'personal':
        return (
          <>
            {user.map((use, i) => (
              <div key={i} className="profile-content">
                <div className="basic">
                  <img src={baseUrlforImg + use?.image_url} alt="Profile" />
                  <div className="basic-info">
                    <ProfileFirstName>{use.first_name}</ProfileFirstName>
                    <ProfileLastName>{use.last_name}</ProfileLastName>
                    {/* {editMode ? (
                      <input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        class="email_phone"
                      />
                    ) : ( */}
                      <ProfileEmail>{email}</ProfileEmail>
                    {/* )}
                    {editMode ? (
                      <input
                        type="text"
                        value={phone}
                        placeholder="Phone"
                        className="email_phone"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    ) : ( */}
                      <ProfilePhone>{phone}</ProfilePhone>
                    {/* )} */}
                  </div>
                </div>
                <div className="detail">
                  <div>
                    <DetailTitle>Gender</DetailTitle>
                    <DetailValue>{use.alumn.gender}</DetailValue>
                  </div>
                  <div>
                    <DetailTitle>Date of Birth</DetailTitle>
                    <DetailValue>{dateFormat(use.alumn.date_of_birth)}</DetailValue>
                  </div>
                  <div>
                    <DetailTitle>Place of Origin</DetailTitle>
                    <DetailValue>
                      {`${use.alumn.place_of_birth_district_or_country}, ${use.alumn.place_of_birth_sector_or_city}`}
                    </DetailValue>
                  </div>
                  <div>
                    <DetailTitle>ASYV Grade</DetailTitle>
                    <DetailValue>{use.alumn.family.grade.grade_name}</DetailValue>
                  </div>
                  <div>
                    <DetailTitle>ASYV Family</DetailTitle>
                    <DetailValue>{use.alumn.family.family_name}</DetailValue>
                  </div>
                  <div>
                    <DetailTitle>Combination</DetailTitle>
                    <DetailValue>{extractParenthesesContent(use.alumn.combination.combination_name)}</DetailValue>
                  </div>
                  <div>
                    <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                      <DetailTitle>Current Address</DetailTitle>
                    </div>
                    {editMode ? (
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
                    ) : (
                      <DetailValue>
                        {`${currentAddress.districtOrCountry}, ${currentAddress.sectorOrCity}`}
                      </DetailValue>
                    )}
                  </div>
                  <div>
                    <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                      <DetailTitle>Marital Status</DetailTitle>
                    </div>
                    {editMode ? (
                      <select value={maritalStatus} onChange={handleMaritalStatusChange}>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : (
                      <DetailValue>{maritalStatus}</DetailValue>
                    )}
                  </div>
                  <div>
                    <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                      <DetailTitle>Children</DetailTitle>
                    </div>
                    {editMode ? (
                      <select value={children ? "true" : "false"} onChange={handleChildrenChange}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <DetailValue>{children ? "Yes" : "No"}</DetailValue>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        );
      case 'academic':
        return (
          <>
            <div class="profile-content">
              <div class="basic">
                <img src={baseUrlforImg + user[0]?.image_url} alt="Profile" />
                <div class="basic-info">
                  <ProfileFirstName>{user[0].first_name}</ProfileFirstName>
                  <ProfileLastName>{user[0].last_name}</ProfileLastName>
                  <ProfileEmail>{user[0].email}</ProfileEmail>
                  <ProfilePhone>{user[0].phone1}</ProfilePhone>
                </div>
              </div>
              <div class="detail">
                <div>
                  <DetailTitle>S4, S5, S6 Marks</DetailTitle>
                  <DetailValue>{user[0].alumn.s4marks+"%, "+user[0].alumn.s5marks+"%, "+user[0].alumn.s6marks+"%"}</DetailValue>
                </div>
                <div>
                  <DetailTitle>National Exam</DetailTitle>
                  <DetailValue>{user[0].alumn.ne+"/"+user[0].alumn.maxforne}</DetailValue>
                </div>
                <div>
                  <DetailTitle>Decision</DetailTitle>
                  <DetailValue>{user[0].alumn.decision === "P" ? "Pass" : "Fail"}</DetailValue>
                </div>
                <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                  <DetailTitle>Degree</DetailTitle>
                </div>
                <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                  <DetailTitle>Institution</DetailTitle>
                </div>
                <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                  <DetailTitle>Study Status</DetailTitle>
                </div>
                {requestMode ? (
                  <>
                    {study.map((stu, i) => (
                      <div key={i} className="detail-value-row">
                        <input
                          type="text"
                          value={stu.degree}
                          onChange={(e) => handleDegreeChange(i, e.target.value)}
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={stu.university}
                          onChange={(e) => handleInstitutionChange(i, e.target.value)}
                          placeholder="Institution"
                        />
                        <select
                          value={stu.status}
                          onChange={(e) => handleStudyStatusChange(i, e.target.value)}
                        >
                          <option value="O">Enrolled</option>
                          <option value="C">Graduated</option>
                          <option value="S">On leave</option>
                          <option value="W">Withdrawn</option>
                        </select>
                      </div>
                    ))}
                    {newStudies.map((newStudy, index) => (
                      <div key={index} className="detail-value-row">
                        <input
                          type="text"
                          value={newDegree}
                          onChange={(e) => {setNewDegree(e.target.value)}}
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={newInstitution}
                          onChange={(e) => setNewInstitution(e.target.value)}
                          placeholder="Institution"
                        />
                        <select
                          value={newStudyStatus}
                          onChange={(e) => setNewStudyStatus(e.target.value)}
                        >
                          <option value="O">Enrolled</option>
                          <option value="C">Graduated</option>
                          <option value="S">On leave</option>
                          <option value="W">Withdrawn</option>
                        </select>
                      </div>
                    ))}
                    <div>
                      <button className="addStudy" onClick={handleAddStudy}>
                        Add Study
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {study.map((stu, i) => (
                      <div key={i} className="detail-value-row">
                        <div>
                          <DetailValue>{stu.degree}</DetailValue>
                        </div>
                        <div>
                          <DetailValue>{stu.university}</DetailValue>
                        </div>
                        <div>
                          <DetailValue>{getStudyStatusLabel(stu.status)}</DetailValue>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </>
        );
      case 'employment':
        return (
          <>
            <div class="profile-content">
              <div class="basic">
                <img src={baseUrlforImg + user[0]?.image_url} alt="Profile" />
                <div class="basic-info">
                  <ProfileFirstName>{user[0].first_name}</ProfileFirstName>
                  <ProfileLastName>{user[0].last_name}</ProfileLastName>
                  <ProfileEmail>{user[0].email}</ProfileEmail>
                  <ProfilePhone>{user[0].phone1}</ProfilePhone>
                </div>
              </div>
              <div className="detail">
                <div className="detail-titles">
                  <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                    <DetailTitle>Job Title</DetailTitle>
                  </div>
                  <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                    <DetailTitle>Company</DetailTitle>
                  </div>
                  <div className={`fat ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}>
                    <DetailTitle>Job Status</DetailTitle>
                  </div>
                </div>
                {requestMode ? (
                  <>
                    {employment.map((emp, i) => (
                      <div key={i} className="detail-value-row">
                        <input
                          type="text"
                          value={emp.title}
                          onChange={(e) => handleTitleChange(i, e.target.value)}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={emp.company}
                          onChange={(e) => handleCompanyChange(i, e.target.value)}
                          placeholder="Company"
                        />
                        <select
                          value={emp.status}
                          onChange={(e) => handleJobStatusChange(i, e.target.value)}
                        >
                          <option value="F">Full Time</option>
                          <option value="P">Part Time</option>
                          <option value="S">Self-Employed</option>
                          <option value="I">Intern</option>
                        </select>
                      </div>
                    ))}
                    {newJobs.map((newJob, index) => (
                      <div key={index} className="detail-value-row">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => {setNewTitle(e.target.value)}}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          placeholder="Company"
                        />
                        <select
                          value={newJobStatus}
                          onChange={(e) => setNewJobStatus(e.target.value)}
                        >
                          <option value="F">Full Time</option>
                          <option value="P">Part Time</option>
                          <option value="S">Self-Employed</option>
                          <option value="I">Intern</option>
                        </select>
                      </div>
                    ))}
                    <div>
                      <button className="addJob" onClick={handleAddJob}>
                        Add Job
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {employment.map((emp, i) => (
                      <div key={i} className="detail-value-row">
                        <div>
                          <DetailValue>{emp.title}</DetailValue>
                        </div>
                        <div>
                          <DetailValue>{emp.company}</DetailValue>
                        </div>
                        <div>
                          <DetailValue>{getJobStatusLabel(emp.status)}</DetailValue>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
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
        <div className={`vertical-line ${editMode ? 'edit-mode' : requestMode ? 'request-mode' : ''}`}></div>
        <button onClick={toggleMode} className="change">
          {editMode ? "Save Changes" :
            requestMode ? "Request Changes" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;