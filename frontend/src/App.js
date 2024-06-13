import "./styles.css";

import React from 'react';
import { MdPhone } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { AiOutlineTwitter } from 'react-icons/ai';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function HomeTopBar() {
    const containerStyle = {
        marginTop: '20px',
        marginBottom: '20px',
        paddingLeft: '5%',
        paddingRight: '5%'
    };

    const barStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const contactIcon = {
        fontSize: 23,
        color: '#F0A459'
    };

    const paragraphStyle = {
      fontSize: 13,
      fontFamily: 'Arial',
      color: '#575757'
    };

    const mediaIcon = {
        fontSize: 16,
        color: '#F49C46',
        margin: 5,
        cursor: 'pointer'
    };

    return (
        <div style={containerStyle}>
            <div style={barStyle}>

                <div className="HomeTopBarLeft">
                    <div className="HomeTopBarLeftContent">
                        <MdPhone style={contactIcon} />
                        <p style={paragraphStyle}>+25073691194</p>
                    </div>
                    <div className="HomeTopBarLeftContent">
                        <HiOutlineMail style={contactIcon} />
                        <p style={paragraphStyle}>julius@asyv.org</p>
                    </div>
                </div>

                <div className="HomeTopBarRight">
                    <a href="https://www.instagram.com/agahozoshalom/" target="_blank" rel="noopener noreferrer">
                        <FaInstagram style={mediaIcon} />
                    </a>
                    <a href="https:/twitter.com/asyv" target="_blank" rel="noopener noreferrer">
                        <AiOutlineTwitter style={mediaIcon} />
                    </a>
                    <a href="https://www.facebook.com/AgahozoShalom/">
                        <FaFacebook style={mediaIcon} />
                    </a>
                    <a href="https://www.linkedin.com/in/julius-kaboyo?originalSubdomain=rw" target="_blank" rel="noopener noreferrer">
                        <FaLinkedinIn style={mediaIcon} />
                    </a>
                </div>

            </div>
        </div>
    );
}
