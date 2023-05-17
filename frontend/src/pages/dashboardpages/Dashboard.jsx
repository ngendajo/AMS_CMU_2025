import useAuth from "../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import Alumni from '../../components/Alumini';
import Crc from '../../components/Crc';
import Admin from '../../components/Admin';

export default function Dashboard() {
  const { auth } = useAuth();
  const user= jwtDecode(auth.accessToken);
  return (
    <div>
        {user.is_superuser ? 
       <Admin />
       :user.is_crc && user.is_alumni ? 
       <p>You are both</p>
       :user.is_alumni ?
       <Alumni />
       : user.is_crc ?
       <Crc />
       :
       <p>Unauthorized user</p>
       }
    </div>
  )
}
