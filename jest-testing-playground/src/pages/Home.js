import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Stack, Grid, Paper, Chip, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BoltIcon from "@mui/icons-material/Bolt";
import ScienceIcon from "@mui/icons-material/Science";
import TestRunner from "../components/TestRunner";
import lessons from "../lessons/lessons";
import challenges from "../challenges/challenges";
import { getLessonIcon } from "../lessons/lessonIcons";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

// Headline word that cycles through synonyms with a vertical flip.
const ROTATING_WORDS = ["testing.", "fearless.", "confident.", "unstoppable.", "shipping."];
const RotatingWord = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ROTATING_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <Box component="span" sx={{ display: "inline-block", minWidth: 10 }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.6em", opacity: 0 }}
          transition={{ duration: 0.32 }}
          style={{
            display: "inline-block",
            backgroundImage: "linear-gradient(90deg,#2ee66e,#2dd4bf 55%,#7dd3fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 32px rgba(46,230,110,0.35)",
          }}
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </Box>
  );
};

// Auto-playing fake terminal: types a test, then shows it pass, then loops.
const TERMINAL_CODE = `test("adds numbers", () => {
  expect(add(2, 2)).toBe(4);
});`;
const HeroTerminal = () => {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let typeTimer;
    let resetTimer;
    const tick = () => {
      if (i <= TERMINAL_CODE.length) {
        setTyped(TERMINAL_CODE.slice(0, i));
        i += 1;
        typeTimer = setTimeout(tick, 34);
      } else {
        setDone(true);
        resetTimer = setTimeout(() => {
          setDone(false);
          setTyped("");
          i = 0;
          tick();
        }, 3400);
      }
    };
    tick();
    return () => {
      clearTimeout(typeTimer);
      clearTimeout(resetTimer);
    };
  }, []);

  return (
    <Paper
      sx={{
        textAlign: "left",
        overflow: "hidden",
        border: "1px solid rgba(46,230,110,0.25)",
        boxShadow: "0 24px 70px rgba(0,0,0,0.5), 0 0 40px rgba(46,230,110,0.12)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ px: 2, py: 1.2, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <Stack direction="row" spacing={0.7}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <Box key={c} sx={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c }} />
          ))}
        </Stack>
        <Typography sx={{ fontFamily: monoFont, fontSize: 12.5, color: "rgba(232,245,238,0.7)" }}>
          carnival.test.js
        </Typography>
      </Stack>

      <Box sx={{ p: 2, minHeight: 188, fontFamily: monoFont, fontSize: 13.5, lineHeight: 1.7 }}>
        <Box component="pre" sx={{ m: 0, color: "#cdeedd", whiteSpace: "pre-wrap" }}>
          {typed}
          {!done && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 8,
                height: 16,
                ml: "1px",
                verticalAlign: "text-bottom",
                backgroundColor: "#2ee66e",
                animation: "heroBlink 1s steps(2) infinite",
                "@keyframes heroBlink": { "50%": { opacity: 0 } },
              }}
            />
          )}
        </Box>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: 14 }}
            >
              <Box sx={{ fontFamily: monoFont, fontSize: 13 }}>
                <Box component="span" sx={{ px: 0.8, py: 0.2, borderRadius: 0.8, backgroundColor: "#1f9d57", color: "#04150b", fontWeight: 700 }}>
                  PASS
                </Box>
                <Box component="span" sx={{ color: "rgba(232,245,238,0.6)", ml: 1 }}>
                  carnival.test.js
                </Box>
                <Box sx={{ color: "#5ef08f", mt: 1 }}>✓ adds numbers (1 ms)</Box>
                <Box sx={{ color: "rgba(232,245,238,0.55)", mt: 1 }}>
                  Tests: <Box component="span" sx={{ color: "#5ef08f" }}>1 passed</Box>, 1 total
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

// A handful of slow-floating sparkles for the hero backdrop.
const Sparkles = () => {
  const dots = [
    { top: "14%", left: "8%", size: 6, color: "#2ee66e", delay: 0 },
    { top: "24%", left: "88%", size: 5, color: "#7dd3fc", delay: 0.6 },
    { top: "62%", left: "12%", size: 4, color: "#2dd4bf", delay: 1.1 },
    { top: "70%", left: "82%", size: 7, color: "#2ee66e", delay: 0.3 },
    { top: "40%", left: "50%", size: 4, color: "#7dd3fc", delay: 1.5 },
    { top: "10%", left: "60%", size: 5, color: "#2dd4bf", delay: 0.9 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.2, y: 0 }}
          animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i, delay: d.delay, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            boxShadow: `0 0 12px ${d.color}`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
};

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
  { value: `${challenges.length}`, label: "code challenges" },
  { value: "100%", label: "runs in your browser" },
  { value: "0", label: "setup required" },
];

const trustPills = [
  "⚡ In-browser Jest engine",
  `📚 ${lessons.length} lessons`,
  `🏆 ${challenges.length} challenges`,
  "🚀 Zero setup",
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
        <Sparkles />
        <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: 8, position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* Left: copy + CTAs */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: "left" }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    display: "inline-flex",
                    mb: 3,
                    px: 1.6,
                    py: 0.6,
                    borderRadius: 999,
                    fontFamily: monoFont,
                    fontSize: 12,
                    letterSpacing: "0.18em",
                    color: "#2ee66e",
                    border: "1px solid rgba(46,230,110,0.4)",
                    backgroundColor: "rgba(46,230,110,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "#2ee66e",
                      boxShadow: "0 0 8px #2ee66e",
                      animation: "heroPulse 1.6s ease-in-out infinite",
                      "@keyframes heroPulse": { "50%": { opacity: 0.3 } },
                    }}
                  />
                  <span>{"LEARN JEST. FOR REAL."}</span>
                </Stack>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.8rem", md: "4.4rem" },
                    lineHeight: 1.02,
                    mb: 2.5,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Actually get
                  <br />
                  <RotatingWord />
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "text.secondary", fontWeight: 400, maxWidth: 520, mb: 3.5, lineHeight: 1.6 }}
                >
                  A hands-on carnival for mastering Jest — JavaScript's most popular
                  testing framework. Understand the <em>why</em>, then write real tests
                  and run them instantly. No setup, no fear.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                <Stack direction="row" spacing={1} sx={{ mt: 3.5, flexWrap: "wrap", gap: 1 }}>
                  {trustPills.map((p) => (
                    <Box
                      key={p}
                      sx={{
                        px: 1.4,
                        py: 0.6,
                        borderRadius: 999,
                        fontSize: 12.5,
                        color: "rgba(232,245,238,0.75)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {p}
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Right: mascot + auto-playing terminal */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", maxWidth: 460, mx: "auto" }}>
                <Box
                  sx={{
                    position: "absolute",
                    inset: -30,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(46,230,110,0.22), rgba(45,212,191,0.06) 45%, transparent 70%)",
                    filter: "blur(6px)",
                    zIndex: 0,
                  }}
                />
                <motion.img
                  src="/mascot.png"
                  alt="Jest Carnival cyber-jester mascot"
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.35 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% - 26px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 124,
                    height: "auto",
                    zIndex: 3,
                    filter: "drop-shadow(0 10px 24px rgba(46,230,110,0.4))",
                    pointerEvents: "none",
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <HeroTerminal />
                </motion.div>
              </Box>
            </Grid>
          </Grid>
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
