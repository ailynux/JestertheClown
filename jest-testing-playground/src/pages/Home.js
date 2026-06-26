import React from "react";
import { Box, Container, Typography, Button, Stack, Grid, Paper, Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BoltIcon from "@mui/icons-material/Bolt";
import ScienceIcon from "@mui/icons-material/Science";
import TestRunner from "../components/TestRunner";
import lessons from "../lessons/lessons";
import { getLessonIcon } from "../lessons/lessonIcons";

// Small uppercase eyebrow label used above each section heading.
const Eyebrow = ({ children }) => (
  <Typography
    sx={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 12,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: "rgba(46,230,110,0.7)",
      mb: 1.2,
    }}
  >
    {children}
  </Typography>
);

const stats = [
  { value: `${lessons.length}`, label: "guided lessons" },
  { value: "24", label: "playground scenarios" },
  { value: "100%", label: "runs in your browser" },
  { value: "0", label: "setup required" },
];

const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 30, color: "#2ee66e" }} />,
    title: "Understand the why",
    text: "Foundations lessons explain what Jest is, how it runs, what to test, and how real teams keep tests alive.",
  },
  {
    icon: <BoltIcon sx={{ fontSize: 30, color: "#2dd4bf" }} />,
    title: "Run tests instantly",
    text: "A real Jest-style runner lives in your browser. Write a test, hit run, see green or red.",
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 30, color: "#7dd3fc" }} />,
    title: "From zero to mocking",
    text: "Start with 2 + 2 and work up to async tests and mock functions — no setup required.",
  },
];

const demoCode = `test("welcome to the carnival", () => {
  const greeting = "Hello, " + "tester";
  expect(greeting).toBe("Hello, tester");
});

test("tests can fail too — try breaking this", () => {
  expect([1, 2, 3]).toHaveLength(3);
});`;

const Home = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(1100px 520px at 50% -8%, rgba(46,230,110,0.16), transparent), radial-gradient(800px 420px at 85% 10%, rgba(125,211,252,0.10), transparent), radial-gradient(700px 380px at 12% 20%, rgba(255,46,136,0.08), transparent)",
        }}
      >
        <Container maxWidth="md" sx={{ pt: { xs: 6, md: 9 }, pb: 8, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            style={{ position: "relative", display: "inline-block" }}
          >
            {/* glow rings behind mascot */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: { xs: 230, md: 300 },
                height: { xs: 230, md: 300 },
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(46,230,110,0.25), rgba(45,212,191,0.08) 45%, transparent 70%)",
                filter: "blur(4px)",
                zIndex: 0,
              }}
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Box
                component="img"
                src="/mascot.png"
                alt="Jest Carnival cyber-jester mascot"
                sx={{
                  position: "relative",
                  zIndex: 1,
                  width: { xs: 220, md: 300 },
                  height: "auto",
                  mb: 1,
                  filter: "drop-shadow(0 12px 40px rgba(46,230,110,0.35))",
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              sx={{
                display: "inline-block",
                mb: 3,
                px: 1.6,
                py: 0.6,
                borderRadius: 999,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                letterSpacing: "0.18em",
                color: "#2ee66e",
                border: "1px solid rgba(46,230,110,0.4)",
                backgroundColor: "rgba(46,230,110,0.06)",
              }}
            >
              {"> LEARN JEST. FOR REAL."}
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.6rem", md: "4.2rem" },
                lineHeight: 1.05,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Actually{" "}
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(90deg,#2ee66e,#2dd4bf 55%,#7dd3fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 0 30px rgba(46,230,110,0.3)",
                }}
              >
                get
              </Box>{" "}
              testing.
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", fontWeight: 400, maxWidth: 640, mx: "auto", mb: 4 }}
            >
              A hands-on carnival for mastering Jest — the most popular JavaScript
              testing framework. Understand the why, then write real tests and run
              them instantly. No setup, no fear.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                component={Link}
                to="/learn"
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 700, px: 4 }}
              >
                Start learning →
              </Button>
              <Button
                component={Link}
                to="/playground"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{ borderColor: "rgba(46,230,110,0.4)", color: "#cdeedd", px: 4 }}
              >
                Open the Playground
              </Button>
            </Stack>
          </motion.div>
        </Container>

        {/* Stats / trust band */}
        <Container maxWidth="lg" sx={{ pb: { xs: 5, md: 7 } }}>
          <Paper
            sx={{
              py: { xs: 2.5, md: 3 },
              px: { xs: 1, md: 3 },
              border: "1px solid rgba(46,230,110,0.15)",
              background:
                "linear-gradient(180deg, rgba(46,230,110,0.05), rgba(255,255,255,0))",
            }}
          >
            <Grid container alignItems="center">
              {stats.map((s, i) => (
                <Grid
                  item
                  xs={6}
                  md={3}
                  key={s.label}
                  sx={{
                    textAlign: "center",
                    py: { xs: 1.5, md: 0 },
                    borderRight: {
                      md: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Chakra Petch", sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: 28, md: 34 },
                      lineHeight: 1,
                      background: "linear-gradient(90deg,#2ee66e,#2dd4bf)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 13,
                      letterSpacing: "0.04em",
                      mt: 0.6,
                    }}
                  >
                    {s.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Live demo */}
      <Container maxWidth="md" sx={{ pb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Eyebrow>{"// Live runner"}</Eyebrow>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Try it right now
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 620 }}>
            No sandbox to install, no config to write. This is a fully working
            test runner — hit <strong>Run Tests</strong>, then change a value to
            watch a test turn red.
          </Typography>
          <Paper sx={{ p: { xs: 2, md: 4 }, border: "1px solid rgba(46,230,110,0.18)" }}>
            <TestRunner initialCode={demoCode} minRows={9} />
          </Paper>
        </motion.div>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Eyebrow>{"// Why it works"}</Eyebrow>
          <Typography variant="h4">Built to actually make it stick</Typography>
        </Box>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} md={4} key={f.title}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ height: "100%" }}
              >
                <Paper
                  sx={{
                    position: "relative",
                    p: 3,
                    height: "100%",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: "linear-gradient(90deg,#2ee66e,#2dd4bf,#7dd3fc)",
                      opacity: 0.85,
                    },
                    "&:hover": {
                      transform: "translateY(-5px)",
                      borderColor: "rgba(46,230,110,0.4)",
                      boxShadow: "0 14px 40px rgba(46,230,110,0.12)",
                    },
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>{f.icon}</Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>{f.text}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Curriculum teaser */}
      <Container maxWidth="md" sx={{ pb: 10, textAlign: "center" }}>
        <Eyebrow>{"// The curriculum"}</Eyebrow>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {lessons.length} lessons, zero fluff
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          From "why do we even test?" to mocking out a whole API.
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
          {lessons.map((l) => {
            const Icon = getLessonIcon(l.slug);
            return (
              <Chip
                key={l.slug}
                component={Link}
                to={`/learn/${l.slug}`}
                clickable
                icon={<Icon sx={{ fontSize: 17, color: "#2ee66e !important" }} />}
                label={l.title}
                sx={{
                  m: 0.5,
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "background-color 0.2s, border-color 0.2s, transform 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(46,230,110,0.15)",
                    borderColor: "rgba(46,230,110,0.5)",
                    transform: "translateY(-2px)",
                  },
                }}
              />
            );
          })}
        </Stack>

        <Divider sx={{ my: 5, borderColor: "rgba(255,255,255,0.08)" }} />

        <Typography variant="h5" sx={{ mb: 2 }}>
          Ready to step into the ring?
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button component={Link} to="/learn" variant="contained" color="primary" size="large" sx={{ px: 4, fontWeight: 700 }}>
            Start with the basics →
          </Button>
          <Button component={Link} to="/playground" variant="outlined" color="inherit" size="large" sx={{ px: 4, borderColor: "rgba(46,230,110,0.4)", color: "#cdeedd" }}>
            Jump into the Playground
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
