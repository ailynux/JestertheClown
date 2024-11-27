import React from "react";
import { Typography, Container } from "@mui/material";
import CustomizedDialogs from "./ModalAlert"; // Adjust the path as needed

function HelloWorld() {
  return (
    <Container>
      <Typography variant="h1">Hello, World!</Typography>
      <CustomizedDialogs />
    </Container>
  );
}

export default HelloWorld;
