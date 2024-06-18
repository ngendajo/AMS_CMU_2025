import React from 'react';
import styled from 'styled-components';
import { DashboardCard } from './Dashboard-card';

const DashboardContainer = styled.div`
  display: flex;
   padding: 40px;
   margin-top: 20px;
`;

const ContentContainer = styled.div`
  margin-left: 264px; /* Width of Sidebar */
  padding: 40px;
  width: calc(100% - 264px); /* Calculate remaining width */
`;



const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
`;

const Dashboard = () => {
  
  return (
    <>
    <DashboardContainer>
   
      <ContentContainer>
        <CardsContainer>
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 1"
            buttonText="Personal Profile"
            path="/profile"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 2"
            buttonText="Alumni Directory"
            path="/directory"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 3"
            buttonText="Career Opportunity"
            path="/career"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 4"
            buttonText="Further Education"
            path="/education"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 5"
            buttonText="Ways to Give Back"
            path="/give-back"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 6"
            buttonText="Social & Networking"
            path="/networking"
          />
          <DashboardCard
            imgSrc="https://www.colorhexa.com/957967.png"
            imgAlt="Card Image 7"
            buttonText="Contact CRC Staff"
            path="/contact"
          />
        </CardsContainer>
      </ContentContainer>
    </DashboardContainer>
    </>
  );
};

export default Dashboard;
