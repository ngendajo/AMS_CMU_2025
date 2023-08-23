
import styled from "styled-components";
import { SidebarData } from "./SidebarData";
import { SidebarDataforAlumn } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";
import {Link, useNavigate} from 'react-router-dom';
import useLogout from '../../../hooks/useLogout';
import { BiLogOut } from "react-icons/bi";
import sidebarmenufooter from '../../../Static/Images/sidebarmenufooter.JPG';
import useAuth from "../../../hooks/useAuth";
 
 
const SidebarNav = styled.nav`
  background: #FFF;
  width: 200px;
  display: flex;
  margin-top:20px;
  justify-content: center;
`;
 
const SidebarWrap = styled.div`
  width: 100%;
`;
const Sidebarmenufooter = styled.div`
  width:85%;
  margin:5px 1%;
  height:100px;
  display:flex;
  flex-direction:column;
  font-size:12px;
  text-align:center;
  padding:12px;
  background:url(${sidebarmenufooter}); 
  background-size:cover;  
    background-repeat:no-repeat;
    background-position: center center;
    border-radius:15px;
  h4{
    color: #fff;
    width:60%;
    padding-bottom:4px;
  }
  .links{
    text-decoration:none;
    color:#fff;
    width:70%;
    background:#ff9800;
    padding:5px 7px;
    border-radius:7px;
  }
`;

const Sidebarpart = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate('/home');
}
 
  return (
    <>
      <IconContext.Provider value={{ color: "#615E69" }}>
        <SidebarNav>
          <SidebarWrap>
            {auth.user.is_superuser || auth.user.is_crc?
            SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            }):
            auth.user.is_alumni?
            SidebarDataforAlumn.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            }):
            <p>You are a visitor</p>
            }
              <Link to="#" className='profile-logout-link' onClick={signOut}><BiLogOut/><span>Log Out</span></Link>
            <Sidebarmenufooter>
              <h4>Are you aware of the available opportunities?</h4>
              <Link to="#" className='links'>know more</Link>
            </Sidebarmenufooter>
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};
 
export default Sidebarpart;