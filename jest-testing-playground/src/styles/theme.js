import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e63946", // Blood red
    },
    secondary: {
      main: "#f77f00", // Neon orange
    },
    background: {
      default: "#1b1b2f", // Deep dark
      paper: "#25274d", // Purple-ish dark
    },
    text: {
      primary: "#f4f4f8", // White-ish
      secondary: "#ffcc00", // Neon Yellow
    },
  },
  typography: {
    fontFamily: "Creepster, Arial, sans-serif",
    h1: { fontSize: "3rem", color: "#ffcc00" },
    h2: { fontSize: "2.5rem", color: "#ff006e" },
  },
});

export default theme;
