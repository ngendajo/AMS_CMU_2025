import {useState, useEffect} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom"

const Crcusers = () => {
    const [ crcUsers, setCrcUsers ] = useState();
    const axiosPrivate = useAxiosPrivate();
    //const navigate = useNavigate();
    const location = useLocation();

    useEffect(() =>{
        let isMounted = true;
        const controller = new AbortController();

        const getcrcusers = async () =>{
            try{
                const response = await axiosPrivate.get('/registercrc/',{
                    signal:controller.signal
                });
                console.log(response.data);
                isMounted && setCrcUsers(response.data);
            }catch(err) {
                console.log(err);/* 
                navigate('/login', {state: { from: location }, replace: true }); */
            }
        }

        getcrcusers();

        return () =>{
            isMounted = false;
            controller.abort();
        }
    },[])
  return (
    <article>
        <h2>Crc users list</h2>
        {crcUsers?.length
            ? (
                <ul>
                    {crcUsers.map((user, i) => <li key={i}>{user?.user.email}</li>)}
                </ul>
            ): <p>No users to display</p>
        }
    </article>
  )
}

export default Crcusers