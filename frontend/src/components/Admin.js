import React from 'react'
import { Link } from 'react-router-dom'
import Home from './Home'

const Admin = () => {
  return (
    <div>
        <p>You are on Admin page</p>
        <p><Link to={<Home />}>Home</Link></p>
    </div>
  )
}

export default Admin