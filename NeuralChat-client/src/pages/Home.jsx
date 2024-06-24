import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/color";
const Home = () => {
  return (
    <Box bgcolor={"rgb(231, 215, 234)"} height={"100%"}>
    <Typography p={"2rem"} variant="h5" textAlign={"center"}>
      Select a friend to chat Or Add more Using Search Icon
    </Typography>
  </Box>
  )
}
export default AppLayout()(Home);
