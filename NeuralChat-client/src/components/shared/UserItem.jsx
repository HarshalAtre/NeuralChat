import {
  Avatar,
  IconButton,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {
  const { name, _id, avatar } = user;
  return (
    <ListItem sx={{ borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", mb: 1 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        p={1}
        {...styling}
      >
        <Avatar
          src={transformImage(avatar)}
          sx={{ width: 56, height: 56, border: "2px solid #1976d2" }}
        />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          {name}
        </Typography>

        <IconButton
          size="small"
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.dark" : "primary.dark",
            },
            borderRadius: "50%",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
