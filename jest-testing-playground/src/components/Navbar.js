import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: "#1b1b2f" }}>
      <Toolbar>
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ yoyo: Infinity, duration: 1 }}
        >
          <Typography
            variant="h4"
            style={{
              fontFamily: "Creepster",
              color: "#ffcc00",
              flexGrow: 1,
            }}
          >
            🎭 JestertheClown 🎭
          </Typography>
        </motion.div>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/playground">
          Playground
        </Button>
        <Button color="inherit" component={Link} to="/docs">
          Docs
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
