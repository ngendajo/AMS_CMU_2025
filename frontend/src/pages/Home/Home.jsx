import React from 'react'
import './home.css'
import HomeTopBar from '../../components/HomeComponents/HomeTopBar'
import HomeMenuBar from '../../components/HomeComponents/HomeMenuBar'
import HomeStory from '../../components/HomeComponents/HomeStory'
import HomeAlumni from '../../components/HomeComponents/HomeAlumni'
import HomeMission from '../../components/HomeComponents/HomeMission'


export default function Home() {
  return (
    <div>
        <HomeTopBar/>
        <HomeMenuBar/>
        <HomeAlumni/>
        <HomeStory/>
        <HomeMission/>
    </div>
  )
}
