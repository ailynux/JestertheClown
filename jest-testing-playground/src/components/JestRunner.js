import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

const JestRunner = () => {
  const [testResult, setTestResult] = useState(null);

  const runTest = () => {
    setTestResult("🃏 Jest is laughing at your bugs... Running tests...");
    setTimeout(() => {
      setTestResult("✅ All tests passed! 🎭");
    }, 3000);
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h2">🎭 Jest Test Runner</Typography>
      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
        <Button variant="contained" color="primary" onClick={runTest}>
          Run Jest Tests
        </Button>
      </motion.div>
      {testResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            style={{ marginTop: "20px", color: "#ffcc00" }}
          >
            {testResult}
          </Typography>
        </motion.div>
      )}
    </Container>
  );
};

export default JestRunner;
