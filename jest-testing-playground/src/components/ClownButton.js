import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const ClownButton = ({ text, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={onClick}
        style={{
          fontFamily: "Creepster",
          fontSize: "1.2rem",
          backgroundColor: "#ff006e",
          border: "2px solid #ffcc00",
        }}
      >
        {text}
      </Button>
    </motion.div>
  );
};

export default ClownButton; // ✅ Ensure this is a default export
