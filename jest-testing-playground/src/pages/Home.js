import React from "react";
import { Container, Typography } from "@mui/material";
import ClownButton from "../components/ClownButton"; // ✅ Ensure correct import

const Home = () => {
  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h1">🎭 Welcome to JestertheClown! 🎭</Typography>
      <Typography variant="body1">
        A fun, interactive Jest testing playground.
      </Typography>
      <ClownButton
        text="Enter the Playground 🎪"
        onClick={() => alert("Welcome to the Jest circus! 🤡")}
      />
    </Container>
  );
};

export default Home; // ✅ Make sure it's a default export
