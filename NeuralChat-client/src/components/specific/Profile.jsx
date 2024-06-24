import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";

import moment from "moment";
import './ProfileCard.css'; // Assuming you have a CSS file for styling
import { transformImage } from "../../lib/features";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import { userNotExists } from "../../redux/reducers/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";

const ProfileCard = ({user}) => {
  const {isSearch}=useSelector(state=>state.misc)
  const dispatch = useDispatch()
  const handleOnClick=()=>{
    dispatch(setIsSearch(!isSearch))
  }
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
  return (
    <div className="all">
    <div className="card-perfil">
      <div className="area-img">
        <div className="area-interna">
          <img src={transformImage(user?.avatar?.url)} alt="" />
        </div>
      </div>
      <div className="icon arrow"><i className="fas fa-arrow-left"></i></div>
      <div className="icon dots"><i className="fas fa-share-alt"></i></div>
      <div className="nome">@{user?.username}</div>
      <div className="sobre">{user?.name}</div>
      <div className="icones-red-social">
      {user?.bio}
      </div>
      <div className="botoes">
        <button onClick={handleOnClick}>Add Freinds</button>
        <button onClick={logoutHandler}>Logout</button>
      </div>
      <div className="compartilhamento">
      {moment(user?.createdAt).fromNow()}
      </div>
    </div>
    </div>
  );
};

export default ProfileCard;
