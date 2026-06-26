import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TerminalIcon from "@mui/icons-material/Terminal";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { motion } from "framer-motion";
import lessons, { getLesson, getLessonIndex } from "../lessons/lessons";
import { getLessonIcon } from "../lessons/lessonIcons";
import { markCompleted, isCompleted } from "../lessons/progress";
import TestRunner from "../components/TestRunner";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

// Renders `inline code` segments inside a paragraph.
function InlineText({ text }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <Box
            key={i}
            component="code"
            sx={{
              fontFamily: monoFont,
              fontSize: "0.88em",
              px: 0.7,
              py: 0.2,
              borderRadius: 1,
              backgroundColor: "rgba(46,230,110,0.12)",
              color: "#5ef08f",
            }}
          >
            {part.slice(1, -1)}
          </Box>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "heading":
      return (
        <Typography variant="h5" sx={{ mt: 4, mb: 1.5 }}>
          {block.text}
        </Typography>
      );
    case "paragraph":
      return (
        <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 2, fontSize: 16 }}>
          <InlineText text={block.text} />
        </Typography>
      );
    case "code":
      return (
        <Box
          component="pre"
          sx={{
            fontFamily: monoFont,
            fontSize: 13.5,
            lineHeight: 1.7,
            p: 2,
            my: 2,
            borderRadius: 2,
            backgroundColor: "#11121c",
            border: "1px solid rgba(255,255,255,0.1)",
            overflowX: "auto",
            color: "#e6e6f0",
          }}
        >
          {block.code}
        </Box>
      );
    case "list":
      return (
        <Stack component="ul" spacing={1} sx={{ pl: 0, my: 2, listStyle: "none" }}>
          {block.items.map((item, i) => (
            <Stack
              key={i}
              component="li"
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  mt: "9px",
                  flexShrink: 0,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#2ee66e,#2dd4bf)",
                }}
              />
              <Typography sx={{ color: "text.secondary", lineHeight: 1.7, fontSize: 16 }}>
                <InlineText text={item} />
              </Typography>
            </Stack>
          ))}
        </Stack>
      );
    case "tip":
      return (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            p: 2,
            my: 2,
            borderRadius: 2,
            backgroundColor: "rgba(46,230,110,0.08)",
            borderLeft: "3px solid #2ee66e",
          }}
        >
          <LightbulbIcon sx={{ color: "#2ee66e" }} />
          <Typography sx={{ color: "#cdeedd" }}>
            <InlineText text={block.text} />
          </Typography>
        </Stack>
      );
    default:
      return null;
  }
}

const LessonDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lesson = getLesson(slug);
  const index = getLessonIndex(slug);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(slug));
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!lesson) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <SearchOffIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Lesson not found
        </Typography>
        <Button component={Link} to="/learn" variant="contained">
          Back to lessons
        </Button>
      </Container>
    );
  }

  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const LessonIcon = getLessonIcon(slug);
  const PrevIcon = prev ? getLessonIcon(prev.slug) : null;
  const NextIcon = next ? getLessonIcon(next.slug) : null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button
        component={Link}
        to="/learn"
        startIcon={<ArrowBackIcon />}
        sx={{ color: "text.secondary", mb: 2 }}
      >
        All lessons
      </Button>

      <motion.div
        key={slug}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
          <Chip size="small" label={lesson.track} sx={{ backgroundColor: "rgba(46,230,110,0.15)", color: "#2ee66e", fontWeight: 600 }} />
          <Chip size="small" label={lesson.level} sx={{ backgroundColor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
          <Chip size="small" label={lesson.duration} sx={{ backgroundColor: "rgba(255,255,255,0.05)", color: "text.secondary" }} />
          {done && (
            <Chip
              size="small"
              icon={<CheckCircleIcon sx={{ color: "#4ade80 !important" }} />}
              label="Complete"
              sx={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80" }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, rgba(46,230,110,0.2), rgba(45,212,191,0.12))",
              border: "1px solid rgba(46,230,110,0.3)",
            }}
          >
            <LessonIcon sx={{ fontSize: 28, color: "#2ee66e" }} />
          </Box>
          <Typography variant="h3">{lesson.title}</Typography>
        </Stack>

        {lesson.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        <Divider sx={{ my: 4, borderColor: "rgba(46,230,110,0.12)" }} />

        {lesson.exercise ? (
          <Paper sx={{ p: { xs: 2, md: 3 }, border: "1px solid rgba(46,230,110,0.3)" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <TerminalIcon sx={{ color: "#2ee66e" }} />
              <Typography variant="h5">Your turn</Typography>
            </Stack>
            <Typography sx={{ color: "text.secondary", mb: 2.5 }}>
              <InlineText text={lesson.exercise.instructions} />
            </Typography>
            <TestRunner
              key={slug}
              initialCode={lesson.exercise.starterCode}
              solution={lesson.solution}
              minRows={9}
              onAllPass={() => {
                markCompleted(slug);
                setDone(true);
              }}
            />
          </Paper>
        ) : (
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              border: "1px solid rgba(46,230,110,0.25)",
              textAlign: "center",
            }}
          >
            <MenuBookIcon sx={{ fontSize: 36, color: "#2ee66e", mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {done ? "Nice — you've got this one." : "Finished reading?"}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2.5 }}>
              {done
                ? "Marked complete. Carry on to the next lesson whenever you're ready."
                : "Mark this lesson complete to track your progress through the carnival."}
            </Typography>
            <Button
              variant={done ? "outlined" : "contained"}
              color={done ? "inherit" : "primary"}
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                markCompleted(slug);
                setDone(true);
              }}
              sx={done ? { borderColor: "rgba(255,255,255,0.2)" } : { fontWeight: 700 }}
            >
              {done ? "Completed" : "Mark as complete"}
            </Button>
          </Paper>
        )}
      </motion.div>

      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mt: 5 }}
      >
        <Box sx={{ flex: 1 }}>
          {prev && (
            <Button
              fullWidth
              onClick={() => navigate(`/learn/${prev.slug}`)}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "rgba(46,230,110,0.2)", justifyContent: "flex-start", py: 1.5 }}
            >
              {PrevIcon && <PrevIcon sx={{ fontSize: 18, mr: 0.8 }} />}
              {prev.title}
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {next && (
            <Button
              fullWidth
              onClick={() => navigate(`/learn/${next.slug}`)}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              color="primary"
              sx={{ justifyContent: "flex-end", py: 1.5, fontWeight: 700 }}
            >
              {NextIcon && <NextIcon sx={{ fontSize: 18, mr: 0.8 }} />}
              {next.title}
            </Button>
          )}
        </Box>
      </Stack>
    </Container>
  );
};

export default LessonDetail;
