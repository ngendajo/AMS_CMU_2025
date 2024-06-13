import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
 
const SidebarLink = styled(Link)`
  display: flex;
  color: #615E69;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem;
  list-style: none;
  text-decoration: none;
  font-size: 14px;
  border-left: ${props => props.active ? "4px solid #ff9800" : "4px solid #fff"};
 
  &:hover {
    background: #efefef;
    border-left: 4px solid #ff9800;
    cursor: pointer;
  }
`;
 
const SidebarLabel = styled.span`
  margin-left: 16px;
`;
 
const DropdownLink = styled(Link)`
  background: #FFF;
  padding:0.3rem;
  margin-left: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #615E69;
  font-size: 14px;
  border-left: 4px solid #fff;
 
  &:hover {
    background: #efefef;
    border-left: 4px solid #ff9800;
    cursor: pointer;
  }
`;
 
const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
 
  const showSubnav = () => {
    setSubnav(!subnav);
  }
 
  return (
    <>
      <SidebarLink to={item.path}
      onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};
 
export default SubMenu;