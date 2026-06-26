import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TerminalIcon from "@mui/icons-material/Terminal";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TestRunner from "../components/TestRunner";

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

const presets = {
  "Blank slate": `test("my first test", () => {
  expect(1 + 1).toBe(2);
});`,
  "Functions": `function fizzbuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

describe("fizzbuzz", () => {
  test("3 is Fizz", () => {
    expect(fizzbuzz(3)).toBe("Fizz");
  });
  test("5 is Buzz", () => {
    expect(fizzbuzz(5)).toBe("Buzz");
  });
  test("15 is FizzBuzz", () => {
    expect(fizzbuzz(15)).toBe("FizzBuzz");
  });
});`,
  "Async": `function fetchUser() {
  return Promise.resolve({ id: 1, name: "Jester" });
}

test("loads a user", async () => {
  const user = await fetchUser();
  expect(user).toEqual({ id: 1, name: "Jester" });
});`,
  "Mocking": `function processOrders(orders, charge) {
  orders.forEach((order) => charge(order.total));
}

test("charges every order", () => {
  const charge = jest.fn();
  processOrders([{ total: 10 }, { total: 25 }], charge);

  expect(charge).toHaveBeenCalledTimes(2);
  expect(charge).toHaveBeenCalledWith(25);
});`,
};

const cheatSheet = [
  { m: "toBe(value)", d: "Exact equality (primitives, same reference)" },
  { m: "toEqual(value)", d: "Deep equality for objects and arrays" },
  { m: "toBeTruthy() / toBeFalsy()", d: "Value is truthy / falsy" },
  { m: "toBeNull() / toBeUndefined() / toBeDefined()", d: "Presence checks" },
  { m: "toBeGreaterThan(n) / toBeLessThan(n)", d: "Number comparisons" },
  { m: "toBeCloseTo(n)", d: "Floating-point friendly comparison" },
  { m: "toContain(item)", d: "Array or string includes an item" },
  { m: "toHaveLength(n)", d: "Array/string length" },
  { m: "toHaveProperty(path, value?)", d: "Object has a (nested) key" },
  { m: "toMatch(regex|string)", d: "String matches a pattern" },
  { m: "toThrow(msg?)", d: "Function throws (wrap it: () => fn())" },
  { m: "toHaveBeenCalledWith(...args)", d: "Mock was called with args" },
  { m: ".not", d: "Negate any matcher, e.g. expect(x).not.toBe(y)" },
];

const Playground = () => {
  const [code, setCode] = useState(presets["Blank slate"]);
  const [runnerKey, setRunnerKey] = useState(0);

  const loadPreset = (name) => {
    setCode(presets[name]);
    setRunnerKey((k) => k + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <TerminalIcon sx={{ fontSize: 34, color: "#2ee66e" }} />
        <Typography variant="h3">The Playground</Typography>
      </Stack>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        A blank stage. Write any tests you like and run them. Load a preset to
        explore a pattern, or start from scratch.
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
        {Object.keys(presets).map((name) => (
          <Button
            key={name}
            size="small"
            variant="outlined"
            color="inherit"
            onClick={() => loadPreset(name)}
            sx={{ borderColor: "rgba(255,255,255,0.18)" }}
          >
            {name}
          </Button>
        ))}
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 }, border: "1px solid rgba(255,255,255,0.08)" }}>
            <TestRunner key={runnerKey} initialCode={code} minRows={14} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, border: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 88 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <FactCheckOutlinedIcon sx={{ color: "#2dd4bf" }} />
              <Typography variant="h6">Matcher cheat sheet</Typography>
            </Stack>
            <Stack spacing={1.25}>
              {cheatSheet.map((item) => (
                <Box key={item.m}>
                  <Box
                    component="code"
                    sx={{
                      display: "inline-block",
                      fontFamily: monoFont,
                      fontSize: 12.5,
                      color: "#5ef08f",
                    }}
                  >
                    {item.m}
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
                    {item.d}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Accordion
        sx={{
          mt: 4,
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#2ee66e" }} />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InfoOutlinedIcon sx={{ color: "#2ee66e", fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600 }}>
              What's actually running here?
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
            This playground runs a small, browser-native re-implementation of Jest's
            core API — <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>describe</Box>,{" "}
            <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>test</Box>,{" "}
            <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>expect</Box>, the lifecycle
            hooks, and <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>jest.fn()</Box>. The
            API matches real Jest, so what you learn here transfers directly. In a
            real project you'd run these from your terminal with{" "}
            <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>npm test</Box>.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default Playground;
