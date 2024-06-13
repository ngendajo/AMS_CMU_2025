import React from 'react';
import Logo from '../../static/images/logo.png';
import { AiOutlineTwitter } from 'react-icons/ai';
import { FaLinkedinIn, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function HomeHeader() {
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

    const titleStyle = {
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

                <div className="HomeHeaderLeft">
                    <img src={Logo} alt="logo" />
                    <p style={titleStyle}>Agahozo-Shalom Youth Village</p>
                    <p style={titleStyle}>Alumni Platform</p>
                </div>

                <div className="HomeHeaderRight">
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
