import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Addcombination() {
    const {auth} = useAuth();
    const navigate =useNavigate()
    let registerCombination = (e )=> {
        e.preventDefault()
        axios.post('http://127.0.0.1:8000/api/combination/', {
            'combination_name':e.target.combination_name.value,
        },
        {
            headers: {
                "Authorization": 'Bearer ' + String(auth.accessToken),
                "Content-Type": 'application/json'
            }
        }
    )
    .then(res =>{
        alert(res.data.combination_name+" created successfully")
        navigate('/combinations')
    })
    .catch(error => alert(error.response.data))
        
    }
  return (
    <div className='alumni-list-body'>
        <center><h1>Add a new Combination form</h1></center> 
        <form  onSubmit={registerCombination} className='form-element'>
            <div className="grade-info">
                <label>
                <input
                        type='text'
                        name='combination_name'
                        placeholder='combination name'
                    />
                </label>
            </div>        
            <center><button type="submit">Save</button></center>
        </form>
        <p>
             <Link className="line" to="/combinations">Go back</Link>
        </p>
    </div>
  )
}
