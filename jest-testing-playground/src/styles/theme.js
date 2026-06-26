import { createTheme } from "@mui/material/styles";

// "Neon carnival after dark" — a green-forward palette with teal and a touch
// of gold, matching the robot-clown mascot.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2ee66e", // neon green
    },
    secondary: {
      main: "#2dd4bf", // teal
    },
    success: {
      main: "#4ade80",
    },
    warning: {
      main: "#ffcc00",
    },
    error: {
      main: "#ff5470",
    },
    background: {
      default: "#070d0a",
      paper: "#0f1714",
    },
    text: {
      primary: "#e8f5ee",
      secondary: "rgba(232,245,238,0.62)",
    },
  },
  typography: {
    fontFamily:
      '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700, letterSpacing: "-0.01em" },
    h2: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
        containedPrimary: {
          color: "#04150b",
          boxShadow: "0 6px 20px rgba(46,230,110,0.25)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
  },
});

export default theme;
