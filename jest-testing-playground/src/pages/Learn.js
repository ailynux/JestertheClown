import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Box,
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import lessons, { TRACKS } from "../lessons/lessons";
import { getLessonIcon, trackIcons } from "../lessons/lessonIcons";
import { getCompleted } from "../lessons/progress";

const levelColors = {
  Concept: "#2dd4bf",
  Beginner: "#2ee66e",
  Intermediate: "#7dd3fc",
  Advanced: "#ffcc00",
};

const trackMeta = {
  Foundations: {
    blurb: "The why and how. Read these to actually understand testing.",
  },
  "Hands-on Skills": {
    blurb: "Write real tests in the browser and watch them go green.",
  },
};

const Learn = () => {
  const [completed, setCompleted] = useState(getCompleted());

  useEffect(() => {
    const refresh = () => setCompleted(getCompleted());
    window.addEventListener("jest-academy-progress", refresh);
    return () => window.removeEventListener("jest-academy-progress", refresh);
  }, []);

  const doneCount = lessons.filter((l) => completed[l.slug]).length;
  const percent = Math.round((doneCount / lessons.length) * 100);

  let globalIndex = 0;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <SchoolOutlinedIcon sx={{ fontSize: 34, color: "#2ee66e" }} />
        <Typography variant="h3">The Curriculum</Typography>
      </Stack>
      <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 680 }}>
        Start with <strong>Foundations</strong> to understand what testing is and
        why it matters, then roll up your sleeves in <strong>Hands-on Skills</strong>.
        Everything runs right here in your browser.
      </Typography>

      <Paper sx={{ p: 2.5, mb: 5, border: "1px solid rgba(46,230,110,0.15)" }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Your progress</Typography>
          <Typography sx={{ color: "#2ee66e", fontWeight: 700 }}>
            {doneCount} / {lessons.length} complete
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 5,
              background: "linear-gradient(90deg,#2ee66e,#2dd4bf)",
            },
          }}
        />
      </Paper>

      {TRACKS.map((track) => {
        const trackLessons = lessons.filter((l) => l.track === track);
        const meta = trackMeta[track] || {};
        const TrackIcon = trackIcons[track];
        return (
          <Box key={track} sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
              {TrackIcon && <TrackIcon sx={{ fontSize: 28, color: "#2dd4bf" }} />}
              <Typography variant="h4">{track}</Typography>
            </Stack>
            <Typography sx={{ color: "text.secondary", mb: 3 }}>{meta.blurb}</Typography>

            <Grid container spacing={3}>
              {trackLessons.map((lesson, i) => {
                const isDone = !!completed[lesson.slug];
                const num = ++globalIndex;
                const isReading = !lesson.exercise;
                const LessonIcon = getLessonIcon(lesson.slug);
                return (
                  <Grid item xs={12} sm={6} md={4} key={lesson.slug}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      style={{ height: "100%" }}
                    >
                      <Paper
                        component={Link}
                        to={`/learn/${lesson.slug}`}
                        sx={{
                          display: "block",
                          p: 3,
                          height: "100%",
                          textDecoration: "none",
                          border: "1px solid rgba(255,255,255,0.08)",
                          transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            borderColor: "rgba(46,230,110,0.5)",
                            boxShadow: "0 10px 30px rgba(46,230,110,0.12)",
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "linear-gradient(135deg, rgba(46,230,110,0.18), rgba(45,212,191,0.12))",
                              border: "1px solid rgba(46,230,110,0.25)",
                            }}
                          >
                            <LessonIcon sx={{ fontSize: 26, color: "#2ee66e" }} />
                          </Box>
                          {isDone && <CheckCircleIcon sx={{ color: "#4ade80" }} />}
                        </Stack>
                        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
                          {num}. {lesson.title}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}>
                          {lesson.summary}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                          <Chip
                            size="small"
                            label={lesson.level}
                            sx={{
                              color: levelColors[lesson.level] || "#2ee66e",
                              border: `1px solid ${levelColors[lesson.level] || "#2ee66e"}55`,
                              backgroundColor: "transparent",
                            }}
                          />
                          <Chip
                            size="small"
                            icon={
                              isReading ? (
                                <MenuBookIcon sx={{ fontSize: 14, color: "inherit !important" }} />
                              ) : undefined
                            }
                            label={isReading ? "Read" : "Exercise"}
                            sx={{ color: "text.secondary", backgroundColor: "rgba(255,255,255,0.05)" }}
                          />
                        </Stack>
                      </Paper>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Container>
  );
};

export default Learn;
