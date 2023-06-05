
import React, {useState, useEffect, useContext} from 'react'
import useAuth from '../../../hooks/useAuth';
import axios from "axios";
import { EpTable } from './EpTable';
import { EpDetails } from './EpDetails';


export const Eps = ({ id }) => {
    const [data, setData] = useState([]);
    const [epseen,setEpseen]=useState(false)
    const [epvalue,setEpvalue]=useState()
    let {auth}= useAuth()


    const updateep = (event) => {
        const value = event.target.value;
        setEpvalue(value)
        setEpseen(!epseen)
      };

    const handleDelete = (event) => {
        const value = event.target.value;
        
        axios.delete('http://127.0.0.1:8000/api/ep/'+value+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        )
      };

    let registerEp = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/ep/', {
            'title':e.target.title.value,
            'type':e.target.type.value
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        alert(res.data.title+" created successfully")
    })
    .catch(error => console.log(error.response.data))
        
    }

    useEffect(()=> {
        getData()
    }, [])

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/ep/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(auth.accessToken)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            var eplist=[]
            data.forEach(e=>{
                var t=""
                if(e.type=="A"){
                    t="Art"
                }else if(e.type=="S"){
                    t="Sport"
                }else{
                    t="Sciences"
                }
            eplist.push({
            title:e.title, 
            type:t,
            ep_id:<span>
                <button className='updateUser'onClick={updateep} value={e.id}>Update</button>
                <button className='updateUser' onClick={handleDelete} value={e.id}>Delete</button>
            </span>
        })
        })
        setData(eplist)
        }
        
    }
    console.log(data)

  return (
    <center div className='alumni-list-body'>
                <h2>Eps </h2>
                {epseen ? <EpDetails id={epvalue} /> : null}
                <EpTable mockData={data}/>
                <div>
                        <h3>Add a new Ep form</h3>
                        <form  onSubmit={registerEp} className='form-element'>
                    
                                    <label>
                                        Ep title:
                                        <input
                                            type='text'
                                            name='title'
                                            placeholder='title'
                                        />
                                    </label>
                                    <label>
                                    Type:
                                        <select name='type'>
                                            <option value="A">Art</option>
                                            <option value="C">Club</option>
                                            <option value="SC">Sciences</option>
                                        </select>
                                    </label>
                            
                            
                            <center><button type="submit">Save</button></center>
                        </form>
                </div>
    </center>
  );
};
