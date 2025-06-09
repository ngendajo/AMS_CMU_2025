import axios from "axios";
import { React,useState } from "react"
import useAuth from "../../hooks/useAuth";
import { Link,useNavigate } from "react-router-dom";
import baseUrl from "../../api/baseUrl";

export default function Author() {
  const {auth} = useAuth();
  const navigate =useNavigate()
  const [author, setauthor] = useState('');
  
let handleSubmit = (e )=> {
  e.preventDefault()
  axios.post(baseUrl+'/author/', {
      'author_name':author,
  },
  {
      headers: {
          "Authorization": 'Bearer ' + String(auth.accessToken),
          "Content-Type": 'application/json'
      }
  }
)
.then(res =>{
  alert(res.data.author_name+" created successfully")
  navigate('/authors')
})
.catch(error => alert(error.response.data))
  
}
  return (
    <div className="loginform">
        <h2>Add a new author form</h2>
        
        <form className='formelement' onSubmit={handleSubmit}>
          <label htmlFor="author">Enter author Name</label>
          <input 
            className='credentials' 
            type="text"
            id="author"
            autoComplete="off" 
            onChange={(e) => setauthor(e.target.value)}
            value={author}
            required
          />
                <label htmlFor="loginbutton">
                  <button className='submitbuton'>Save</button> 
                </label>
                <label htmlFor="create new">
                  <Link to="/authors" className="forgetpass">Go Back!</Link>
                </label>
    
        </form>
       </div>
  )
}
