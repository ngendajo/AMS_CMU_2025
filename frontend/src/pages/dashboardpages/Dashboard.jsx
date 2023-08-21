import useAuth from "../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import Alumni from '../../components/Alumini';
import Admin from '../../components/Admin';
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const { auth } = useAuth();
  const user= jwtDecode(auth.accessToken);
 
    useEffect(() => {
      if (user.is_superuser){
        setTitle("AMS-Admin")
      }
      else if(user.is_crc){
        setTitle("AMS-CRC Staff")
      }
      else if(user.is_alumni){
        setTitle("AMS-Alumni")
      }
      else {
        setTitle("AMS-Visitor")
      }
        document.title = title;
        }, [title,user]);
    
  
  
  return (
    <div>
        {user.is_alumni ?
       <Alumni />
       :
       <Admin />
       }
    </div>
  )
}
