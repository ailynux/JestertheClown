import React, { useRef } from "react";
import { Box } from "@mui/material";

// A lightweight code editor: a monospace textarea with synced line numbers
// and tab-to-indent support. Deliberately dependency-free and fast.
const CodeEditor = ({ value, onChange, minRows = 8 }) => {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const lineCount = value.split("\n").length;
  const lines = Array.from({ length: Math.max(lineCount, minRows) }, (_, i) => i + 1);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = value.substring(0, start) + "  " + value.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const syncScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const sharedTextStyle = {
    fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
    fontSize: "14px",
    lineHeight: "22px",
    margin: 0,
  };

  return (
    <Box
      sx={{
        display: "flex",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundColor: "#11121c",
      }}
    >
      <Box
        ref={gutterRef}
        sx={{
          ...sharedTextStyle,
          py: 1.5,
          px: 1,
          textAlign: "right",
          color: "rgba(255,255,255,0.25)",
          userSelect: "none",
          overflow: "hidden",
          backgroundColor: "#0c0d14",
          minWidth: "44px",
        }}
      >
        {lines.map((n) => (
          <div key={n}>{n}</div>
        ))}
      </Box>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        wrap="off"
        style={{
          ...sharedTextStyle,
          flex: 1,
          minHeight: `${minRows * 22 + 24}px`,
          padding: "12px",
          color: "#e6e6f0",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "vertical",
          whiteSpace: "pre",
          overflowX: "auto",
          caretColor: "#2ee66e",
        }}
      />
    </Box>
  );
};

export default CodeEditor;
