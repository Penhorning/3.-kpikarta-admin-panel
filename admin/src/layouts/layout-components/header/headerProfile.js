import React, { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { AuthenticationService } from "../../../shared/_services";
import { UserService } from "../../../shared/_services";
import { useSelector } from "react-redux";
import Constants from '../../../shared/_helpers/constants';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip'
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

export default function HeaderProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const settings = useSelector((state) => state.settings);
    const [userId, setUserIds] = useState(AuthenticationService.currentUser.source._value.userId)
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [fileList, setFileList] = useState([{ thumbUrl: '' }]);
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const toggle = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
        // get individula user data by passing user id
        UserService.getUserDetails(userId, enqueueSnackbar).then(response => {
          setFullName(response.fullName)
          setEmail(response.email)
          setFileList({ thumbUrl: response.profilePic ? `${Constants.BASE_URL}/user/${response.profilePic}` : `${'https://i.ibb.co/wynJtDH/avatar.png'}` })
        });
      }, [userId])
  
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 56, height: 56 }} src={fileList.thumbUrl} />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
             >
              <MenuItem style={{backgroundColor:'#e3eaf1'}} >
                <ListItemIcon>
                  <Avatar src={fileList.thumbUrl} fontSize="small" />
                </ListItemIcon>
                <div className="ml-2">
                  <h4 className="mb-0">{fullName}</h4>
                  <p className=" mb-0">{email}</p>
                </div>
              </MenuItem>
              <Link to='/edit-profile'>
                <MenuItem>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <h5 style={{marginTop: '10px'}}> Edit Profile </h5>
                </MenuItem>
              </Link>
              <Link to='/settings'>
                <MenuItem>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  <h5 style={{marginTop: '10px'}}> Settings </h5>
                </MenuItem>
              </Link>
              <Divider />
              <MenuItem
                component={Link}
                to="/pages/login"
                onClick={() => { AuthenticationService.logout(); }}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <h5 style={{marginTop: '10px'}}> Logout </h5>
              </MenuItem>
            </Menu>
    </>
  )
}
