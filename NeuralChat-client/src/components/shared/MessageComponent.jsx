import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#0288d1" : "white",
        color: sameSender ? "white" : "black",
        borderRadius: "10px",
        padding: "0.4rem",
        width: "fit-content",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "0.5rem 0",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {content && <Typography style={{ margin: "0.5rem 0" }}>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index} style={{ margin: "0.5rem 0" }}>
              <a
                href={url}
                target="_blank"
                download={file.name}
                style={{
                  color: sameSender ? "white" : lightBlue,
                  textDecoration: "none",
                  display: "inline-block",
                  padding: "0.5rem",
                  backgroundColor: sameSender ? lightBlue : "#f0f0f0",
                  borderRadius: "5px",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        color={sameSender ? "white" : "text.secondary"}
        style={{ marginTop: "0.5rem", display: "block", textAlign: "right" }}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
