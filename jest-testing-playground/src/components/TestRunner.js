import React, { useState, useCallback } from "react";
import { Box, Button, Stack, Typography, CircularProgress, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { motion } from "framer-motion";
import CodeEditor from "./CodeEditor";
import TestResults from "./TestResults";
import { runTests } from "../engine/jestEngine";

// Reusable editor + runner + results panel. Used by lessons and the playground.
const TestRunner = ({ initialCode, solution, minRows = 8, onAllPass, onCodeChange, extraActions, appendCode }) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formatError, setFormatError] = useState(null);

  const updateCode = useCallback(
    (next) => {
      setCode(next);
      if (onCodeChange) onCodeChange(next);
    },
    [onCodeChange]
  );

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    // Yield a frame so the "running" state can paint before heavy work.
    await new Promise((r) => setTimeout(r, 120));
    const toRun = appendCode ? `${code}\n\n${appendCode}` : code;
    const output = await runTests(toRun);
    setResult(output);
    setRunning(false);
    if (output.ok && onAllPass) onAllPass();
  }, [code, onAllPass, appendCode]);

  const handleReset = () => {
    updateCode(initialCode);
    setResult(null);
  };

  const handleSolution = () => {
    if (solution) updateCode(solution);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleFormat = async () => {
    setFormatError(null);
    try {
      const prettier = await import("prettier/standalone");
      const babel = (await import("prettier/plugins/babel")).default;
      const estree = (await import("prettier/plugins/estree")).default;
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [babel, estree],
        semi: true,
        singleQuote: false,
      });
      updateCode(formatted.replace(/\n$/, ""));
    } catch (e) {
      setFormatError("Can't format — fix syntax errors first.");
      setTimeout(() => setFormatError(null), 2500);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!running) handleRun();
    }
  };

  return (
    <Box>
      <Box onKeyDown={handleKeyDown}>
        <CodeEditor value={code} onChange={updateCode} minRows={minRows} />
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2, mb: 2, flexWrap: "wrap", gap: 1 }} alignItems="center">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleRun}
            disabled={running}
            sx={{ fontWeight: 700 }}
          >
            {running ? "Running…" : "Run Tests"}
          </Button>
        </motion.div>
        <Box
          component="kbd"
          sx={{
            display: { xs: "none", sm: "inline-block" },
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            color: "rgba(232,245,238,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 1,
            px: 0.8,
            py: 0.3,
          }}
        >
          ⌘ / Ctrl + ↵
        </Box>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          Reset
        </Button>
        <Tooltip title="Format with Prettier">
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<AutoFixHighIcon />}
            onClick={handleFormat}
            sx={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Format
          </Button>
        </Tooltip>
        <Tooltip title={copied ? "Copied!" : "Copy code"}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={copied ? <CheckIcon sx={{ color: "#4ade80" }} /> : <ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </Tooltip>
        {extraActions}
        {solution && (
          <Button
            variant="text"
            startIcon={<LightbulbIcon />}
            onClick={handleSolution}
            sx={{ color: "#5ef08f", ml: "auto" }}
          >
            Show solution
          </Button>
        )}
      </Stack>

      {formatError && (
        <Typography sx={{ color: "#ffb84c", fontSize: 13, mb: 1 }}>{formatError}</Typography>
      )}

      {running && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <CircularProgress size={14} sx={{ color: "#2ee66e" }} />
          <Typography sx={{ color: "#2ee66e", fontSize: 14 }}>
            Running your tests…
          </Typography>
        </Stack>
      )}

      <TestResults result={result} />
    </Box>
  );
};

export default TestRunner;
