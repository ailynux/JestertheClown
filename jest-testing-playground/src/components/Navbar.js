import React from "react";
import { AppBar, Toolbar, Typography, Box, Stack } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/playground", label: "Playground" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(180deg, rgba(7,13,10,0.92) 0%, rgba(7,13,10,0.7) 100%)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid transparent",
        borderImage: "linear-gradient(90deg, transparent, rgba(46,230,110,0.5), rgba(45,212,191,0.5), transparent) 1",
      }}
    >
      <Toolbar sx={{ maxWidth: 1160, width: "100%", mx: "auto", py: 0.5 }}>
        <Box
          component={Link}
          to="/"
          sx={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1.4 }}
        >
          <motion.img
            src="/mascot.png"
            alt="Jest Carnival mascot"
            whileHover={{ scale: 1.1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              filter: "drop-shadow(0 0 10px rgba(46,230,110,0.55))",
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: { xs: 16, sm: 20 },
                lineHeight: 1,
                letterSpacing: "0.04em",
                background: "linear-gradient(90deg,#2ee66e,#2dd4bf 60%,#7dd3fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JEST CARNIVAL
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9.5,
                letterSpacing: "0.32em",
                color: "rgba(46,230,110,0.55)",
                mt: 0.3,
              }}
            >
              {"// LEARN.TO.TEST"}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }} sx={{ ml: "auto" }} alignItems="center">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Box
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  px: 1,
                  py: 1,
                  fontFamily: '"Chakra Petch", sans-serif',
                  fontWeight: active ? 700 : 500,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  color: active ? "#2ee66e" : "rgba(232,245,238,0.72)",
                  transition: "color 0.2s",
                  "&:hover": { color: "#fff" },
                }}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    style={{
                      position: "absolute",
                      left: 4,
                      right: 4,
                      bottom: 2,
                      height: 2,
                      borderRadius: 2,
                      background: "linear-gradient(90deg,#2ee66e,#2dd4bf)",
                      boxShadow: "0 0 8px rgba(46,230,110,0.8)",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
