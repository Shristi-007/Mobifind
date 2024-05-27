import React from "react";

import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarLink,
  SidebarWrapper,
  SidebarMenu,
  SidebarBtnWrap,
  SidebarButton,
} from "./SidebarStyled";
const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to="/ManufacturerPage">Manufacturer</SidebarLink>
          <SidebarLink to="/OfficialPage">Official</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
      <SidebarBtnWrap>
        <SidebarButton to="/Login">Profile</SidebarButton>
      </SidebarBtnWrap>
    </SidebarContainer>
  );
};

export default Sidebar;