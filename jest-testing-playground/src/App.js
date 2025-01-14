import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // ✅ Ensure correct import
import Playground from "./pages/Playground";
import Docs from "./pages/Docs";
import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
