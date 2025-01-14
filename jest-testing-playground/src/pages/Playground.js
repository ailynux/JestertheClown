import React from "react";
import { Container, Typography } from "@mui/material";

const Playground = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h1">🎪 Jest Playground 🎪</Typography>
      <Typography variant="body1">Run your Jest tests in style!</Typography>
    </Container>
  );
};

export default Playground; // ✅ Ensure it's a default export
