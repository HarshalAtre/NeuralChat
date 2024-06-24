import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents' 
import { Box, Stack, Typography } from '@mui/material';
import AvatarCard from './AvatarCard';
import { motion } from "framer-motion";

const ChatItem = (  {avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,}) => {
  return (
    <Link  sx={{ padding:"0","&:hover": {
                bgcolor: "#cdc1ff",
              },}}  to={`/chat/${_id}`}  onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.01 }}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: sameSender ? "#0288d1" : "#f5e4fe",
        color: sameSender ? "white" : "unset",
        position: "relative",
        padding: "1rem",
        border:"1px solid black",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "0.3rem 1rem",
        maxWidth: "100%",
        alignSelf: sameSender ? "flex-end" : "flex-start",
      }}
      
      >

<AvatarCard avatar={avatar} />

<Stack>
  <Typography>{name}</Typography>
  {newMessageAlert && (
    <Typography>{newMessageAlert.count} New Message</Typography>
  )}
</Stack>

{isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}


        </motion.div>

    </Link>
  )
}

export default memo(ChatItem);