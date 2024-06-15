import React from 'react'
import Sidebar from './Sidebar'
import { DashboardCard } from './Dashboard-card'

export default function Dashboard() {
  return (
    <div>Dashboard
      <Sidebar />
      <DashboardCard
                    imgSrc="https://www.colorhexa.com/957967.png"
                    imgAlt="Card Image 1"
                    buttonText="Profile"
                    link="card1"
                />
    </div>
  )
}