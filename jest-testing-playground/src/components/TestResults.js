import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { motion, AnimatePresence } from "framer-motion";

const monoFont = '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace';

const TestResults = ({ result }) => {
  if (!result) {
    return (
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px dashed rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.45)",
          fontFamily: monoFont,
          fontSize: 14,
        }}
      >
        <ScienceOutlinedIcon sx={{ color: "rgba(46,230,110,0.6)" }} />
        <span>
          Press <strong>Run Tests</strong> to see results here.
        </span>
      </Stack>
    );
  }

  if (result.compileError) {
    return (
      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: "1px solid #ff5470",
          backgroundColor: "rgba(255,84,112,0.08)",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <ErrorOutlineIcon sx={{ color: "#ff5470" }} />
          <Typography sx={{ color: "#ff5470", fontWeight: 700 }}>
            Your code couldn't run
          </Typography>
        </Stack>
        <Box
          component="pre"
          sx={{
            fontFamily: monoFont,
            fontSize: 13,
            color: "#ffb3c0",
            whiteSpace: "pre-wrap",
            m: 0,
          }}
        >
          {result.compileError}
        </Box>
      </Box>
    );
  }

  const { summary, results, logs, snapshots } = result;
  const allPassed = summary.failed === 0 && summary.total > 0;
  const logLevelColor = {
    log: "#a5b4fc",
    info: "#7dd3fc",
    warn: "#ffd166",
    error: "#ff8da1",
  };

  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Chip
          label={`${summary.passed} passed`}
          sx={{
            backgroundColor: "rgba(74,222,128,0.15)",
            color: "#4ade80",
            fontWeight: 700,
          }}
        />
        {summary.failed > 0 && (
          <Chip
            label={`${summary.failed} failed`}
            sx={{
              backgroundColor: "rgba(255,84,112,0.15)",
              color: "#ff5470",
              fontWeight: 700,
            }}
          />
        )}
        <Chip
          label={`${summary.total} total`}
          variant="outlined"
          sx={{ color: "rgba(255,255,255,0.6)", borderColor: "rgba(255,255,255,0.2)" }}
        />
        {snapshots && snapshots.written > 0 && (
          <Chip
            label={`${snapshots.written} snapshot${snapshots.written > 1 ? "s" : ""} written`}
            sx={{ backgroundColor: "rgba(167,139,250,0.15)", color: "#c4b5fd", fontWeight: 700 }}
          />
        )}
        {allPassed && (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ display: "inline-flex" }}
          >
            <CelebrationIcon sx={{ color: "#2ee66e", fontSize: 24 }} />
          </motion.div>
        )}
      </Stack>

      <Stack spacing={1}>
        <AnimatePresence>
          {results.map((r, i) => {
            const passed = r.status === "passed";
            const fullName = [...r.path, r.name].join(" › ");
            return (
              <motion.div
                key={`${fullName}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    borderLeft: `3px solid ${passed ? "#4ade80" : "#ff5470"}`,
                    backgroundColor: passed
                      ? "rgba(74,222,128,0.06)"
                      : "rgba(255,84,112,0.06)",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {passed ? (
                      <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 20 }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ff5470", fontSize: 20 }} />
                    )}
                    <Typography sx={{ fontFamily: monoFont, fontSize: 14, color: "#e6e6f0", flex: 1 }}>
                      {fullName}
                    </Typography>
                    {typeof r.duration === "number" && (
                      <Typography sx={{ fontFamily: monoFont, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                        {r.duration < 1 ? "<1" : Math.round(r.duration)} ms
                      </Typography>
                    )}
                  </Stack>
                  {!passed && r.message && (
                    <Box
                      component="pre"
                      sx={{
                        mt: 1,
                        mb: 0,
                        ml: 3.5,
                        fontFamily: monoFont,
                        fontSize: 12.5,
                        color: "#ffb3c0",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {r.message}
                    </Box>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Stack>

      {logs && logs.length > 0 && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1.5,
            backgroundColor: "#0c0d14",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.4)", mb: 0.5, letterSpacing: 1 }}>
            CONSOLE · {logs.length}
          </Typography>
          {logs.map((line, i) => {
            const level = typeof line === "string" ? "log" : line.level;
            const text = typeof line === "string" ? line : line.text;
            return (
              <Stack key={i} direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.1 }}>
                <Box
                  component="span"
                  sx={{
                    fontFamily: monoFont,
                    fontSize: 10,
                    lineHeight: "20px",
                    color: logLevelColor[level] || "#a5b4fc",
                    opacity: 0.6,
                    minWidth: 38,
                    textTransform: "uppercase",
                  }}
                >
                  {level}
                </Box>
                <Box
                  component="pre"
                  sx={{ m: 0, fontFamily: monoFont, fontSize: 12.5, color: logLevelColor[level] || "#a5b4fc", whiteSpace: "pre-wrap", flex: 1 }}
                >
                  {text}
                </Box>
              </Stack>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TestResults;
