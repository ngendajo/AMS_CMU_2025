import React from 'react'
import { FiPhoneCall} from "react-icons/fi";
import { HiEnvelope } from "react-icons/hi2";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaLinkedinIn,FaInstagram,FaFacebook } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function HomeTopBar() {
    const fontStyle = {
        fontSize: 20,
        color: '#F0A459'
      }
      const fontStyle1 = {
        fontSize: 15,
        color:'#575757',
        margin:5,
        cursor:'pointer'
      }
  return (
    <div className='HomeTopBar'>
        <div className='HomeTopBarLeft'>
            <div className='HomeTopBarLeftContent'>
                <FiPhoneCall style={fontStyle}/>
                <p>+25073691194</p>
            </div>
            <div className='HomeTopBarLeftContent'>
                <HiEnvelope style={fontStyle} />
                <p>julius@asyv.org</p>
            </div>
        </div>
        <div className='HomeTopBarRight'>
           <Link to="https://www.linkedin.com/in/julius-kaboyo?originalSubdomain=rw"><FaInstagram style={fontStyle1}/></Link> 
           <Link to="https://twitter.com/kaboyojulio/status/1365930541766352896"><AiOutlineTwitter style={fontStyle1}/></Link> 
            <Link to="https://www.facebook.com/AgahozoShalom/posts/2514393175244766/?paipv=0&eav=Afa0p-t563INEjQnGCm0t_Lb4M2RpED43Xtzs2agb7d63VgARW0aY9oGPpKEW4Kfa4w&_rdr"> <FaFacebook style={fontStyle1}/></Link> 
            <Link to="https://www.linkedin.com/in/julius-kaboyo?originalSubdomain=rw"> <FaLinkedinIn style={fontStyle1}/></Link> 
        </div>
    </div>
  )
}
