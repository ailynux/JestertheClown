import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid rgba(46,230,110,0.12)",
        py: 3,
        mt: 6,
      }}
    >
      <Stack
        spacing={1}
        alignItems="center"
        sx={{ maxWidth: 1100, mx: "auto", px: 2, textAlign: "center" }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SmartToyOutlinedIcon sx={{ fontSize: 18, color: "rgba(46,230,110,0.7)" }} />
          <Typography sx={{ color: "rgba(232,245,238,0.5)", fontSize: 14 }}>
            Jest Carnival — learn testing, one assertion at a time.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography component={Link} to="/learn" sx={{ color: "#2ee66e", fontSize: 13, textDecoration: "none" }}>
            Lessons
          </Typography>
          <Typography component={Link} to="/playground" sx={{ color: "#2ee66e", fontSize: 13, textDecoration: "none" }}>
            Playground
          </Typography>
          <Typography
            component="a"
            href="https://jestjs.io/docs/getting-started"
            target="_blank"
            rel="noreferrer"
            sx={{ color: "#2ee66e", fontSize: 13, textDecoration: "none" }}
          >
            Official Jest Docs ↗
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
