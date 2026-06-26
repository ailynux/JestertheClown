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
    h2: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700, letterSpacing: "-0.005em" },
    h4: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Chakra Petch", sans-serif', fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Consistent, accessible focus ring across the whole app.
        "*:focus-visible": {
          outline: "2px solid rgba(46,230,110,0.7)",
          outlineOffset: "2px",
          borderRadius: "6px",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          transition:
            "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
          "&:active": { transform: "translateY(1px)" },
        },
        sizeLarge: { padding: "10px 26px", fontSize: "1rem" },
        containedPrimary: {
          color: "#04150b",
          boxShadow: "0 6px 20px rgba(46,230,110,0.28)",
          "&:hover": {
            boxShadow: "0 10px 28px rgba(46,230,110,0.4)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          "&:hover": { borderColor: "rgba(46,230,110,0.6)", transform: "translateY(-1px)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0))",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, letterSpacing: "0.01em" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0c1712",
          border: "1px solid rgba(46,230,110,0.25)",
          fontSize: 12,
          fontFamily: '"Space Grotesk", sans-serif',
        },
        arrow: { color: "#0c1712" },
      },
    },
    MuiLink: {
      styleOverrides: { root: { textUnderlineOffset: "3px" } },
    },
  },
});

export default theme;
