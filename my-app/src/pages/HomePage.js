import React from "react";
import HelloWorld from "../components/HelloWorld";
import { Typography } from "@mui/material";

function HomePage() {
  return (
    <div>
      <Typography variant="h7">THEHomePage</Typography>
      <HelloWorld />
    </div>
  );
}

export default HomePage;
