import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Grid, Paper, Stack, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { motion } from "framer-motion";
import challenges, { DIFFICULTY_COLORS } from "../challenges/challenges";
import { getCompleted } from "../lessons/progress";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

const Challenges = () => {
  const [completed, setCompleted] = useState(getCompleted());

  useEffect(() => {
    const update = () => setCompleted(getCompleted());
    window.addEventListener("jest-academy-progress", update);
    return () => window.removeEventListener("jest-academy-progress", update);
  }, []);

  const doneCount = challenges.filter((c) => completed[`challenge:${c.slug}`]).length;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        sx={{
          fontFamily: monoFont,
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,184,76,0.8)",
          mb: 1.2,
        }}
      >
        {"// Reverse TDD"}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <EmojiEventsOutlinedIcon sx={{ fontSize: 34, color: "#ffb84c" }} />
        <Typography variant="h3">Challenges</Typography>
      </Stack>
      <Typography sx={{ color: "text.secondary", mb: 1, maxWidth: 720 }}>
        The tests are already written. Your job is to write the code that makes them pass —
        the exact way real test-driven development feels. Read the spec, implement, go green.
      </Typography>
      <Chip
        label={`${doneCount} / ${challenges.length} solved`}
        sx={{
          mb: 4,
          backgroundColor: doneCount === challenges.length ? "rgba(74,222,128,0.18)" : "rgba(255,255,255,0.05)",
          color: doneCount === challenges.length ? "#4ade80" : "text.secondary",
          fontWeight: 700,
        }}
      />

      <Grid container spacing={2.5}>
        {challenges.map((c, i) => {
          const isDone = !!completed[`challenge:${c.slug}`];
          const color = DIFFICULTY_COLORS[c.difficulty] || "#2ee66e";
          return (
            <Grid item xs={12} sm={6} md={4} key={c.slug}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ height: "100%" }}
              >
                <Paper
                  component={Link}
                  to={`/challenges/${c.slug}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    p: 2.5,
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "transform 0.18s, border-color 0.18s",
                    "&:hover": { transform: "translateY(-4px)", borderColor: `${color}88` },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      label={c.difficulty}
                      size="small"
                      sx={{ backgroundColor: `${color}22`, color, fontWeight: 700 }}
                    />
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                      <AccessTimeIcon sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: 12 }}>{c.minutes} min</Typography>
                    </Stack>
                    {isDone && <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 20, ml: "auto" }} />}
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 0.8, color: "#e8f5ee" }}>
                    {c.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 14, lineHeight: 1.6, flex: 1 }}>
                    {c.blurb}
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 2, color }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {isDone ? "Solve again" : "Start challenge"}
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Stack>
                </Paper>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Challenges;
