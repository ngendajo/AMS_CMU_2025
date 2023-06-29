import React from 'react'
import useAuth from '../../hooks/useAuth'
import AlumnProfile from '../../components/ProfileComponents/AlumnProfile';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const {auth} = useAuth();
  const navigate = useNavigate()
  if(auth.user.is_alumni){
    return (
      <div>
        <AlumnProfile/>
      </div>
    )
  }else{
    navigate(`/staffprofile/${auth.user.id}`)
  }
  
}
