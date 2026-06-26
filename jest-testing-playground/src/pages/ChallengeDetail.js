import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import { motion } from "framer-motion";
import challenges, { DIFFICULTY_COLORS } from "../challenges/challenges";
import { markCompleted, isCompleted } from "../lessons/progress";
import TestRunner from "../components/TestRunner";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

const ChallengeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const index = challenges.findIndex((c) => c.slug === slug);
  const challenge = challenges[index];
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (challenge) setDone(isCompleted(`challenge:${challenge.slug}`));
    setRevealed(0);
    window.scrollTo({ top: 0 });
  }, [slug, challenge]);

  if (!challenge) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <SearchOffIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Challenge not found
        </Typography>
        <Button component={Link} to="/challenges" variant="contained">
          Back to challenges
        </Button>
      </Container>
    );
  }

  const color = DIFFICULTY_COLORS[challenge.difficulty] || "#2ee66e";
  const prev = index > 0 ? challenges[index - 1] : null;
  const next = index < challenges.length - 1 ? challenges[index + 1] : null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button
        component={Link}
        to="/challenges"
        startIcon={<ArrowBackIcon />}
        sx={{ color: "text.secondary", mb: 2 }}
      >
        All challenges
      </Button>

      <motion.div key={slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip label={challenge.difficulty} size="small" sx={{ backgroundColor: `${color}22`, color, fontWeight: 700 }} />
          <Chip label={`${challenge.minutes} min`} size="small" sx={{ backgroundColor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
          {done && (
            <Chip
              size="small"
              icon={<CheckCircleIcon sx={{ color: "#4ade80 !important" }} />}
              label="Solved"
              sx={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80" }}
            />
          )}
        </Stack>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {challenge.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", lineHeight: 1.8, fontSize: 16, mb: 3 }}>
          {challenge.brief}
        </Typography>

        {/* The spec you must satisfy */}
        <Paper sx={{ p: 0, mb: 3, border: "1px solid rgba(125,211,252,0.25)", overflow: "hidden" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ px: 2, py: 1.2, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(125,211,252,0.06)" }}
          >
            <ScienceOutlinedIcon sx={{ color: "#7dd3fc", fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600, color: "#bae6fd" }}>The tests you must pass</Typography>
            <Typography sx={{ ml: "auto", fontSize: 12, color: "text.secondary", fontFamily: monoFont }}>
              read-only
            </Typography>
          </Stack>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              fontFamily: monoFont,
              fontSize: 13,
              lineHeight: 1.7,
              color: "#cbd5e1",
              overflowX: "auto",
              backgroundColor: "#0c0d14",
            }}
          >
            {challenge.tests}
          </Box>
        </Paper>

        {/* Hints, revealed one at a time */}
        {challenge.hints && challenge.hints.length > 0 && (
          <Accordion
            sx={{
              mb: 3,
              backgroundColor: "rgba(255,184,76,0.05)",
              border: "1px solid rgba(255,184,76,0.2)",
              borderRadius: "12px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#ffb84c" }} />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TipsAndUpdatesOutlinedIcon sx={{ color: "#ffb84c", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 600 }}>Stuck? Reveal hints</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                {challenge.hints.slice(0, revealed).map((h, i) => (
                  <Typography key={i} sx={{ color: "#f0dcc0", lineHeight: 1.6, fontSize: 15 }}>
                    <strong>Hint {i + 1}:</strong> {h}
                  </Typography>
                ))}
                {revealed < challenge.hints.length && (
                  <Button
                    onClick={() => setRevealed((r) => r + 1)}
                    sx={{ alignSelf: "flex-start", color: "#ffb84c" }}
                  >
                    {revealed === 0 ? "Show a hint" : "Show another hint"}
                  </Button>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Your implementation */}
        <Paper sx={{ p: { xs: 2, md: 3 }, border: `1px solid ${color}55` }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Your implementation
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: 2.5, fontSize: 15 }}>
            Write the function below. When you run, the tests above are added automatically — make them all green.
          </Typography>
          <TestRunner
            key={slug}
            initialCode={challenge.starterCode}
            appendCode={challenge.tests}
            solution={challenge.solution}
            minRows={10}
            onAllPass={() => {
              markCompleted(`challenge:${challenge.slug}`);
              setDone(true);
            }}
          />
          {done && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
              <CheckCircleIcon sx={{ color: "#4ade80" }} />
              <Typography sx={{ color: "#4ade80", fontWeight: 600 }}>
                Solved! Every test passes. {next ? "On to the next one?" : "You've cleared them all."}
              </Typography>
            </Stack>
          )}
        </Paper>
      </motion.div>

      <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 5 }}>
        <Box sx={{ flex: 1 }}>
          {prev && (
            <Button
              fullWidth
              onClick={() => navigate(`/challenges/${prev.slug}`)}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "rgba(255,255,255,0.2)", justifyContent: "flex-start", py: 1.5 }}
            >
              {prev.title}
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {next && (
            <Button
              fullWidth
              onClick={() => navigate(`/challenges/${next.slug}`)}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              color="primary"
              sx={{ justifyContent: "flex-end", py: 1.5, fontWeight: 700 }}
            >
              {next.title}
            </Button>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default ChallengeDetail;
