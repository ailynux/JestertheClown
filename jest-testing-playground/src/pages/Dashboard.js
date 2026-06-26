import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Box,
  Button,
  LinearProgress,
  TextField,
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";
import lessons, { TRACKS } from "../lessons/lessons";
import challenges from "../challenges/challenges";
import { getCompleted, getStreak, recordVisit } from "../lessons/progress";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';
const CERT_NAME_KEY = "jest-carnival-cert-name";

const Eyebrow = ({ children, color = "rgba(46,230,110,0.7)" }) => (
  <Typography
    sx={{
      fontFamily: monoFont,
      fontSize: 12,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
      mb: 1.2,
    }}
  >
    {children}
  </Typography>
);

const StatCard = ({ icon, value, label, color }) => (
  <Paper sx={{ p: 2.5, height: "100%", border: "1px solid rgba(255,255,255,0.08)" }}>
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `${color}1f`,
          border: `1px solid ${color}55`,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: monoFont, fontSize: 26, fontWeight: 700, lineHeight: 1, color }}>
          {value}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 13, mt: 0.5 }}>{label}</Typography>
      </Box>
    </Stack>
  </Paper>
);

const TrackBar = ({ label, done, total, color }) => {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.6 }}>
        <Typography sx={{ fontSize: 14, color: "#e8f5ee", fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", fontFamily: monoFont }}>
          {done}/{total}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 999 },
        }}
      />
    </Box>
  );
};

const Dashboard = () => {
  const [completed, setCompleted] = useState(getCompleted());
  const [streak, setStreak] = useState(getStreak());
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(CERT_NAME_KEY) || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    setStreak(recordVisit());
    const update = () => setCompleted(getCompleted());
    window.addEventListener("jest-academy-progress", update);
    return () => window.removeEventListener("jest-academy-progress", update);
  }, []);

  const lessonSlugs = lessons.map((l) => l.slug);
  const lessonsDone = lessonSlugs.filter((s) => completed[s]).length;
  const challengesDone = challenges.filter((c) => completed[`challenge:${c.slug}`]).length;

  const trackStats = TRACKS.map((track) => {
    const inTrack = lessons.filter((l) => l.track === track);
    return {
      track,
      total: inTrack.length,
      done: inTrack.filter((l) => completed[l.slug]).length,
    };
  });

  const totalItems = lessons.length + challenges.length;
  const totalDone = lessonsDone + challengesDone;
  const overallPct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
  const allLessonsDone = lessonsDone === lessons.length && lessons.length > 0;
  const everythingDone = totalDone === totalItems && totalItems > 0;

  const badges = [
    { id: "first-step", label: "First Step", desc: "Complete your first lesson", earned: lessonsDone >= 1, color: "#2ee66e" },
    { id: "foundations", label: "Theory Buff", desc: "Finish the Foundations track", earned: trackStats.find((t) => t.track === "Foundations")?.done === trackStats.find((t) => t.track === "Foundations")?.total && (trackStats.find((t) => t.track === "Foundations")?.total || 0) > 0, color: "#7dd3fc" },
    { id: "skills", label: "Skill Builder", desc: "Finish all hands-on lessons", earned: trackStats.find((t) => t.track === "Hands-on Skills")?.done === trackStats.find((t) => t.track === "Hands-on Skills")?.total && (trackStats.find((t) => t.track === "Hands-on Skills")?.total || 0) > 0, color: "#2dd4bf" },
    { id: "challenger", label: "Challenger", desc: "Solve your first challenge", earned: challengesDone >= 1, color: "#ffb84c" },
    { id: "warrior", label: "Code Warrior", desc: "Solve every challenge", earned: challengesDone === challenges.length && challenges.length > 0, color: "#ff8da1" },
    { id: "ringmaster", label: "Ringmaster", desc: "Complete absolutely everything", earned: everythingDone, color: "#c4b5fd" },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  const updateName = (v) => {
    setName(v);
    try {
      localStorage.setItem(CERT_NAME_KEY, v);
    } catch {
      /* ignore */
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Eyebrow>{"// Your progress"}</Eyebrow>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <SchoolRoundedIcon sx={{ fontSize: 34, color: "#2ee66e" }} />
        <Typography variant="h3">Dashboard</Typography>
      </Stack>
      <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 720 }}>
        Track everything you've conquered in the carnival — lessons, challenges, badges, and your daily streak.
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <StatCard icon={<SchoolRoundedIcon sx={{ color: "#2ee66e" }} />} value={`${lessonsDone}/${lessons.length}`} label="Lessons done" color="#2ee66e" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<EmojiEventsOutlinedIcon sx={{ color: "#ffb84c" }} />} value={`${challengesDone}/${challenges.length}`} label="Challenges solved" color="#ffb84c" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<LocalFireDepartmentIcon sx={{ color: "#ff8da1" }} />} value={streak.current || 0} label={`Day streak (best ${streak.best || 0})`} color="#ff8da1" />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard icon={<MilitaryTechIcon sx={{ color: "#c4b5fd" }} />} value={`${earnedCount}/${badges.length}`} label="Badges earned" color="#c4b5fd" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Typography variant="h6">Overall completion</Typography>
              <Typography sx={{ fontFamily: monoFont, fontWeight: 700, color: "#2ee66e" }}>{overallPct}%</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={overallPct}
              sx={{
                height: 12,
                borderRadius: 999,
                mb: 3,
                backgroundColor: "rgba(255,255,255,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#2ee66e,#2dd4bf,#7dd3fc)",
                },
              }}
            />
            {trackStats.map((t) => (
              <TrackBar key={t.track} label={t.track} done={t.done} total={t.total} color="#2dd4bf" />
            ))}
            <TrackBar label="Challenges" done={challengesDone} total={challenges.length} color="#ffb84c" />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>
              Badges
            </Typography>
            <Grid container spacing={1.5}>
              {badges.map((b) => (
                <Grid item xs={6} key={b.id}>
                  <motion.div whileHover={{ scale: b.earned ? 1.03 : 1 }}>
                    <Box
                      sx={{
                        p: 1.8,
                        height: "100%",
                        borderRadius: 2,
                        border: `1px solid ${b.earned ? `${b.color}66` : "rgba(255,255,255,0.08)"}`,
                        background: b.earned ? `${b.color}14` : "rgba(255,255,255,0.02)",
                        opacity: b.earned ? 1 : 0.55,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        {b.earned ? (
                          <MilitaryTechIcon sx={{ color: b.color, fontSize: 20 }} />
                        ) : (
                          <LockOutlinedIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 18 }} />
                        )}
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: b.earned ? "#e8f5ee" : "text.secondary" }}>
                          {b.label}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.4 }}>{b.desc}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Certificate */}
      <Box sx={{ mt: 5 }}>
        <Eyebrow color="rgba(196,181,253,0.8)">{"// Certificate"}</Eyebrow>
        {allLessonsDone ? (
          <Paper
            className="certificate"
            sx={{
              p: { xs: 3, md: 5 },
              textAlign: "center",
              border: "2px solid rgba(196,181,253,0.4)",
              background: "linear-gradient(135deg, rgba(196,181,253,0.08), rgba(45,212,191,0.06))",
            }}
          >
            <WorkspacePremiumIcon sx={{ fontSize: 56, color: "#c4b5fd", mb: 1 }} />
            <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontSize: 14, letterSpacing: "0.3em", color: "#c4b5fd", mb: 1 }}>
              CERTIFICATE OF COMPLETION
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>This certifies that</Typography>
            <TextField
              variant="standard"
              placeholder="your name"
              value={name}
              onChange={(e) => updateName(e.target.value)}
              inputProps={{ style: { textAlign: "center" } }}
              sx={{
                mb: 2,
                "& input": {
                  fontFamily: '"Chakra Petch", sans-serif',
                  fontSize: 30,
                  color: "#e8f5ee",
                  fontWeight: 700,
                },
                "& .MuiInput-underline:before": { borderColor: "rgba(196,181,253,0.4)" },
              }}
            />
            <Typography sx={{ color: "text.secondary", maxWidth: 520, mx: "auto", lineHeight: 1.7 }}>
              has completed every lesson at the Jest Carnival and now writes tests that bring joy to the circus of code.
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: monoFont, fontSize: 13, color: "text.secondary" }}>
              {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              {everythingDone ? " · Ringmaster status achieved" : ""}
            </Typography>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => window.print()}
              sx={{ mt: 3, borderColor: "rgba(196,181,253,0.5)", color: "#c4b5fd" }}
            >
              Print / Save as PDF
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center", border: "1px dashed rgba(196,181,253,0.3)" }}>
            <WorkspacePremiumIcon sx={{ fontSize: 44, color: "rgba(196,181,253,0.5)", mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Your certificate is waiting
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2.5 }}>
              Finish all {lessons.length} lessons to unlock your Jest Carnival certificate.
              You're {lessonsDone}/{lessons.length} of the way there.
            </Typography>
            <Button component={Link} to="/learn" variant="contained" color="primary" sx={{ fontWeight: 700 }}>
              Keep learning
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
