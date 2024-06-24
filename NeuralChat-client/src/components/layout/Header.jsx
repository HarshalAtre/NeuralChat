import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import "./Header.css"
import {
  Alert,
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { Suspense, lazy, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import { resetNotificationCount } from "../../redux/reducers/chat";
import {
  setIsEmojify,
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
  setType,
} from "../../redux/reducers/misc";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const dispatch = useDispatch();

  const { isSearch, isNotification,isNewGroup,isEmojify,type  } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);
  
  
  
  const navigate = useNavigate();
  const handleMobile = () => {
    // console.log(set)
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const navigateToGroup = () => {
    navigate("/groups");
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(data.message);
      dispatch(userNotExists());
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const handleToggle=()=>{
    dispatch(setIsEmojify(!isEmojify))
    if(isEmojify){
      toast.success("AutoComplete is On")
    }else{
    toast.success("Emojify is On")
    }
    console.log(isEmojify)
  }


  const handleChange = (event) => {
    dispatch(setType(event.target.value));
  };

  
  return (
    <>
    <Box sx={{ flexGrow: 1,marginTop:"3px" }} height={"4.03rem"} >
      <AppBar
        // position="static"
        sx={{
          background: "linear-gradient(90deg, rgba(127,57,225,1) 0%, rgba(162,89,205,1) 35%, rgba(176,130,218,1) 71%, rgba(127,57,225,1) 100%)"
          , // Gradient background
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          color: '#ffffff',
          marginBottom:"5px" ,
          // width:"90vw"
        }}
       
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              fontFamily: 'Cursive',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}
          >
            NeuralChat
          </Typography>

          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
            }}
          >
            <IconButton color="inherit" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
          { isEmojify
           && 
           < >
           <Typography 
           className="selectHiddenBelow500"
           sx={{
            display: {
              xs: "none",
              md: "block",
            }}}
           >Your Typing Speed</Typography>
           <Select
           className="selectHiddenBelow500 chota"

           labelId="demo-simple-select-label"
           id="demo-simple-select"
           
           
           style={{
            color:"white",
            minWidth:"7rem",
            marginLeft:"10px",
            height:"2.7rem"
           }}
           value={type}
           
           onChange={handleChange}
         >
           <MenuItem value={10}>Slow</MenuItem>
           <MenuItem value={20}>Medium</MenuItem>
           <MenuItem value={30}>Fast</MenuItem>
         </Select>
         </>
         }
          <Tooltip title= {isEmojify? "AutoComplete":"Emojify"}>

          <Switch label="k" onClick={handleToggle}  color="warning" />
          
          </Tooltip>
            <IconBtn
              onClick={openSearch}
              title="Search"
              icon={<SearchIcon />}
            />
            <IconBtn
              onClick={openNewGroup}
              title="New Group"
              icon={<AddIcon />}
            />
            <IconBtn
              onClick={navigateToGroup}
              title="Manage Groups"
              icon={<GroupIcon />}
            />
            <IconBtn
              onClick={openNotification}
              title="Notifications"
              icon={<NotificationsIcon />}
              value={notificationCount}
            />
      <Tooltip title="Logout"
       sx={{
        display: {
          xs: "inline",
          md: "none",
        }}}
      >
      <IconButton color="inherit" onClick={logoutHandler} size="large">
        { (
          <LogoutIcon sx={{
            display: {
              xs: "block",
              md: "none",
            }}}/>
        )}
      
      </IconButton>
    </Tooltip>
           
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    {isSearch && (
      <Suspense fallback={<Backdrop open />}>
        <SearchDialog />
      </Suspense>
    )}
    {isNotification && (
      <Suspense fallback={<Backdrop open />}>
        <NotificationDialog />
      </Suspense>
    )}
    {isNewGroup && (
      <Suspense fallback={<Backdrop open />}>
        <NewGroupDialog />
      </Suspense>
    )}
  </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" onClick={onClick} size="large">
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      
      </IconButton>
    </Tooltip>
  );
};

export default Header;
