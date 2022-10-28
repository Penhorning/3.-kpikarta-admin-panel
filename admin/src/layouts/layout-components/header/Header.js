import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Nav,
  NavItem,
  NavLink,
  Button,
  Navbar,
  NavbarBrand,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from 'react-router-dom';
import { AuthenticationService } from "../../../shared/_services";
import { UserService } from "../../../shared/_services";
import Constants from '../../../shared/_helpers/constants';
/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logodarkicon from "../../../assets/images/logo-icon.png";
import logolighticon from "../../../assets/images/logo-light-icon.png";
import logodarktext from "../../../assets/images/logo-text.png";
import logolighttext from "../../../assets/images/logo-light-text.png";
// import logolighttext from "../../../assets/images/kpi-karta-logo.png";

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useSelector((state) => state.settings);
  const [userId, setUserIds] = useState(AuthenticationService.currentUser.source._value.userId)
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [fileList, setFileList] = useState([{thumbUrl: ''}]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const showMobilemenu = () => {
    document.getElementById("main-wrapper").classList.toggle("show-sidebar");
  };

  const sidebarHandler = () => {
    let element = document.getElementById("main-wrapper");
    switch (settings.activeSidebarType) {
      case "full":
      case "iconbar":
        element.classList.toggle("mini-sidebar");
        if (element.classList.contains("mini-sidebar")) {
          element.setAttribute("data-sidebartype", "mini-sidebar");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;

      case "overlay":
      case "mini-sidebar":
        element.classList.toggle("full");
        if (element.classList.contains("full")) {
          element.setAttribute("data-sidebartype", "full");
        } else {
          element.setAttribute("data-sidebartype", settings.activeSidebarType);
        }
        break;
      default:
    }
  };
  useEffect(() => {
    // get individula user data by passing user id
    UserService.getUserDetails(userId).then(response => {
      setFullName(response.fullName)
      setEmail(response.email)
      setFileList({thumbUrl: response.profilePic ? `${Constants.BASE_URL}/user/${response.profilePic}` : `${'https://i.ibb.co/wynJtDH/avatar.png'}`})
    });
  }, [userId])
  return (
    <header className="topbar navbarbg" data-navbarbg={settings.activeNavbarBg}>
      <Navbar
        className={
          "top-navbar " +
          (settings.activeNavbarBg === "skin6" ? "navbar-light" : "navbar-dark")
        }
        expand="md"
      >
        <div
          className="navbar-header"
          id="logobg"
          data-logobg={settings.activeLogoBg}
        >
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="nav-toggler d-block d-md-none"
            onClick={showMobilemenu.bind(null)}
          >
            <i className="ti-menu ti-close" />
          </span>
          {/*--------------------------------------------------------------------------------*/}
          {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
          {/*--------------------------------------------------------------------------------*/}
          <NavbarBrand href="/">
            <b className="logo-icon">
              <img src={logodarkicon} alt="homepage" className="dark-logo" />
              <img src={logolighticon} alt="homepage" className="light-logo" />
            </b>
            <span className="logo-text">
              <img src={logodarktext} alt="homepage" className="dark-logo" />
              <img src={logolighttext} className="light-logo" alt="homepage" />
            </span>
          </NavbarBrand>
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="topbartoggler d-block d-md-none"
            onClick={toggle.bind(null)}
          >
            <i className="ti-more" />
          </span>
        </div>
        <Collapse
          className="navbarbg"
          isOpen={isOpen}
          navbar
          data-navbarbg={settings.activeNavbarBg}
        >
          <Nav className="float-left" navbar>
            <NavItem>
              <NavLink
                href="#"
                className="d-none d-md-block"
                onClick={sidebarHandler.bind(null)}
              >
                <i className="ti-menu" />
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto float-right" navbar>
            {/*--------------------------------------------------------------------------------*/}
            {/* Start Profile Dropdown                                                         */}
            {/*--------------------------------------------------------------------------------*/}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="pro-pic">
                <img
                  src={fileList.thumbUrl}
                  className="rounded-circle"
                  width="31"
                />
              </DropdownToggle>
              <DropdownMenu right className="user-dd">
                <span className="with-arrow">
                  <span className="bg-primary" />
                </span>
                <div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
                  <div className="">
                    <img
                      src={fileList.thumbUrl}
                      className="rounded-circle"
                      width="60"
                    />
                  </div>
                  <div className="ml-2">
                    <h4 className="mb-0 text-white">{fullName}</h4>
                    <p className=" mb-0">{email}</p>
                  </div>
                </div>
                <DropdownItem divider />
                <DropdownItem href="/pages/login" onClick={() => {
                  AuthenticationService.logout();
                }}>
                  <i className="fa fa-power-off mr-1 ml-1" /> Logout
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                <Link to='/view-admin'>
                  <div color="success" className="btn-rounded ml-3 mb-2 mt-2" >
                    View Profile
                  </div>
                </Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/*--------------------------------------------------------------------------------*/}
            {/* End Profile Dropdown                                                           */}
            {/*--------------------------------------------------------------------------------*/}
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
};
