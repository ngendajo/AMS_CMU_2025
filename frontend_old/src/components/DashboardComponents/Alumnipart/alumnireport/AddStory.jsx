
import {useState, useEffect,useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../../Header/header.css';
import '../../../Header/searchBar.css';
import '../../../Header/searchResultsList.css';
import '../../Staffpart/staff.css';
import '../../Alumnipart/alumni.css';
import { Link } from 'react-router-dom';
import useAuth from "../../../../hooks/useAuth";
import axios from "axios";
import { useParams } from 'react-router';
import "../../forms.css";
import { useNavigate } from "react-router-dom";
import baseUrl from '../../../../api/baseUrl';
import baseUrlforImg from '../../../../api/baseUrlforImg';



export default function AddStory() {
  const [userid, setUserid]=useState([]);
  const { auth } = useAuth();
  const params = useParams();
    const navigate = useNavigate();
    const [alumn, setAlumn] = useState(0);
    const editorRef = useRef(null);

    useEffect(() =>{
    
      const getuser = async () =>{
          try{
              const response = await axios.get(baseUrl+'/alumni/?id='+params.id,{
                  headers: {
                      "Authorization": 'Bearer ' + String(auth.accessToken),
                      "Content-Type": 'multipart/form-data'
                  },
                  withCredentials:true
              });
              setUserid(response.data)
              response.data.forEach((el)=>{
                setAlumn(el.alumn.id)
              })
          }catch(err) {
              console.log(err);
              navigate('/error');
          }
      }
  
      getuser();
  
  },[auth,params])
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if (editorRef.current) {
        console.log(editorRef.current.getContent());
      

    axios.post(baseUrl+'/story/', {
        "alumn":alumn,
        "description":editorRef.current.getContent(),
        "displayed":false
        
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
        alert(" created successfully")
        if(auth.user.is_alumni){
            navigate('/')
        }else{
            navigate('/alumni/story/')
        }
        
    })
    .catch(error => console.log(error.response))
     
}
  } 
  return (
    <center>
          <p>
              <Link className="line" to="/alumni/story/">Go back</Link>
          </p>
      {
      userid.map((result, id)=>{
          return <div key={id} className="delete-message"> 
          <img src={baseUrlforImg+result.image_url} alt="logo" className="user-image-icon" />
          <h1>Add a story for  {result.first_name} {result.last_name} with {result.email} as 
          email
          </h1>
          </div>
      }
      )}

    
        <form onSubmit={handleSubmit}>
          
                <div className="form-content">
                    
                    <center className="formpart">
                        <Editor
                            apiKey='msleyaq0yrjtn736cwo80srjn02tmz7h2ny00kcsmcdaetqd'
                            initialValue=''
                            onInit={(evt, editor) => editorRef.current = editor}
                            init={{
                            height: 300,
                            width: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                        
                    </center>
                   
                </div>

                <center>
                {alumn===0?null:
                <button>Save</button>
                }
                </center>
            </form>
            
          </center>

  )
}
