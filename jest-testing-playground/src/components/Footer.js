import React from "react";
import { Box, Typography, Stack, Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const monoFont = '"JetBrains Mono", monospace';

const columns = [
  {
    title: "Learn",
    links: [
      { label: "All lessons", to: "/learn" },
      { label: "Playground", to: "/playground" },
      { label: "Home", to: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Official Jest Docs", href: "https://jestjs.io/docs/getting-started" },
      { label: "Expect / Matchers", href: "https://jestjs.io/docs/expect" },
      { label: "Mock Functions", href: "https://jestjs.io/docs/mock-functions" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Source on GitHub", href: "https://github.com/ailynux/JestertheClown" },
      { label: "Testing Library", href: "https://testing-library.com/docs/react-testing-library/intro/" },
    ],
  },
];

const linkSx = {
  color: "rgba(232,245,238,0.6)",
  fontSize: 13.5,
  textDecoration: "none",
  transition: "color 0.2s",
  "&:hover": { color: "#2ee66e" },
};

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        borderTop: "1px solid transparent",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(46,230,110,0.35), rgba(45,212,191,0.35), transparent) 1",
        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(46,230,110,0.03))",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.3} alignItems="center" sx={{ mb: 1.5 }}>
              <Box
                component="img"
                src="/mascot.png"
                alt="Jest Carnival"
                sx={{ width: 40, height: 40, objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(46,230,110,0.5))" }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: "0.04em",
                    background: "linear-gradient(90deg,#2ee66e,#2dd4bf 60%,#7dd3fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  JEST CARNIVAL
                </Typography>
                <Typography sx={{ fontFamily: monoFont, fontSize: 9, letterSpacing: "0.3em", color: "rgba(46,230,110,0.55)" }}>
                  {"// LEARN.TO.TEST"}
                </Typography>
              </Box>
            </Stack>
            <Typography sx={{ color: "rgba(232,245,238,0.5)", fontSize: 13.5, maxWidth: 300 }}>
              An interactive playground for mastering Jest and the craft of testing —
              one green checkmark at a time.
            </Typography>
          </Grid>

          {columns.map((col) => (
            <Grid item xs={6} sm={4} md={2.6} key={col.title}>
              <Typography
                sx={{
                  fontFamily: monoFont,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(45,212,191,0.8)",
                  mb: 1.5,
                }}
              >
                {col.title}
              </Typography>
              <Stack spacing={1}>
                {col.links.map((l) =>
                  l.to ? (
                    <Box key={l.label} component={Link} to={l.to} sx={linkSx}>
                      {l.label}
                    </Box>
                  ) : (
                    <Box key={l.label} component="a" href={l.href} target="_blank" rel="noreferrer" sx={linkSx}>
                      {l.label} ↗
                    </Box>
                  )
                )}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ py: 2.5 }}
          >
            <Typography sx={{ color: "rgba(232,245,238,0.4)", fontSize: 12.5 }}>
              © {new Date().getFullYear()} Jest Carnival. Built for learners, by Ailyn.
            </Typography>
            <Typography sx={{ fontFamily: monoFont, color: "rgba(232,245,238,0.35)", fontSize: 11.5 }}>
              {"// no bugs survive this carnival"}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
