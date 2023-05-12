import React from 'react'
import './home.css'
import HomeTopBar from '../../components/HomeComponents/HomeTopBar'
import HomeMenuBar from '../../components/HomeComponents/HomeMenuBar'

export default function Home() {
  return (
    <div className='home'>
        <HomeTopBar/>
        <HomeMenuBar/>
    </div>
  )
}
