import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Box, Typography, Stack, Button, IconButton, LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";

const TOUR_KEY = "jest-carnival-tour-seen-v1";

const steps = [
  {
    icon: CelebrationIcon,
    color: "#2ee66e",
    title: "Welcome to the Jest Carnival",
    body: "A hands-on playground for actually learning testing — not just reading about it. Every example runs live in your browser with a real Jest-style engine. Here's the 20-second tour.",
    cta: null,
  },
  {
    icon: SchoolRoundedIcon,
    color: "#2ee66e",
    title: "Learn, lesson by lesson",
    body: "Two tracks: the Foundations (why & how testing works) and Hands-on Skills (write real tests). Each lesson ends with an editor you run yourself, plus quick quizzes to lock it in.",
    cta: { label: "Open Learn", to: "/learn" },
  },
  {
    icon: TerminalRoundedIcon,
    color: "#2dd4bf",
    title: "Experiment in the Playground",
    body: "A blank stage with 30+ presets — matchers, mocks, async, fake timers, snapshots, even module mocking. Your code auto-saves and you can share it with a link.",
    cta: { label: "Open Playground", to: "/playground" },
  },
  {
    icon: EmojiEventsRoundedIcon,
    color: "#ffb84c",
    title: "Prove it with Challenges",
    body: "Reverse TDD: the tests are written for you, and your job is to write the code that makes them pass. The most fun way to build real testing instincts.",
    cta: { label: "Open Challenges", to: "/challenges" },
  },
  {
    icon: InsightsRoundedIcon,
    color: "#c4b5fd",
    title: "Track your progress",
    body: "Your Dashboard shows completion, a daily streak, unlockable badges, and a printable certificate once you finish every lesson.",
    cta: { label: "Open Dashboard", to: "/dashboard" },
  },
  {
    icon: KeyboardCommandKeyIcon,
    color: "#7dd3fc",
    title: "One shortcut to rule them all",
    body: "Press ⌘K (or Ctrl+K) anywhere to instantly jump to any lesson, challenge, or page. That's it — go break some code and watch the tests catch it.",
    cta: null,
  },
];

const WelcomeTour = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(TOUR_KEY) === "true";
    } catch {
      seen = false;
    }
    if (!seen) setOpen(true);

    const openTour = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("open-tour", openTour);
    return () => window.removeEventListener("open-tour", openTour);
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(TOUR_KEY, "true");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const goTo = (to) => {
    finish();
    navigate(to);
  };

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={finish}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(46,230,110,0.3)",
          backgroundColor: "rgba(12,13,20,0.99)",
          backgroundImage:
            "radial-gradient(120% 80% at 50% 0%, rgba(46,230,110,0.12), transparent 60%)",
        },
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 4,
          backgroundColor: "rgba(255,255,255,0.06)",
          "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#2ee66e,#2dd4bf,#7dd3fc)" },
        }}
      />
      <IconButton
        onClick={finish}
        size="small"
        sx={{ position: "absolute", top: 10, right: 10, color: "rgba(232,245,238,0.5)", zIndex: 2 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
        <Stack alignItems="center" spacing={1.5}>
          <motion.img
            src="/mascot.png"
            alt="Jest Carnival mascot"
            initial={{ scale: 0.8, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ width: 84, height: 84, objectFit: "contain", filter: "drop-shadow(0 0 16px rgba(46,230,110,0.5))" }}
          />
        </Stack>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                mx: "auto",
                mt: 2,
                mb: 1.5,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${current.color}1f`,
                border: `1px solid ${current.color}55`,
              }}
            >
              <Icon sx={{ fontSize: 28, color: current.color }} />
            </Box>
            <Typography variant="h5" sx={{ mb: 1.2 }}>
              {current.title}
            </Typography>
            <Typography sx={{ color: "text.secondary", lineHeight: 1.7, minHeight: 88 }}>
              {current.body}
            </Typography>
            {current.cta && (
              <Button
                onClick={() => goTo(current.cta.to)}
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 1.5, color: current.color, fontWeight: 700 }}
              >
                {current.cta.label}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* dots */}
        <Stack direction="row" spacing={0.8} justifyContent="center" sx={{ mt: 2.5, mb: 2.5 }}>
          {steps.map((_, i) => (
            <Box
              key={i}
              onClick={() => setStep(i)}
              sx={{
                width: i === step ? 22 : 8,
                height: 8,
                borderRadius: 999,
                cursor: "pointer",
                transition: "all 0.25s",
                backgroundColor: i === step ? "#2ee66e" : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={1.5} justifyContent="center">
          {step > 0 && (
            <Button
              onClick={() => setStep((s) => s - 1)}
              startIcon={<ArrowBackIcon />}
              color="inherit"
              sx={{ color: "rgba(232,245,238,0.6)" }}
            >
              Back
            </Button>
          )}
          {isLast ? (
            <Button onClick={finish} variant="contained" color="primary" sx={{ fontWeight: 700, px: 3 }}>
              Let's go
            </Button>
          ) : (
            <Button
              onClick={() => setStep((s) => s + 1)}
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 700, px: 3 }}
            >
              Next
            </Button>
          )}
        </Stack>

        {step === 0 && (
          <Button onClick={finish} size="small" sx={{ mt: 1.5, color: "rgba(232,245,238,0.4)" }}>
            Skip tour
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default WelcomeTour;
