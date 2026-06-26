import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box, Stack, Button, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import lessons from "../lessons/lessons";
import { getCompleted } from "../lessons/progress";

const links = [
  { to: "/", label: "Home", icon: HomeRoundedIcon },
  { to: "/learn", label: "Learn", icon: SchoolRoundedIcon },
  { to: "/challenges", label: "Challenges", icon: EmojiEventsRoundedIcon },
  { to: "/playground", label: "Playground", icon: TerminalRoundedIcon },
  { to: "/dashboard", label: "Dashboard", icon: InsightsRoundedIcon },
];

const lessonSlugSet = new Set(lessons.map((l) => l.slug));
const countLessons = () =>
  Object.keys(getCompleted()).filter((k) => lessonSlugSet.has(k)).length;

const Navbar = () => {
  const location = useLocation();
  const total = lessons.length;
  const [done, setDone] = useState(countLessons);

  useEffect(() => {
    const update = () => setDone(countLessons());
    update();
    window.addEventListener("jest-academy-progress", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("jest-academy-progress", update);
      window.removeEventListener("storage", update);
    };
  }, [location.pathname]);

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(180deg, rgba(7,13,10,0.94) 0%, rgba(7,13,10,0.72) 100%)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid transparent",
        borderImage:
          "linear-gradient(90deg, transparent, rgba(46,230,110,0.55), rgba(45,212,191,0.55), rgba(125,211,252,0.4), transparent) 1",
      }}
    >
      {/* top neon hairline */}
      <Box
        sx={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #2ee66e, #2dd4bf, #7dd3fc, transparent)",
          opacity: 0.9,
        }}
      />
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", py: 0.75, gap: 1 }}>
        <Box
          component={Link}
          to="/"
          sx={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 1.4 }}
        >
          <motion.img
            src="/mascot.png"
            alt="Jest Carnival mascot"
            whileHover={{ scale: 1.12, rotate: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: 52,
              height: 52,
              objectFit: "contain",
              filter: "drop-shadow(0 0 12px rgba(46,230,110,0.6))",
            }}
          />
          <Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: { xs: 16, sm: 21 },
                lineHeight: 1,
                letterSpacing: "0.04em",
                background: "linear-gradient(90deg,#2ee66e,#2dd4bf 60%,#7dd3fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JEST CARNIVAL
            </Typography>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9.5,
                letterSpacing: "0.32em",
                color: "rgba(46,230,110,0.6)",
                mt: 0.4,
                display: { xs: "none", sm: "block" },
              }}
            >
              {"// LEARN.TO.TEST"}
            </Typography>
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={{ xs: 0.25, sm: 0.5 }}
          sx={{ ml: "auto" }}
          alignItems="center"
        >
          {links.map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Box
                key={link.to}
                component={Link}
                to={link.to}
                sx={{
                  position: "relative",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  px: { xs: 1, sm: 1.6 },
                  py: 1,
                  borderRadius: 999,
                  fontFamily: '"Chakra Petch", sans-serif',
                  fontWeight: active ? 700 : 500,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  color: active ? "#2ee66e" : "rgba(232,245,238,0.72)",
                  transition: "color 0.2s, background 0.2s",
                  "&:hover": { color: "#fff", background: "rgba(255,255,255,0.04)" },
                }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg, rgba(46,230,110,0.16), rgba(45,212,191,0.16))",
                      border: "1px solid rgba(46,230,110,0.4)",
                      boxShadow: "0 0 14px rgba(46,230,110,0.25)",
                    }}
                  />
                )}
                <Icon sx={{ fontSize: 18, position: "relative", zIndex: 1 }} />
                <Box
                  component="span"
                  sx={{ position: "relative", zIndex: 1, display: { xs: "none", sm: "inline" } }}
                >
                  {link.label}
                </Box>
              </Box>
            );
          })}

          <Tooltip title={`${done}/${total} lessons complete · view dashboard`} arrow>
            <Box
              component={Link}
              to="/dashboard"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.8,
                ml: 0.5,
                px: 1.3,
                py: 0.7,
                borderRadius: 999,
                textDecoration: "none",
                border: "1px solid rgba(45,212,191,0.3)",
                background: "rgba(45,212,191,0.06)",
              }}
            >
              <Box sx={{ position: "relative", width: 26, height: 26 }}>
                <svg width="26" height="26" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                  color: "#7fe7d3",
                  lineHeight: 1,
                }}
              >
                {pct}%
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Take the tour" arrow>
            <Box
              component="button"
              onClick={() => window.dispatchEvent(new Event("open-tour"))}
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(232,245,238,0.6)",
                ml: 0.3,
                p: 0.8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: "50%",
                transition: "color 0.2s, background 0.2s",
                "&:hover": { color: "#2ee66e", background: "rgba(255,255,255,0.05)" },
              }}
            >
              <HelpOutlineRoundedIcon sx={{ fontSize: 21 }} />
            </Box>
          </Tooltip>

          <Tooltip title="View source on GitHub" arrow>
            <Box
              component="a"
              href="https://github.com/ailynux/JestertheClown"
              target="_blank"
              rel="noreferrer"
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(232,245,238,0.6)",
                ml: 0.3,
                p: 0.8,
                borderRadius: "50%",
                transition: "color 0.2s, background 0.2s",
                "&:hover": { color: "#fff", background: "rgba(255,255,255,0.05)" },
              }}
            >
              <GitHubIcon sx={{ fontSize: 20 }} />
            </Box>
          </Tooltip>

          <Button
            component={Link}
            to="/playground"
            variant="contained"
            color="primary"
            startIcon={<RocketLaunchRoundedIcon />}
            sx={{
              ml: { xs: 0.5, sm: 1 },
              fontWeight: 700,
              fontFamily: '"Chakra Petch", sans-serif',
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Try it
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
