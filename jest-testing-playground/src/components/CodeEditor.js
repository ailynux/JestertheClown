import React from "react";
import { Box } from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

const fontStack =
  '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace';

// Syntax-highlighted code editor (Prism + react-simple-code-editor) with
// tab-to-indent. Keeps the same value/onChange API as before.
const CodeEditor = ({ value, onChange, minRows = 8 }) => {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "auto",
        border: "1px solid rgba(46,230,110,0.18)",
        backgroundColor: "#0c1410",
        "& textarea": { outline: "none", caretColor: "#2ee66e" },
        "& textarea::placeholder": { color: "rgba(255,255,255,0.3)" },
      }}
    >
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages.javascript, "javascript")}
        padding={14}
        tabSize={2}
        insertSpaces
        style={{
          fontFamily: fontStack,
          fontSize: 14,
          lineHeight: 1.6,
          minHeight: minRows * 22 + 28,
          color: "#e6f0ea",
        }}
      />
    </Box>
  );
};

export default CodeEditor;
