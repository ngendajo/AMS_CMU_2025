import React from 'react';
import styled from 'styled-components';
import Logo from '../../static/images/logo.png';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  background-color: #D9D9D9; 
  margin-left: 250px;
  margin-botton: 0px;
  font-family: Medium;

  
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImage = styled.img`
  width: 50px; /* Adjust as needed */
  height: auto; /* Maintain aspect ratio */
`;

const LogoText = styled.p`
  font-size: 14px; /* Adjust font size */
  color: var(--green); 
`;

const LogoutButton = styled.button`
  
     background-color: var(--green);
    color: var(--white);
    font-family: Medium;
    font-size: 16x;
  border: 0px;
   
    padding: 10px 10px;
   
    border-radius: 30px;
`;
const DashboardHeader = () => {
   
  
    const handleLogout = () => {
      // Perform logout actions here, e.g., clear authentication tokens, reset user context/state
      // Redirect to homepage
     
    };
  
    return (
      <HeaderContainer>
        <LogoContainer>
          <LogoImage src={Logo} alt="ASYV Logo" />
          <LogoText>Agahozo-Shalom Youth Village Alumni Platform</LogoText>
        </LogoContainer>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </HeaderContainer>
    );
  };
  
  export default DashboardHeader;