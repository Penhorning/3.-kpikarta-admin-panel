import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
const mapStateToProps = (state) => ({
  ...state,
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.expandLogo = this.expandLogo.bind(this);
    this.activeRoute.bind(this);
    this.state = {
      authentication: this.activeRoute("/authentication") !== "" ? true : false,
      uicomponents: this.activeRoute("/ui-components") !== "" ? true : false,
      samplepages: this.activeRoute("/sample-pages") !== "" ? true : false,
      dashboardpages: this.activeRoute("/dahboards") !== "" ? true : false,
      iconsPages: this.activeRoute("/icons") !== "" ? true : false,
      formlayoutPages: this.activeRoute("/form-layouts") !== "" ? true : false,
      formpickerPages: this.activeRoute("/form-pickers") !== "" ? true : false,
    };
  }
  /*--------------------------------------------------------------------------------*/
  /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
  /*--------------------------------------------------------------------------------*/
  expandLogo() {
    document.getElementById("logobg").classList.toggle("expand-logo");
  }
  /*--------------------------------------------------------------------------------*/
  /*Verifies if routeName is the one active (in browser input)                      */
  /*--------------------------------------------------------------------------------*/
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1
      ? "selected"
      : "";
  }

  render() {
    return (
      <aside
        className="left-sidebar"
        id="sidebarbg"
        data-sidebarbg={this.props.settings.activeSidebarBg}
        onMouseEnter={this.expandLogo}
        onMouseLeave={this.expandLogo}
      >

        {/* <List>
        {['Inbox', 'Starred', 'Sends email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}

        <div className="scroll-sidebar" >
          <PerfectScrollbar className="sidebar-nav" >
            {/*--------------------------------------------------------------------------------*/}
            {/* Sidebar Menus will go here                                                     */}
            {/*--------------------------------------------------------------------------------*/}
            <Nav id="sidebarnav">
              {this.props.routes.filter(item => item.sideRoute === true).map((prop, key) => {
                if (prop.redirect) {
                  return null;
                } else if (prop.navlabel) {
                  return (
                    <li className="nav-small-cap" key={key}>
                      <i className={prop.icon}></i>
                      <ListItem className="hide-menu">{prop.name}</ListItem>
                      <span className="hide-menu">{prop.name}</span>
                    </li>
                  );
                } else if (prop.collapse) {
                  let firstdd = {};
                  firstdd[prop["state"]] = !this.state[prop.state];
                  return (
                    /*--------------------------------------------------------------------------------*/
                    /* Menus wiil be goes here                                                        */
                    /*--------------------------------------------------------------------------------*/
                    <li
                      className={this.activeRoute(prop.path) + " sidebar-item"}
                      key={key}
                    >
                      <span
                        data-toggle="collapse"
                        className="sidebar-link has-arrow"
                        aria-expanded={this.state[prop.state]}
                        onClick={() => this.setState(firstdd)}
                      >
                        <i className={prop.icon} />
                        <ListItem className="hide-menu">{prop.name}</ListItem>
                        <span className="hide-menu">{prop.name}</span>
                      </span>
                      {/*--------------------------------------------------------------------------------*/}
                      {/* Sub-Menus wiil be goes here                                                    */}
                      {/*--------------------------------------------------------------------------------*/}
                      <Collapse isOpen={this.state[prop.state]}>
                        <ul className="first-level">
                          {prop.child.map((prop, key) => {
                            if (prop.redirect) return null;
                            if (prop.collapse) {
                              let seconddd = {};
                              seconddd[prop["state"]] = !this.state[prop.state];
                              return (
                                <li
                                  className={
                                    this.activeRoute(prop.path) +
                                    " sidebar-item"
                                  }
                                  key={key}
                                >
                                  <span
                                    data-toggle="collapse"
                                    className="sidebar-link has-arrow"
                                    aria-expanded={this.state[prop.state]}
                                    onClick={() => this.setState(seconddd)}
                                  >
                                    <i className={prop.icon} />
                                    <ListItem className="hide-menu">{prop.name}</ListItem>
                                    <span className="hide-menu">
                                      {prop.name}
                                    </span>
                                  </span>
                                  {/*--------------------------------------------------------------------------------*/}
                                  {/* Sub-Menus wiil be goes here                                                    */}
                                  {/*--------------------------------------------------------------------------------*/}
                                  <Collapse isOpen={this.state[prop.state]}>
                                    <ul className="second-level">
                                      {prop.subchild.map((prop, key) => {
                                        if (prop.redirect) return null;
                                        return (
                                          <li
                                            className={ this.activeRoute(prop.path) + " sidebar-item" }
                                            key={key}
                                          >
                                            <NavLink
                                              to={prop.path}
                                              activeClassName="active"
                                              className="sidebar-link"
                                            >
                                              <i className={prop.icon} />
                                              <span className="hide-menu">
                                                {prop.name}
                                              </span>
                                            </NavLink>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Collapse>
                                </li>
                              );
                            }
                            return (
                              /*--------------------------------------------------------------------------------*/
                              /* Adding Sidebar Item                                                            */
                              /*--------------------------------------------------------------------------------*/
                              <li
                                className={ this.activeRoute(prop.path) + (prop.pro ? " active active-pro" : "") + " sidebar-item" }
                                key={key}
                              >
                                <NavLink
                                  to={prop.path}
                                  className="sidebar-link"
                                  activeClassName="active"
                                >
                                  <i className={prop.icon} />
                                  <ListItem className="hide-menu">{prop.name}</ListItem>
                                  <span className="hide-menu">{prop.name}</span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </Collapse>
                    </li>
                  );
                } else {
                  return (
                    /*--------------------------------------------------------------------------------*/
                    /* Adding Sidebar Item                                                            */
                    /*--------------------------------------------------------------------------------*/
                    <List
                      className={ this.activeRoute(prop.path) + (prop.pro ? " active active-pro" : "") + " sidebar-item" }
                      style={{ padding: '5px' }}
                      key={key}
                    >
                      <NavLink
                        to={prop.path}
                        className="sidebar-link"
                        activeClassName="active"
                      >
                        <ListItem key={key} style={{ paddingLeft: 0, paddingRight: 2, paddingTop: 0, paddingBottom: 0 }}>
                          <ListItemIcon>
                            <i className={prop.icon} />
                          </ListItemIcon>
                          <ListItemText style={{color:'white'}} primary={prop.name} />
                        </ListItem>
                      </NavLink>
                    </List >
                  );
                }
              })}
            </Nav>
          </PerfectScrollbar>
        </div>
      </aside>
    );
  }
}
export default connect(mapStateToProps)(Sidebar);
