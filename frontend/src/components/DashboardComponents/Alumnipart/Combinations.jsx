
import React, {useState, useEffect} from 'react'
import useAuth from '../../../hooks/useAuth';
import {CombinationsTable} from './CombinationsTable'
import axios from "axios";
import { CombDetails } from './CombDetails';

export const Combinations = () => {
    const [data, setData] = useState([]);
    const [combseen,setCombseen]=useState(false)
    const [combvalue,setCombvalue]=useState()
    let {auth} = useAuth();

    const updatecom = (event) => {
        const value = event.target.value;
        setCombvalue(value)
        setCombseen(!combseen)
      };

    const handleDelete = (event) => {
        const value = event.target.value;
        
        axios.delete('http://127.0.0.1:8000/api/combination/'+value+'/delete/',
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
        )
      };

    useEffect(()=> {
        getData()
    }, [])
    let registerCombination = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/combination/', {
            'name':e.target.combination_name.value,
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        alert(res.data.name+" created successfully")
    })
    .catch(error => alert(error.response.data))
        
    }

    let getData = async() =>{
        let response = await fetch('http://127.0.0.1:8000/api/combination/', {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(auth.accessToken)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            var combinationlist=[]
            data.forEach(e=>{
            combinationlist.push({
            combination:e.name,
            combination_id:<span>
                <button className='updateUser' onClick={updatecom} value={e.id}>Update</button>
                <button className='updateUser' onClick={handleDelete} value={e.id}>Delete</button>
            </span>
        })
        })
        setData(combinationlist)
        }
        
    }
    console.log(data)

 
  return (
    <center div className='alumni-list-body'>
            <div className='alumniAction'>
                    <h3 className='addNew' >Combinations</h3>
            </div>
                {combseen ? <CombDetails id={combvalue} /> : null}
            <div id='allcombinations'>
                <CombinationsTable mockData={data}/>
            </div>
            <div>
                        <h3>Add a new Combination form</h3>
                        <form  onSubmit={registerCombination} className='form-element'>
                    
                                    <label>
                                        <input
                                            type='text'
                                            name='combination_name'
                                            placeholder='combination name'
                                        />
                                    </label>
                            
                            
                            <center><button type="submit">Save</button></center>
                        </form>
                </div>
    </center>
  );
};
