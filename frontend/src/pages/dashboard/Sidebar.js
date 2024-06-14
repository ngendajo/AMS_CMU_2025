// src/components/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

const SidebarNav = styled.nav`
  background: #fff;
  width: 200px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  return (
    <SidebarNav>
      <SidebarWrap>
        {SidebarData.map((item, index) => (
          <Link to={item.path} key={index} className={item.cName}>
            <div>
              <span dangerouslySetInnerHTML={{ __html: item.icon }}></span>
              <span>{item.title}</span>
            </div>
          </Link>
        ))}
      </SidebarWrap>
    </SidebarNav>
  );
};

export default Sidebar;
