import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useHistory } from 'react-router-dom'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../../context/AuthContext'

export const Clubs = ({ id }) => {
    const [data, setData] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getData()
    }, [])

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/onealumni/'+id+"/", {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setData(data);
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }
    console.log(data)

    function closeLogin(e) {
        document.getElementById("closeLogin2").style.display = "none";
    }
  
  return (
    <>
      <div className="popup" id="closeLogin2">
            <div className="popup-inner user-reg">
                <ClearOutlinedIcon className='cancellogin' onClick={closeLogin}/>
                <h2>Clubs </h2>
                
                
            </div>
        </div>
    </>
  );
};
