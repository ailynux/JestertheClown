import React, { useState, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Box,
  Grid,
  Chip,
  Tooltip,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TerminalIcon from "@mui/icons-material/Terminal";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import TestRunner from "../components/TestRunner";
import { clearSnapshots } from "../engine/jestEngine";

const AUTOSAVE_KEY = "jest-carnival-playground-code";

// Share links keep the code in the URL hash as base64 (unicode-safe).
function encodeCode(code) {
  try {
    return btoa(unescape(encodeURIComponent(code)));
  } catch {
    return "";
  }
}
function decodeCode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return null;
  }
}
function readInitialCode(fallback) {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("code");
  if (shared) {
    const decoded = decodeCode(shared);
    if (decoded) return { code: decoded, source: "shared" };
  }
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) return { code: saved, source: "saved" };
  } catch {
    /* ignore */
  }
  return { code: fallback, source: "default" };
}

const monoFont = '"JetBrains Mono", Menlo, Monaco, Consolas, monospace';

const presets = [
  // ---------------- Basics ----------------
  {
    name: "Blank",
    group: "Basics",
    code: `test("my first test", () => {
  expect(1 + 1).toBe(2);
});`,
  },
  {
    name: "Numbers",
    group: "Basics",
    code: `test("number matchers", () => {
  expect(10).toBeGreaterThan(9);
  expect(10).toBeGreaterThanOrEqual(10);
  expect(3).toBeLessThan(5);

  // floating point: never use toBe for decimals
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});`,
  },
  {
    name: "Strings",
    group: "Basics",
    code: `test("string matchers", () => {
  const slug = "jest-carnival";

  expect("Jester the Clown").toMatch("Clown");   // substring
  expect("HELLO").toMatch(/hello/i);              // case-insensitive regex
  expect(slug).toMatch(/^[a-z-]+$/);              // anchored pattern
  expect(slug).toHaveLength(13);
});`,
  },
  {
    name: "Arrays",
    group: "Basics",
    code: `test("array matchers", () => {
  const acts = ["acrobat", "juggler", "clown"];

  expect(acts).toContain("juggler");
  expect(acts).toHaveLength(3);
  expect(acts).not.toContain("lion");

  // arrays of objects need toContainEqual (deep match)
  const users = [{ id: 1 }, { id: 2 }];
  expect(users).toContainEqual({ id: 2 });
});`,
  },
  {
    name: "Objects",
    group: "Basics",
    code: `test("object matchers", () => {
  const show = { name: "Carnival", tickets: { sold: 42 } };

  expect(show).toHaveProperty("name", "Carnival");
  expect(show).toHaveProperty("tickets.sold", 42);

  // assert only the fields you care about
  expect(show).toMatchObject({ name: "Carnival" });
});`,
  },
  {
    name: "Truthiness",
    group: "Basics",
    code: `test("truthiness matchers", () => {
  expect(null).toBeNull();
  expect(undefined).toBeUndefined();
  expect("ready").toBeDefined();
  expect("non-empty").toBeTruthy();
  expect(0).toBeFalsy();
  expect("").toBeFalsy();

  // [] and {} are TRUTHY — a classic gotcha
  expect([]).toBeTruthy();
});`,
  },

  // ---------------- Matchers ----------------
  {
    name: "toBe vs toEqual",
    group: "Matchers",
    code: `test("primitives use toBe", () => {
  expect(2 + 2).toBe(4);
});

test("objects use toEqual", () => {
  const a = { name: "Jester" };
  const b = { name: "Jester" };

  // expect(a).toBe(b);   // ❌ different references
  expect(a).toEqual(b);   // ✅ same shape & values
});

test("toStrictEqual is pickier", () => {
  expect({ x: undefined, y: 2 }).toEqual({ y: 2 });        // ✅
  // expect({ x: undefined, y: 2 }).toStrictEqual({ y: 2 }); // ❌
});`,
  },
  {
    name: ".not negation",
    group: "Matchers",
    code: `test("flip any matcher with .not", () => {
  expect(5).not.toBeNull();
  expect("hi").not.toBeFalsy();
  expect([1, 2, 3]).not.toContain(9);
  expect({ a: 1 }).not.toEqual({ a: 2 });
});`,
  },
  {
    name: "Errors / toThrow",
    group: "Matchers",
    code: `function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

test("the four ways to match a throw", () => {
  // wrap the call in an arrow function!
  expect(() => divide(1, 0)).toThrow();
  expect(() => divide(1, 0)).toThrow("Cannot divide");
  expect(() => divide(1, 0)).toThrow(/divide by zero/i);
  expect(() => divide(1, 0)).toThrow(Error);
});

test("no throw on valid input", () => {
  expect(() => divide(10, 2)).not.toThrow();
});`,
  },

  // ---------------- Functions ----------------
  {
    name: "FizzBuzz",
    group: "Functions",
    code: `function fizzbuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}

describe("fizzbuzz", () => {
  test("3 is Fizz", () => expect(fizzbuzz(3)).toBe("Fizz"));
  test("5 is Buzz", () => expect(fizzbuzz(5)).toBe("Buzz"));
  test("15 is FizzBuzz", () => expect(fizzbuzz(15)).toBe("FizzBuzz"));
  test("7 is just 7", () => expect(fizzbuzz(7)).toBe("7"));
});`,
  },
  {
    name: "TDD challenge",
    group: "Functions",
    code: `// 🔴 RED: these tests are written but the function is empty.
// Make them pass (🟢 GREEN) by implementing isPalindrome.
// (hint: compare the string to its reverse)

function isPalindrome(str) {
  // your code here
}

test("racecar is a palindrome", () => {
  expect(isPalindrome("racecar")).toBe(true);
});

test("hello is not", () => {
  expect(isPalindrome("hello")).toBe(false);
});

test("single char is a palindrome", () => {
  expect(isPalindrome("a")).toBe(true);
});`,
  },
  {
    name: "Edge cases",
    group: "Functions",
    code: `function average(nums) {
  if (!Array.isArray(nums)) throw new Error("expected an array");
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

describe("average", () => {
  test("typical case", () => expect(average([2, 4, 6])).toBe(4));
  test("empty array -> 0", () => expect(average([])).toBe(0));
  test("single value", () => expect(average([9])).toBe(9));
  test("negatives", () => expect(average([-2, 2])).toBe(0));
  test("bad input throws", () => {
    expect(() => average("nope")).toThrow("expected an array");
  });
});`,
  },

  // ---------------- Async ----------------
  {
    name: "async / await",
    group: "Async",
    code: `function fetchName() {
  return Promise.resolve("Jester");
}

test("await the promise", async () => {
  const name = await fetchName();
  expect(name).toBe("Jester");
});`,
  },
  {
    name: "resolves / rejects",
    group: "Async",
    code: `function fetchUser(id) {
  return Promise.resolve({ id, name: "Jester" });
}

function loadMissing() {
  return Promise.reject(new Error("not found"));
}

test("resolves with a user", async () => {
  await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "Jester" });
});

test("rejects when missing", async () => {
  await expect(loadMissing()).rejects.toThrow("not found");
});`,
  },

  // ---------------- Mocks ----------------
  {
    name: "jest.fn()",
    group: "Mocks",
    code: `function processOrders(orders, charge) {
  orders.forEach((order) => charge(order.total));
}

test("charges every order", () => {
  const charge = jest.fn();
  processOrders([{ total: 10 }, { total: 25 }], charge);

  expect(charge).toHaveBeenCalledTimes(2);
  expect(charge).toHaveBeenCalledWith(25);
});`,
  },
  {
    name: "mock returns",
    group: "Mocks",
    code: `test("program what a mock returns", () => {
  const getId = jest.fn().mockReturnValue(7);
  expect(getId()).toBe(7);
  expect(getId()).toBe(7);
});

test("queue values with ...Once", () => {
  const next = jest.fn()
    .mockReturnValueOnce("a")
    .mockReturnValueOnce("b")
    .mockReturnValue("done");

  expect(next()).toBe("a");
  expect(next()).toBe("b");
  expect(next()).toBe("done");
  expect(next()).toBe("done");
});`,
  },
  {
    name: "spyOn",
    group: "Mocks",
    code: `const analytics = {
  track(event) {
    return "sent: " + event;
  },
};

test("spyOn watches a real method", () => {
  const spy = jest.spyOn(analytics, "track");

  const result = analytics.track("signup");

  // calls through to the real method by default...
  expect(result).toBe("sent: signup");
  // ...while recording how it was used.
  expect(spy).toHaveBeenCalledWith("signup");

  spy.mockRestore();
});`,
  },
  {
    name: "async mock",
    group: "Mocks",
    code: `async function loadProfile(api, id) {
  const user = await api(id);
  return user.name.toUpperCase();
}

test("mockResolvedValue fakes async", async () => {
  const api = jest.fn().mockResolvedValue({ name: "jester" });

  const result = await loadProfile(api, 1);

  expect(result).toBe("JESTER");
  expect(api).toHaveBeenCalledWith(1);
});`,
  },

  // ---------------- Structure ----------------
  {
    name: "describe + hooks",
    group: "Structure",
    code: `describe("shopping cart", () => {
  let cart;

  beforeEach(() => {
    cart = [];          // fresh state before EVERY test
  });

  test("starts empty", () => {
    expect(cart).toHaveLength(0);
  });

  test("can add an item", () => {
    cart.push("ticket");
    expect(cart).toHaveLength(1);
  });

  test("stays isolated from the previous test", () => {
    expect(cart).toHaveLength(0);
  });
});`,
  },
  {
    name: "test.each",
    group: "Structure",
    code: `function add(a, b) {
  return a + b;
}

// Run the same test across a whole table of inputs.
test.each([
  [1, 1, 2],
  [2, 3, 5],
  [10, -4, 6],
])("add(%i, %i) = %i", (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});`,
  },

  // ---------------- Real-world ----------------
  {
    name: "Slugify",
    group: "Real-world",
    code: `function slugify(title) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

describe("slugify", () => {
  test("basic title", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  test("strips punctuation", () => {
    expect(slugify("Jest: The Best!")).toBe("jest-the-best");
  });
  test("trims dashes", () => {
    expect(slugify("  spaced out  ")).toBe("spaced-out");
  });
});`,
  },
  {
    name: "Password rules",
    group: "Real-world",
    code: `function validatePassword(pw) {
  const errors = [];
  if (pw.length < 8) errors.push("too short");
  if (!/[A-Z]/.test(pw)) errors.push("needs uppercase");
  if (!/[0-9]/.test(pw)) errors.push("needs a number");
  return { valid: errors.length === 0, errors };
}

describe("validatePassword", () => {
  test("a strong password", () => {
    expect(validatePassword("Carnival7")).toEqual({ valid: true, errors: [] });
  });
  test("collects every problem", () => {
    const result = validatePassword("abc");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("too short");
    expect(result.errors).toContain("needs uppercase");
    expect(result.errors).toContain("needs a number");
  });
});`,
  },
  {
    name: "Cart total",
    group: "Real-world",
    code: `function cartTotal(items, taxRate = 0) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return +(subtotal * (1 + taxRate)).toFixed(2);
}

describe("cartTotal", () => {
  const items = [
    { name: "ticket", price: 20, qty: 2 },
    { name: "popcorn", price: 5.5, qty: 1 },
  ];

  test("sums price * qty", () => {
    expect(cartTotal(items)).toBe(45.5);
  });
  test("applies tax", () => {
    expect(cartTotal(items, 0.1)).toBeCloseTo(50.05);
  });
  test("empty cart is 0", () => {
    expect(cartTotal([])).toBe(0);
  });
});`,
  },
  // ---------------- Advanced ----------------
  {
    name: "Asymmetric matchers",
    group: "Advanced",
    code: `// Match SHAPE instead of exact values. Great when ids/timestamps vary.
function createUser(name) {
  return { id: Math.random(), name, roles: ["member"], createdAt: Date.now() };
}

describe("createUser", () => {
  test("matches the shape, ignoring the random id", () => {
    expect(createUser("Ada")).toEqual({
      id: expect.any(Number),
      name: "Ada",
      roles: expect.arrayContaining(["member"]),
      createdAt: expect.any(Number),
    });
  });

  test("objectContaining checks a subset", () => {
    expect(createUser("Grace")).toEqual(
      expect.objectContaining({ name: "Grace" })
    );
  });
});`,
  },
  {
    name: "Fake timers",
    group: "Advanced",
    code: `// Test time-based code WITHOUT actually waiting. Control the clock yourself.
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

describe("debounce", () => {
  test("only fires once after the wait", () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    const debounced = debounce(spy, 200);

    debounced();
    debounced();
    debounced();

    expect(spy).not.toHaveBeenCalled();   // nothing yet
    jest.advanceTimersByTime(200);        // fast-forward 200ms
    expect(spy).toHaveBeenCalledTimes(1); // fired exactly once

    jest.useRealTimers();
  });
});`,
  },
  {
    name: "Snapshots",
    group: "Advanced",
    code: `// Run once: the snapshot is recorded + the test passes.
// Change the output and run again: the snapshot test FAILS until you accept it.
// (Use the "Snapshots" button below to clear stored snapshots.)
function renderBadge(label, count) {
  return { type: "badge", label, count, classes: ["pill", count > 0 ? "active" : "muted"] };
}

describe("renderBadge", () => {
  test("matches the stored snapshot", () => {
    expect(renderBadge("Tests", 3)).toMatchSnapshot();
  });
});`,
  },
  // ---------------- Modules ----------------
  {
    name: "Real vs mocked module",
    group: "Modules",
    code: `// require() pulls in a demo module. Without jest.mock, you get the REAL one.
const { greet } = require("./greeter");

function welcome(name) {
  return greet(name);
}

describe("welcome (real module)", () => {
  test("uses the real greeter", () => {
    expect(welcome("Ada")).toBe("Hello, Ada!");
  });
});`,
  },
  {
    name: "jest.mock a dependency",
    group: "Modules",
    code: `// jest.mock replaces a module with a fake. (Declare it before require.)
jest.mock("./greeter", () => ({
  greet: jest.fn(() => "MOCKED"),
}));

const { greet } = require("./greeter");

function welcome(name) {
  return greet(name);
}

describe("welcome (mocked module)", () => {
  test("uses the mock, not the real greeter", () => {
    expect(welcome("Ada")).toBe("MOCKED");
  });
  test("and we can assert how it was called", () => {
    welcome("Grace");
    expect(greet).toHaveBeenCalledWith("Grace");
  });
});`,
  },
  {
    name: "Mock an async API module",
    group: "Modules",
    code: `// Mock a network module so tests are fast and deterministic.
jest.mock("./api", () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: "Mocky" }),
}));

const { fetchUser } = require("./api");

async function getUserName(id) {
  const user = await fetchUser(id);
  return user.name;
}

describe("getUserName", () => {
  test("returns the mocked user's name", async () => {
    await expect(getUserName(1)).resolves.toBe("Mocky");
  });
  test("calls the API with the right id", async () => {
    await getUserName(42);
    expect(fetchUser).toHaveBeenCalledWith(42);
  });
});`,
  },
];

const groups = [
  "Basics",
  "Matchers",
  "Functions",
  "Async",
  "Mocks",
  "Structure",
  "Real-world",
  "Advanced",
  "Modules",
];

// Cheat sheet, grouped so it reads as a tidy reference instead of one long list.
const cheatGroups = [
  {
    title: "Equality",
    items: [
      ["toBe(v)", "exact value (===)"],
      ["toEqual(v)", "deep value match"],
      ["toStrictEqual(v)", "deep + types & undefined"],
    ],
  },
  {
    title: "Truthiness",
    items: [
      ["toBeNull()", "is null"],
      ["toBeUndefined()", "is undefined"],
      ["toBeDefined()", "is not undefined"],
      ["toBeTruthy()", "is truthy"],
      ["toBeFalsy()", "is falsy"],
    ],
  },
  {
    title: "Numbers",
    items: [
      ["toBeGreaterThan(n)", "greater than n"],
      ["toBeLessThan(n)", "less than n"],
      ["toBeGreaterThanOrEqual(n)", "≥ n"],
      ["toBeCloseTo(n)", "float-safe ≈"],
    ],
  },
  {
    title: "Strings",
    items: [
      ["toMatch('x')", "contains substring"],
      ["toMatch(/re/)", "matches regex"],
    ],
  },
  {
    title: "Arrays & objects",
    items: [
      ["toContain(x)", "array/string has x"],
      ["toContainEqual(o)", "deep array membership"],
      ["toHaveLength(n)", "length is n"],
      ["toHaveProperty('a.b', v?)", "has (nested) key"],
      ["toMatchObject(o)", "subset of fields"],
    ],
  },
  {
    title: "Functions & errors",
    items: [
      ["toThrow()", "throws anything"],
      ["toThrow('msg' | /re/)", "throws matching"],
    ],
  },
  {
    title: "Mocks & spies",
    items: [
      ["jest.fn()", "create a mock"],
      ["jest.spyOn(o, 'm')", "wrap a real method"],
      ["toHaveBeenCalled()", "was called"],
      ["toHaveBeenCalledTimes(n)", "called n times"],
      ["toHaveBeenCalledWith(a)", "called with args"],
      ["mockReturnValue(v)", "stub return"],
      ["mockResolvedValue(v)", "stub async return"],
    ],
  },
  {
    title: "Async & modifiers",
    items: [
      [".resolves.x", "match resolved value"],
      [".rejects.x", "match rejection"],
      [".not.x", "negate any matcher"],
      ["test.each(t)(...)", "table-driven tests"],
    ],
  },
  {
    title: "Asymmetric & misc",
    items: [
      ["expect.any(C)", "value of a type"],
      ["expect.objectContaining(o)", "object has subset"],
      ["expect.arrayContaining(a)", "array has items"],
      ["toBeInstanceOf(C)", "instanceof check"],
      ["toBeNaN()", "value is NaN"],
      ["toMatchSnapshot()", "record / compare"],
    ],
  },
  {
    title: "Fake timers",
    items: [
      ["jest.useFakeTimers()", "control the clock"],
      ["jest.advanceTimersByTime(n)", "tick n ms forward"],
      ["jest.runAllTimers()", "flush every timer"],
      ["jest.useRealTimers()", "restore real time"],
    ],
  },
  {
    title: "Modules",
    items: [
      ["require('./x')", "import a demo module"],
      ["jest.mock('./x', fn)", "replace with a fake"],
      ["jest.requireActual('./x')", "get the real one"],
      ["jest.unmock('./x')", "undo a mock"],
    ],
  },
];

const presetColors = {
  Basics: "#2ee66e",
  Matchers: "#2dd4bf",
  Functions: "#7dd3fc",
  Async: "#a78bfa",
  Mocks: "#ffb84c",
  Structure: "#f472b6",
  "Real-world": "#4ade80",
  Advanced: "#c4b5fd",
  Modules: "#f0abfc",
};

const Playground = () => {
  const initial = useRef(readInitialCode(presets[0].code)).current;
  const [code, setCode] = useState(initial.code);
  const [activePreset, setActivePreset] = useState(
    initial.source === "shared" ? "Shared link" : initial.source === "saved" ? "Your session" : "Blank"
  );
  const [runnerKey, setRunnerKey] = useState(0);
  const [snack, setSnack] = useState(null);
  const liveCode = useRef(initial.code);

  const persist = (next) => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const handleCodeChange = useCallback((next) => {
    liveCode.current = next;
    persist(next);
  }, []);

  const loadPreset = (preset) => {
    setCode(preset.code);
    liveCode.current = preset.code;
    persist(preset.code);
    setActivePreset(preset.name);
    setRunnerKey((k) => k + 1);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?code=${encodeCode(liveCode.current)}`;
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", url);
      setSnack("Share link copied to your clipboard.");
    } catch {
      setSnack("Couldn't copy automatically — grab the URL from your address bar.");
    }
  };

  const handleClearSnapshots = () => {
    clearSnapshots();
    setSnack("Stored snapshots cleared — toMatchSnapshot() will re-record.");
  };

  const active =
    presets.find((p) => p.name === activePreset) || { name: activePreset, group: "Custom" };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        sx={{
          fontFamily: monoFont,
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(46,230,110,0.7)",
          mb: 1.2,
        }}
      >
        {"// Sandbox"}
      </Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <TerminalIcon sx={{ fontSize: 34, color: "#2ee66e" }} />
        <Typography variant="h3">The Playground</Typography>
      </Stack>
      <Typography sx={{ color: "text.secondary", mb: 3, maxWidth: 720 }}>
        A real Jest-style runner, right in your browser. Pick a scenario below to load
        a working example, tweak it, and hit <strong>Run</strong> (or{" "}
        <Box component="kbd" sx={{ fontFamily: monoFont, fontSize: 12, px: 0.6, py: 0.2, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 1 }}>⌘/Ctrl + ↵</Box>). Your
        code auto-saves and survives refreshes.
      </Typography>

      {initial.source !== "default" && (
        <Chip
          size="small"
          label={
            initial.source === "shared"
              ? "Loaded from a shared link"
              : "Restored your last session"
          }
          sx={{
            mb: 2,
            backgroundColor: "rgba(46,230,110,0.12)",
            color: "#5ef08f",
            fontWeight: 600,
          }}
        />
      )}

      {/* Scenario picker */}
      <Paper sx={{ p: { xs: 2, md: 2.5 }, mb: 3, border: "1px solid rgba(255,255,255,0.08)" }}>
        <Stack spacing={1.5}>
          {groups.map((group) => (
            <Stack
              key={group}
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ flexWrap: "wrap", gap: 1 }}
            >
              <Typography
                sx={{
                  fontFamily: monoFont,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: presetColors[group] || "rgba(232,245,238,0.5)",
                  width: { sm: 96 },
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {group}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.8 }}>
                {presets
                  .filter((p) => p.group === group)
                  .map((p) => {
                    const isActive = activePreset === p.name;
                    return (
                      <Button
                        key={p.name}
                        size="small"
                        onClick={() => loadPreset(p)}
                        sx={{
                          minWidth: 0,
                          px: 1.5,
                          py: 0.5,
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "#04150b" : "rgba(232,245,238,0.78)",
                          backgroundColor: isActive ? "#2ee66e" : "rgba(255,255,255,0.04)",
                          border: "1px solid",
                          borderColor: isActive ? "#2ee66e" : "rgba(255,255,255,0.12)",
                          "&:hover": {
                            backgroundColor: isActive ? "#42ef82" : "rgba(46,230,110,0.12)",
                            borderColor: "rgba(46,230,110,0.5)",
                          },
                        }}
                      >
                        {p.name}
                      </Button>
                    );
                  })}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* Editor (full width — this is the main stage) */}
      <Paper sx={{ border: "1px solid rgba(46,230,110,0.2)", overflow: "hidden" }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            px: { xs: 2, md: 2.5 },
            py: 1.4,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <Stack direction="row" spacing={0.8}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <Box key={c} sx={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c }} />
            ))}
          </Stack>
          <Typography sx={{ fontFamily: monoFont, fontSize: 13, color: "rgba(232,245,238,0.85)" }}>
            {active.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.test.js
          </Typography>
          <Box
            sx={{
              ml: "auto",
              px: 1,
              py: 0.3,
              borderRadius: 999,
              fontFamily: monoFont,
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: presetColors[active.group] || "#2ee66e",
              border: `1px solid ${(presetColors[active.group] || "#2ee66e")}55`,
            }}
          >
            {active.group}
          </Box>
        </Stack>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <TestRunner
            key={runnerKey}
            initialCode={code}
            minRows={16}
            onCodeChange={handleCodeChange}
            extraActions={
              <>
                <Tooltip title="Copy a shareable link to this code">
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<IosShareIcon />}
                    onClick={handleShare}
                    sx={{ borderColor: "rgba(46,230,110,0.4)", color: "#5ef08f" }}
                  >
                    Share
                  </Button>
                </Tooltip>
                <Tooltip title="Clear stored snapshots for toMatchSnapshot()">
                  <Button
                    variant="text"
                    color="inherit"
                    startIcon={<DeleteSweepOutlinedIcon />}
                    onClick={handleClearSnapshots}
                    sx={{ color: "rgba(232,245,238,0.5)" }}
                  >
                    Snapshots
                  </Button>
                </Tooltip>
              </>
            }
          />
        </Box>
      </Paper>

      {/* Cheat sheet — categorized + aligned grid */}
      <Box sx={{ mt: 6 }}>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.5 }}>
          <FactCheckOutlinedIcon sx={{ color: "#2dd4bf" }} />
          <Typography variant="h5">Matcher cheat sheet</Typography>
        </Stack>
        <Typography sx={{ color: "text.secondary", mb: 2.5 }}>
          Every matcher the in-browser runner supports, grouped by what you're checking.
        </Typography>
        <Grid container spacing={2}>
          {cheatGroups.map((cg) => (
            <Grid item xs={12} sm={6} md={4} key={cg.title}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "rgba(45,212,191,0.35)" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: monoFont,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(45,212,191,0.85)",
                    mb: 1.3,
                  }}
                >
                  {cg.title}
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "max-content 1fr",
                    columnGap: 1.5,
                    rowGap: 0.9,
                    alignItems: "baseline",
                  }}
                >
                  {cg.items.map(([m, d]) => (
                    <React.Fragment key={m}>
                      <Box
                        component="code"
                        sx={{
                          fontFamily: monoFont,
                          fontSize: 12,
                          color: "#5ef08f",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m}
                      </Box>
                      <Typography sx={{ color: "text.secondary", fontSize: 12.5, lineHeight: 1.4 }}>
                        {d}
                      </Typography>
                    </React.Fragment>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Accordion
        sx={{
          mt: 4,
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px !important",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#2ee66e" }} />}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InfoOutlinedIcon sx={{ color: "#2ee66e", fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600 }}>What's actually running here?</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
            This playground runs a browser-native re-implementation of Jest's core
            API — <Code>describe</Code>, <Code>test</Code> / <Code>test.each</Code>,{" "}
            <Code>expect</Code> with 25+ matchers, asymmetric matchers like{" "}
            <Code>expect.any()</Code>, the lifecycle hooks, <Code>jest.fn()</Code>,{" "}
            <Code>jest.spyOn()</Code>, fake timers (<Code>jest.useFakeTimers()</Code>),
            working <Code>toMatchSnapshot()</Code>, module mocking via{" "}
            <Code>jest.mock()</Code> + <Code>require()</Code>, a live <Code>console</Code>,
            and async <Code>.resolves</Code> / <Code>.rejects</Code>. The API matches real
            Jest, so what you learn here transfers directly. In a real project you'd run
            these from your terminal with <Code>npm test</Code>.
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13.5, mb: 2 }}>
            Demo modules you can <Code>require</Code> or <Code>jest.mock</Code>:{" "}
            <Code>./greeter</Code>, <Code>./api</Code>, <Code>./mathlib</Code>, <Code>./logger</Code>.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {["describe", "test.each", "expect.any", "jest.fn", "jest.spyOn", "jest.mock", "useFakeTimers", "toMatchSnapshot", ".resolves", ".rejects"].map((t) => (
              <Chip key={t} size="small" label={t} sx={{ fontFamily: monoFont, fontSize: 11, backgroundColor: "rgba(46,230,110,0.1)", color: "#5ef08f" }} />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
};

const Code = ({ children }) => (
  <Box component="code" sx={{ fontFamily: monoFont, color: "#5ef08f" }}>
    {children}
  </Box>
);

export default Playground;
