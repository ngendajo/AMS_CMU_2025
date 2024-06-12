import React, {useState, useEffect, useContext} from 'react'
import {Table} from "./Table";
import "./userList.css"
import Topbar from "../topbar/Topbar";
import AuthContext from '../../context/AuthContext'
import Register from './Register';
import {UserDetails} from './UserDetails';
import {Bulkalumni} from './Bulkalumni'
import {Grades} from './Grades'
import {Combinations} from './Combinations'
import {Eps} from './Eps'
import baseUrl from '../../../api/baseUrl';



export default function UserList() {
  const [seen, setSeen] = useState(false)
  const [userseen,setUserseen]=useState(false)
  const [uservalue,setUservalue]=useState()
  const [bulkalumniseen,setBulkalumniseen]=useState(false)
  const [gradesseen,setGradesseen]=useState(false)
  const [combinationsseen,setCombinationsseen]=useState(false)
  const [epsseen,setEpsseen]=useState(false)
  const [data, setData] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getData()
    }, [])

    const updateUser = (event) => {
      const value = event.target.value;
      setUservalue(value) 
      setUserseen(!userseen)
    };
    let getData = async() =>{
        let response = await fetch(baseUrl+'/alumnil/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            var alumnilist=[]
            var i=1
            data.forEach(element => {
              alumnilist.push({
                id:i,
                email:element.user.email,
                first_name:element.user.first_name,
                last_name:element.user.last_name,
                gender:element.gender,
                grade_name:element.grade.name,
                family_name:element.family.family_name,
                combination_name:element.combination.name,
                user_id:<button className='updateUser' onClick={updateUser} value={element.id}>Details</button>
              })
              i+=1
            });
            console.log(alumnilist)
            //console.log(data)
            setData(alumnilist);
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    function togglePop () {
      setSeen(!seen);
    };
    function togglePopbulkalumni () {
      setBulkalumniseen(!bulkalumniseen);
    };
    function togglePopgrades () {
      setGradesseen(!gradesseen);
    };
    function togglePopcombinations () {
      setCombinationsseen(!combinationsseen);
    };
    function togglePopeps () {
      setEpsseen(!epsseen);
    };
  
  return (
    <div className="userList">
      <Topbar/>
      <center><h1>List of Alumni </h1></center>
      <div className='alumniAction'>
      <h3 className='addNew' onClick={togglePop}>+Add New</h3>
      <h3 className='addNew' onClick={togglePopbulkalumni}>+Add bulk alumni</h3>
      <h3 className='addNew' onClick={togglePopgrades}>Grades</h3>
      <h3 className='addNew' onClick={togglePopcombinations}>Combinations</h3>
      <h3 className='addNew' onClick={togglePopeps}>EPs</h3>
      </div>
      {seen ? <Register toggle={togglePop} /> : null}
      {userseen ? <UserDetails id={uservalue} /> : null}
      {bulkalumniseen ? <Bulkalumni/> : null}
      {gradesseen ? <Grades/> : null}
      {combinationsseen ? <Combinations/> : null}
      {epsseen ? <Eps/> : null}
      <div className="listtable">
        <Table mockData={data} />
      </div>
      
    </div>
  )
}
