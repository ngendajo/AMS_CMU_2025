import React, {useState, useEffect} from "react";
import axios from "axios";
import baseUrl from "../../../../api/baseUrl";
import useAuth from "../../../../hooks/useAuth";
import "./style.css";
import {  sectorsByDistrict } from './DistrictData';
import { useNavigate } from "react-router-dom";

const Review = ({  formData, navigation }) => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  let [combinations, setCombinations] = useState([]);
  let [families, setFamilies] = useState([]);
  let [eps1, setEps1] = useState([]);
  const { user,
    date_of_birth, 
    gender,
    father,
    mother,
    did_you_born_in_rwanda,
    place_of_birth_district_or_country, 
    place_of_birth_sector_or_city,
    family,
    combination,
    eps,
    s4marks, 
    s5marks,
    s6marks,
    ne, 
    maxforne,
    decision,
    life_status,
    marital_status,
    currresidence_in_rwanda, 
    currresidence_district_or_country,
     currresidence_sector_or_city,
     kids } = formData;
     const findDistrictBySector = (sectorName) => {
      for (const district in sectorsByDistrict) {
          if (sectorsByDistrict[district].includes(sectorName)) {
              return district;
          }
      }
      return null;
  };
  useEffect(() =>{
    
    const getgrades = async () =>{
        try{
            const response = await axios.get(baseUrl+'/families/',{
                headers: {
                    "Authorization": 'Bearer ' + String(auth.accessToken),
                    "Content-Type": 'multipart/form-data'
                },
                withCredentials:true
            });
            setFamilies(response.data)
        }catch(err) {
            console.log(err);
        }
    }

    getgrades();

},[auth])


useEffect(() =>{

  const geteps = async () =>{
      try{
          const response = await axios.get(baseUrl+'/ep/',{
              headers: {
                  "Authorization": 'Bearer ' + String(auth.accessToken),
                  "Content-Type": 'multipart/form-data'
              },
              withCredentials:true
          });
          
          setEps1(response.data)
      }catch(err) {
          console.log(err);
      }
  }

  geteps();

},[auth])

useEffect(() =>{

  const getcombinations = async () =>{
      try{
          const response = await axios.get(baseUrl+'/combination/',{
              headers: {
                  "Authorization": 'Bearer ' + String(auth.accessToken),
                  "Content-Type": 'multipart/form-data'
              },
              withCredentials:true
          });
          setCombinations(response.data);
      }catch(err) {
          console.log(err);
      }
  }

  getcombinations();

},[auth])
  
console.log(families)
console.log(combinations)
console.log(eps1)
  
 
  const { previous,go } = navigation;
  const handleSubmit = async (e) =>{
    e.preventDefault();
    let ep_ids=[];
    ep_ids.push(eps) 
    axios.post(baseUrl+'/alumni/info/', {
        "user":user,
        "date_of_birth":date_of_birth,
        "marital_status":(life_status.toLowerCase())=="alive"?marital_status:"Deceased",
        "gender":gender,
        "family":family,
        "combination":combination,
        "eps":ep_ids,
        "kids":kids=="Yes"?true:false,
        "father":father.trim()===''?"NN":father,
        "mother":mother.trim()===''?"NN":mother,
        "did_you_born_in_rwanda":did_you_born_in_rwanda=="Yes"?true:false,
        "place_of_birth_district_or_country":did_you_born_in_rwanda=="Yes"? findDistrictBySector(place_of_birth_sector_or_city):place_of_birth_district_or_country, 
        "place_of_birth_sector_or_city":place_of_birth_sector_or_city,
        "currresidence_in_rwanda":(life_status.toLowerCase())=="alive"?currresidence_in_rwanda=="Yes"?true:false:"Deceased", 
        "currresidence_district_or_country":(life_status.toLowerCase())=="alive"?currresidence_in_rwanda=="Yes"?findDistrictBySector(currresidence_sector_or_city):currresidence_district_or_country:"Deceased",
        "currresidence_sector_or_city":(life_status.toLowerCase())=="alive"?currresidence_sector_or_city:"Deceased",
        's4marks':s4marks,
        's5marks':s5marks,
        's6marks':s6marks, 
        'ne':ne,
        'maxforne':maxforne,
        'decision':(decision.toLowerCase())=="pass"?"P":"F",
        'life_status':(life_status.toLowerCase())=="alive"?'A':"D"
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        console.log(res.data.id) 
        alert(" created successfully")
        if((life_status.toLowerCase())=="alive"){
          navigate(`/add-alumni/info/${user}/study`)
        }else{
          navigate(`/alumni`)
        }
        
    })
    .catch(error => console.log(error.response.data)
    )
     

  }
  return (
    <div className="form">
      <h3>Review your data and submit</h3>
      <div className="review_data">
            <h2>Birth Info</h2>
            <p><strong>Date of Birth:</strong> {date_of_birth}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Did you Born in Rwanda?:</strong> {did_you_born_in_rwanda}</p>
            {did_you_born_in_rwanda=="Yes"?
              <>
                  <p><strong>District:</strong> {findDistrictBySector(place_of_birth_sector_or_city)}</p>
                  <p><strong>Sector:</strong> {place_of_birth_sector_or_city}</p>
              </>:
              <>
                <p><strong>Country:</strong> {place_of_birth_district_or_country}</p>
                <p><strong>City:</strong> {place_of_birth_sector_or_city}</p>
              </>
            }
            <h2>ASYV Info</h2>
            {families.map((e,ind) => {
              if (e.id==family){
                return <>
                    <p key={ind}><strong>Grade:</strong>{e.grade_name}</p>
                    <p><strong>City:</strong> {e.family_name}</p>
                </> 
              }
                
            })} 
            {combinations.map((e,ind) => {
              if (e.id==combination){
                return <p key={ind}><strong>Combination:</strong>{e.combination_name}</p>
              }
                
            })} 
            {eps1.map((e,ind) => {
              if (e.id==eps){
                return <p key={ind}><strong>EP Done:</strong>{e.title}</p>
              } 
            })} 
            <p><strong>S4 Marks:</strong> {s4marks}</p>
            <p><strong>S5 Marks:</strong> {s5marks}</p>
            <p><strong>S6 Marks:</strong> {s6marks}</p>
            <p><strong>Maximum Aggregate:</strong> {maxforne}</p>
            <p><strong>National Exam Result:</strong> {ne}</p>
            <p><strong>Decision:</strong> {decision}</p>
            <h2>Current Residence</h2>
            {
          life_status=="Died"?<>
          <p><strong>Life Status:</strong> {life_status}</p>
          </>:
          <>
          <p><strong>Do you live in Rwanda?:</strong> {currresidence_in_rwanda}</p>
          {currresidence_in_rwanda=="Yes"?
            <>
                <p><strong>District:</strong> {findDistrictBySector(currresidence_sector_or_city)}</p>
                <p><strong>Sector:</strong> {currresidence_sector_or_city}</p>
            </>:
            <>
              <p><strong>Country:</strong> {currresidence_district_or_country}</p>
              <p><strong>City:</strong> {currresidence_sector_or_city}</p>
            </>  
          }
          <p><strong>Marital Status:</strong> {marital_status}</p>
          <p><strong>Do you have Kids:</strong> {kids}</p>
          </>
        }
      </div>
      <div> 
        {life_status=="Died"?
        <button onClick={() => go("nationalexam")}>Previous</button>:
        <button onClick={previous}>Previous</button>
        }
        
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Review;
