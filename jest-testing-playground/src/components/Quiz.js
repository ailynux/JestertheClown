import React, { useState } from "react";
import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { motion, AnimatePresence } from "framer-motion";

// A small, self-contained multiple-choice knowledge check.
const Quiz = ({ questions }) => {
  const [picks, setPicks] = useState({}); // index -> chosen option index

  if (!questions || questions.length === 0) return null;

  const choose = (qi, oi) => {
    if (picks[qi] !== undefined) return; // lock after first answer
    setPicks((p) => ({ ...p, [qi]: oi }));
  };

  const answered = Object.keys(picks).length;
  const correct = questions.filter((q, qi) => picks[qi] === q.answer).length;
  const allDone = answered === questions.length;

  return (
    <Paper
      sx={{
        mt: 4,
        p: { xs: 2, md: 3 },
        border: "1px solid rgba(125,211,252,0.25)",
        backgroundColor: "rgba(125,211,252,0.05)",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <QuizOutlinedIcon sx={{ color: "#7dd3fc" }} />
        <Typography variant="h6">Quick check</Typography>
        {allDone && (
          <Typography sx={{ ml: "auto", fontFamily: '"JetBrains Mono", monospace', color: "#7dd3fc", fontSize: 14 }}>
            {correct} / {questions.length}
          </Typography>
        )}
      </Stack>

      <Stack spacing={3}>
        {questions.map((q, qi) => {
          const chosen = picks[qi];
          const isAnswered = chosen !== undefined;
          return (
            <Box key={qi}>
              <Typography sx={{ fontWeight: 600, mb: 1.2, color: "#e8f5ee" }}>
                {qi + 1}. {q.q}
              </Typography>
              <Stack spacing={1}>
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.answer;
                  const isChosen = oi === chosen;
                  let borderColor = "rgba(255,255,255,0.12)";
                  let bg = "rgba(255,255,255,0.02)";
                  let icon = null;
                  if (isAnswered && isCorrect) {
                    borderColor = "#4ade80";
                    bg = "rgba(74,222,128,0.1)";
                    icon = <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 18 }} />;
                  } else if (isAnswered && isChosen && !isCorrect) {
                    borderColor = "#ff5470";
                    bg = "rgba(255,84,112,0.1)";
                    icon = <CancelIcon sx={{ color: "#ff5470", fontSize: 18 }} />;
                  }
                  return (
                    <Box
                      key={oi}
                      onClick={() => choose(qi, oi)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1.3,
                        borderRadius: 1.5,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: bg,
                        cursor: isAnswered ? "default" : "pointer",
                        transition: "border-color 0.15s, background 0.15s",
                        "&:hover": isAnswered
                          ? {}
                          : { borderColor: "rgba(125,211,252,0.5)", background: "rgba(125,211,252,0.06)" },
                      }}
                    >
                      <Typography sx={{ flex: 1, color: "text.secondary", fontSize: 15 }}>{opt}</Typography>
                      {icon}
                    </Box>
                  );
                })}
              </Stack>
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                  >
                    <Typography
                      sx={{
                        mt: 1.2,
                        fontSize: 14,
                        color: chosen === q.answer ? "#9ae6b4" : "#ffb3c0",
                        lineHeight: 1.6,
                      }}
                    >
                      {chosen === q.answer ? "Correct. " : "Not quite. "}
                      {q.explain}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          );
        })}
      </Stack>

      {allDone && (
        <Box sx={{ mt: 2.5, textAlign: "right" }}>
          <Button
            size="small"
            onClick={() => setPicks({})}
            sx={{ color: "rgba(232,245,238,0.6)" }}
          >
            Reset quiz
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Quiz;
