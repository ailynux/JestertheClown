import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Box, TextField, Stack, Typography, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import lessons from "../lessons/lessons";
import challenges from "../challenges/challenges";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

// Build the searchable command index once.
function buildIndex() {
  const pages = [
    { kind: "Page", label: "Home", sub: "The landing page", to: "/", icon: HomeRoundedIcon },
    { kind: "Page", label: "Learn", sub: "All lessons", to: "/learn", icon: SchoolRoundedIcon },
    { kind: "Page", label: "Challenges", sub: "Reverse-TDD exercises", to: "/challenges", icon: EmojiEventsOutlinedIcon },
    { kind: "Page", label: "Playground", sub: "Free-form Jest sandbox", to: "/playground", icon: TerminalRoundedIcon },
    { kind: "Page", label: "Dashboard", sub: "Your progress & badges", to: "/dashboard", icon: InsightsRoundedIcon },
  ];
  const lessonItems = lessons.map((l) => ({
    kind: "Lesson",
    label: l.title,
    sub: l.summary,
    to: `/learn/${l.slug}`,
    icon: SchoolRoundedIcon,
    extra: l.track,
  }));
  const challengeItems = challenges.map((c) => ({
    kind: "Challenge",
    label: c.title,
    sub: c.blurb,
    to: `/challenges/${c.slug}`,
    icon: EmojiEventsOutlinedIcon,
    extra: c.difficulty,
  }));
  return [...pages, ...lessonItems, ...challengeItems];
}

const kindColor = {
  Page: "#7dd3fc",
  Lesson: "#2ee66e",
  Challenge: "#ffb84c",
};

const CommandPalette = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const index = useMemo(buildIndex, []);
  const listRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index;
    return index.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.sub && i.sub.toLowerCase().includes(q)) ||
        i.kind.toLowerCase().includes(q)
    );
  }, [query, index]);

  const go = (item) => {
    if (!item) return;
    setOpen(false);
    navigate(item.to);
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          position: "absolute",
          top: 80,
          m: 0,
          borderRadius: 3,
          border: "1px solid rgba(46,230,110,0.3)",
          backgroundColor: "rgba(12,13,20,0.98)",
          backdropFilter: "blur(12px)",
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <SearchIcon sx={{ color: "#2ee66e" }} />
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          placeholder="Search lessons, challenges, pages…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          InputProps={{ disableUnderline: true, sx: { fontSize: 17 } }}
        />
        <Box component="kbd" sx={{ fontFamily: monoFont, fontSize: 11, color: "rgba(232,245,238,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 1, px: 0.7, py: 0.2 }}>
          ESC
        </Box>
      </Stack>

      <Box ref={listRef} sx={{ maxHeight: 380, overflowY: "auto", py: 1 }}>
        {results.length === 0 && (
          <Typography sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            Nothing matches “{query}”.
          </Typography>
        )}
        {results.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === active;
          return (
            <Stack
              key={`${item.kind}-${item.to}`}
              direction="row"
              spacing={1.5}
              alignItems="center"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(item)}
              sx={{
                px: 2,
                py: 1.1,
                mx: 1,
                borderRadius: 1.5,
                cursor: "pointer",
                backgroundColor: isActive ? "rgba(46,230,110,0.12)" : "transparent",
              }}
            >
              <Icon sx={{ fontSize: 20, color: kindColor[item.kind] || "#2ee66e" }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, color: "#e8f5ee", fontWeight: 600 }}>{item.label}</Typography>
                {item.sub && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.sub}
                  </Typography>
                )}
              </Box>
              <Chip
                label={item.extra || item.kind}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10.5,
                  backgroundColor: `${kindColor[item.kind] || "#2ee66e"}1f`,
                  color: kindColor[item.kind] || "#2ee66e",
                }}
              />
            </Stack>
          );
        })}
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
