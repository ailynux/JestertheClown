// Lesson content for Jest Carnival.
//
// Each lesson is made of "blocks" that the lesson page renders in order:
//   { type: "paragraph", text }   -> supports `inline code` with backticks
//   { type: "heading", text }
//   { type: "code", code }         -> read-only example
//   { type: "tip", text }          -> highlighted note
//
// Every lesson ends with an `exercise`: editable starter code the learner
// runs against the in-browser Jest engine, plus a `solution`.

const skillLessons = [
  {
    slug: "your-first-test",
    emoji: "🎯",
    title: "Your First Test",
    level: "Beginner",
    duration: "5 min",
    summary:
      "Write and run your very first assertion, and see what passing and failing look like.",
    blocks: [
      {
        type: "paragraph",
        text: "A test is just code that checks whether your other code behaves the way you expect. When you change something later, the tests tell you instantly if you broke anything.",
      },
      {
        type: "heading",
        text: "The anatomy of a test",
      },
      {
        type: "paragraph",
        text: "Almost every Jest test follows the same shape: `test(name, callback)` describes what you're checking, and inside it you make an assertion with `expect(...)`.",
      },
      {
        type: "code",
        code: `test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});`,
      },
      {
        type: "paragraph",
        text: "Read it out loud: \"I expect 2 + 2 to be 4.\" If it is, the test passes (green). If not, it fails (red) and tells you exactly what went wrong.",
      },
      {
        type: "tip",
        text: "Golden rule: test behavior, not implementation details. Check what your code does, not how it does it.",
      },
    ],
    exercise: {
      instructions:
        "Run this test and watch it pass. Then change `4` to `5` and run again to see what a failing test looks like.",
      starterCode: `test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});`,
    },
    solution: `test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});`,
  },

  {
    slug: "matchers-tobe-toequal",
    emoji: "🎯",
    title: "Matchers: toBe vs toEqual",
    level: "Beginner",
    duration: "7 min",
    summary:
      "The two matchers you'll use most — and the classic trap that catches every beginner.",
    blocks: [
      {
        type: "paragraph",
        text: "A matcher is the part after `expect(...)` that decides whether a test passes. `toBe` checks for exact identity, while `toEqual` checks for deep value equality.",
      },
      {
        type: "code",
        code: `expect(1 + 1).toBe(2);          // ✅ numbers are compared by value
expect("hi").toBe("hi");        // ✅ strings too

const a = { name: "Jester" };
expect(a).toBe({ name: "Jester" });   // ❌ different objects in memory
expect(a).toEqual({ name: "Jester" }); // ✅ same shape and values`,
      },
      {
        type: "tip",
        text: "Rule of thumb: use toBe for primitives (numbers, strings, booleans) and toEqual for objects and arrays.",
      },
    ],
    exercise: {
      instructions:
        "The second test is failing because it uses the wrong matcher for an object. Fix it so both tests pass.",
      starterCode: `test("adds numbers", () => {
  expect(3 + 4).toBe(7);
});

test("builds a clown", () => {
  const clown = { name: "Jester", happy: true };
  expect(clown).toBe({ name: "Jester", happy: true });
});`,
    },
    solution: `test("adds numbers", () => {
  expect(3 + 4).toBe(7);
});

test("builds a clown", () => {
  const clown = { name: "Jester", happy: true };
  expect(clown).toEqual({ name: "Jester", happy: true });
});`,
  },

  {
    slug: "truthiness",
    emoji: "🃏",
    title: "Truthiness",
    level: "Beginner",
    duration: "6 min",
    summary:
      "null, undefined, true, false — Jest has dedicated matchers so your intent is crystal clear.",
    blocks: [
      {
        type: "paragraph",
        text: "Sometimes you don't care about the exact value, only whether it's present or 'truthy'. Jest gives you precise matchers for these cases.",
      },
      {
        type: "code",
        code: `expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect("anything").toBeDefined();
expect("non-empty").toBeTruthy();
expect(0).toBeFalsy();
expect("").toBeFalsy();`,
      },
      {
        type: "paragraph",
        text: "You can also flip any matcher with `.not` to assert the opposite.",
      },
      {
        type: "code",
        code: `expect(5).not.toBeNull();
expect("hi").not.toBeFalsy();`,
      },
    ],
    exercise: {
      instructions:
        "Write assertions that match each variable correctly so all four tests pass.",
      starterCode: `test("a missing value", () => {
  const value = null;
  expect(value)/* ?? */;
});

test("a present value", () => {
  const value = "ready";
  expect(value)/* ?? */;
});

test("zero is falsy", () => {
  expect(0)/* ?? */;
});

test("a name is truthy", () => {
  expect("Jester")/* ?? */;
});`,
    },
    solution: `test("a missing value", () => {
  const value = null;
  expect(value).toBeNull();
});

test("a present value", () => {
  const value = "ready";
  expect(value).toBeDefined();
});

test("zero is falsy", () => {
  expect(0).toBeFalsy();
});

test("a name is truthy", () => {
  expect("Jester").toBeTruthy();
});`,
  },

  {
    slug: "numbers-and-strings",
    emoji: "🔢",
    title: "Numbers & Strings",
    level: "Beginner",
    duration: "7 min",
    summary:
      "Compare numbers with greater/less-than matchers, handle floating-point math, and match strings with regex.",
    blocks: [
      {
        type: "heading",
        text: "Numbers",
      },
      {
        type: "code",
        code: `expect(10).toBeGreaterThan(9);
expect(10).toBeGreaterThanOrEqual(10);
expect(5).toBeLessThan(6);`,
      },
      {
        type: "paragraph",
        text: "Floating-point math is famously imprecise. `0.1 + 0.2` is not exactly `0.3`! Use `toBeCloseTo` instead of `toBe` for decimals.",
      },
      {
        type: "code",
        code: `// expect(0.1 + 0.2).toBe(0.3);   // ❌ fails!
expect(0.1 + 0.2).toBeCloseTo(0.3); // ✅`,
      },
      {
        type: "heading",
        text: "Strings",
      },
      {
        type: "paragraph",
        text: "`toMatch` checks whether a string contains a substring or matches a regular expression.",
      },
      {
        type: "code",
        code: `expect("Jester the Clown").toMatch("Clown");
expect("test@example.com").toMatch(/@/);`,
      },
    ],
    exercise: {
      instructions:
        "Fix the floating-point test (it's using toBe) and complete the string test so both pass.",
      starterCode: `test("decimals are tricky", () => {
  expect(0.1 + 0.2).toBe(0.3);
});

test("email looks valid", () => {
  const email = "clown@circus.com";
  expect(email).toMatch(/* a regex that checks for an @ */);
});`,
    },
    solution: `test("decimals are tricky", () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});

test("email looks valid", () => {
  const email = "clown@circus.com";
  expect(email).toMatch(/@/);
});`,
  },

  {
    slug: "arrays-and-objects",
    emoji: "🎁",
    title: "Arrays & Objects",
    level: "Beginner",
    duration: "8 min",
    summary:
      "Check what's inside arrays and objects with toContain, toHaveLength, and toHaveProperty.",
    blocks: [
      {
        type: "code",
        code: `const acts = ["acrobat", "juggler", "clown"];

expect(acts).toContain("juggler");
expect(acts).toHaveLength(3);
expect(acts).not.toContain("lion");`,
      },
      {
        type: "paragraph",
        text: "For objects, `toHaveProperty` checks that a key exists (optionally with a specific value). You can reach nested keys with dot notation.",
      },
      {
        type: "code",
        code: `const show = { name: "Carnival", tickets: { sold: 42 } };

expect(show).toHaveProperty("name");
expect(show).toHaveProperty("name", "Carnival");
expect(show).toHaveProperty("tickets.sold", 42);`,
      },
    ],
    exercise: {
      instructions:
        "Complete the assertions so the test verifies the lineup correctly.",
      starterCode: `test("the circus lineup", () => {
  const lineup = ["acrobat", "juggler", "clown"];

  // it should contain "clown"
  expect(lineup)/* ?? */;

  // it should have exactly 3 acts
  expect(lineup)/* ?? */;
});`,
    },
    solution: `test("the circus lineup", () => {
  const lineup = ["acrobat", "juggler", "clown"];

  expect(lineup).toContain("clown");
  expect(lineup).toHaveLength(3);
});`,
  },

  {
    slug: "testing-functions-and-errors",
    emoji: "💥",
    title: "Testing Functions & Errors",
    level: "Intermediate",
    duration: "8 min",
    summary:
      "Test the functions you actually write, and assert that bad input throws errors.",
    blocks: [
      {
        type: "paragraph",
        text: "Real tests check real functions. Define a function, call it, and assert on the result.",
      },
      {
        type: "code",
        code: `function add(a, b) {
  return a + b;
}

test("add works", () => {
  expect(add(2, 3)).toBe(5);
});`,
      },
      {
        type: "paragraph",
        text: "To test that a function throws, pass a wrapper function to `expect` (not the call itself), then use `toThrow`.",
      },
      {
        type: "code",
        code: `function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

test("divide guards against zero", () => {
  expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
});`,
      },
      {
        type: "tip",
        text: "Notice the arrow function wrapper: expect(() => divide(10, 0)). If you wrote expect(divide(10, 0)) it would throw before Jest could catch it.",
      },
    ],
    exercise: {
      instructions:
        "Write a `capitalize` function, then make both tests pass — including the one that expects an error for empty input.",
      starterCode: `function capitalize(word) {
  // your code here
}

test("capitalizes a word", () => {
  expect(capitalize("jester")).toBe("Jester");
});

test("throws on empty input", () => {
  expect(() => capitalize("")).toThrow();
});`,
    },
    solution: `function capitalize(word) {
  if (!word) throw new Error("word is required");
  return word[0].toUpperCase() + word.slice(1);
}

test("capitalizes a word", () => {
  expect(capitalize("jester")).toBe("Jester");
});

test("throws on empty input", () => {
  expect(() => capitalize("")).toThrow();
});`,
  },

  {
    slug: "setup-and-teardown",
    emoji: "🧹",
    title: "Setup & Teardown",
    level: "Intermediate",
    duration: "7 min",
    summary:
      "Use beforeEach, afterEach, beforeAll and afterAll to share setup and avoid repeating yourself.",
    blocks: [
      {
        type: "paragraph",
        text: "When several tests need the same starting point, hooks let you set it up once. `beforeEach` runs before every test in its scope; `afterEach` runs after each one.",
      },
      {
        type: "code",
        code: `let cart;

beforeEach(() => {
  cart = [];        // fresh cart before every test
});

test("starts empty", () => {
  expect(cart).toHaveLength(0);
});

test("can add an item", () => {
  cart.push("ticket");
  expect(cart).toHaveLength(1);
});`,
      },
      {
        type: "tip",
        text: "Without beforeEach resetting the cart, the second test would leak state into others. Fresh state per test keeps them independent.",
      },
      {
        type: "paragraph",
        text: "`beforeAll` / `afterAll` run once for the whole group — handy for expensive one-time setup.",
      },
    ],
    exercise: {
      instructions:
        "The tests share a counter but it's not being reset. Add a `beforeEach` so each test starts from 0 and both pass.",
      starterCode: `let count;

// add a beforeEach here

test("first test increments to 1", () => {
  count = count + 1;
  expect(count).toBe(1);
});

test("second test also starts fresh", () => {
  count = count + 1;
  expect(count).toBe(1);
});`,
    },
    solution: `let count;

beforeEach(() => {
  count = 0;
});

test("first test increments to 1", () => {
  count = count + 1;
  expect(count).toBe(1);
});

test("second test also starts fresh", () => {
  count = count + 1;
  expect(count).toBe(1);
});`,
  },

  {
    slug: "organizing-with-describe",
    emoji: "🗂️",
    title: "Organizing with describe",
    level: "Intermediate",
    duration: "6 min",
    summary:
      "Group related tests into readable blocks with describe, so failures are easy to locate.",
    blocks: [
      {
        type: "paragraph",
        text: "`describe(name, fn)` groups related tests. It doesn't change behavior — it makes output readable and lets you scope hooks to a group.",
      },
      {
        type: "code",
        code: `describe("calculator", () => {
  test("adds", () => {
    expect(1 + 2).toBe(3);
  });

  test("subtracts", () => {
    expect(5 - 2).toBe(3);
  });
});`,
      },
      {
        type: "paragraph",
        text: "You can nest describe blocks to mirror the structure of what you're testing.",
      },
    ],
    exercise: {
      instructions:
        "Wrap these two related tests inside a describe block named \"string utils\".",
      starterCode: `test("uppercases", () => {
  expect("hi".toUpperCase()).toBe("HI");
});

test("measures length", () => {
  expect("clown".length).toBe(5);
});`,
    },
    solution: `describe("string utils", () => {
  test("uppercases", () => {
    expect("hi".toUpperCase()).toBe("HI");
  });

  test("measures length", () => {
    expect("clown".length).toBe(5);
  });
});`,
  },

  {
    slug: "async-testing",
    emoji: "⏳",
    title: "Testing Async Code",
    level: "Intermediate",
    duration: "8 min",
    summary:
      "Promises and async/await — test code that doesn't finish immediately, without false passes.",
    blocks: [
      {
        type: "paragraph",
        text: "Lots of real code is asynchronous: fetching data, reading files, timers. The key is to make your test wait for the result. The cleanest way is `async/await`.",
      },
      {
        type: "code",
        code: `function fetchName() {
  return Promise.resolve("Jester");
}

test("resolves to a name", async () => {
  const name = await fetchName();
  expect(name).toBe("Jester");
});`,
      },
      {
        type: "tip",
        text: "Mark the test callback `async` and `await` the promise. If you forget to await, the test can finish before the assertion runs and pass by accident.",
      },
    ],
    exercise: {
      instructions:
        "Make this test wait for the promise to resolve, then assert the value is 42. Add `async` and `await`.",
      starterCode: `function getAnswer() {
  return Promise.resolve(42);
}

test("the answer is 42", () => {
  const answer = getAnswer();
  expect(answer).toBe(42);
});`,
    },
    solution: `function getAnswer() {
  return Promise.resolve(42);
}

test("the answer is 42", async () => {
  const answer = await getAnswer();
  expect(answer).toBe(42);
});`,
  },

  {
    slug: "mocking",
    emoji: "🎭",
    title: "Mocking with jest.fn()",
    level: "Advanced",
    duration: "9 min",
    summary:
      "Replace real dependencies with fakes you control, and assert how they were called.",
    blocks: [
      {
        type: "paragraph",
        text: "A mock function is a fake you create with `jest.fn()`. It records every call so you can assert that your code used it correctly — and you can make it return whatever you want.",
      },
      {
        type: "code",
        code: `const logger = jest.fn();

logger("hello");
logger("world");

expect(logger).toHaveBeenCalled();
expect(logger).toHaveBeenCalledTimes(2);
expect(logger).toHaveBeenCalledWith("hello");`,
      },
      {
        type: "paragraph",
        text: "Mocks shine when testing a function that depends on something else. You pass in a mock instead of the real dependency.",
      },
      {
        type: "code",
        code: `function greet(name, notify) {
  notify("Welcome, " + name);
}

test("greet notifies the user", () => {
  const notify = jest.fn();
  greet("Jester", notify);
  expect(notify).toHaveBeenCalledWith("Welcome, Jester");
});`,
      },
      {
        type: "tip",
        text: "Use mockReturnValue to control output: const getId = jest.fn().mockReturnValue(7);",
      },
    ],
    exercise: {
      instructions:
        "Create a mock with jest.fn(), call the `saveAll` function with it, and assert the mock was called once per item (3 times).",
      starterCode: `function saveAll(items, save) {
  items.forEach((item) => save(item));
}

test("saves every item", () => {
  const save = /* create a mock here */;
  saveAll(["a", "b", "c"], save);

  // assert save was called 3 times
});`,
    },
    solution: `function saveAll(items, save) {
  items.forEach((item) => save(item));
}

test("saves every item", () => {
  const save = jest.fn();
  saveAll(["a", "b", "c"], save);

  expect(save).toHaveBeenCalledTimes(3);
  expect(save).toHaveBeenCalledWith("b");
});`,
  },
];

// Foundations track: the "why" and "how" behind testing with Jest. These are
// reading-focused; some include an optional hands-on exercise.
const conceptLessons = [
  {
    slug: "why-test-at-all",
    emoji: "🛟",
    title: "Why Test At All?",
    level: "Concept",
    duration: "6 min",
    track: "Foundations",
    summary:
      "The honest answer to \"why bother?\" — and why every serious team writes tests.",
    blocks: [
      {
        type: "paragraph",
        text: "Here's the uncomfortable truth: software breaks the moment you change it. You fix one thing, and something three files away quietly stops working. You won't notice until a user does.",
      },
      {
        type: "paragraph",
        text: "You *could* test by hand — click through the app, try some inputs, eyeball the result. That works once. But you can't re-click every feature every time you change a line. Manual testing doesn't scale, and humans forget.",
      },
      {
        type: "heading",
        text: "What a test actually buys you",
      },
      {
        type: "paragraph",
        text: "A test is a tiny program that proves a piece of your code does what you claim — automatically, forever. Write it once, and it re-checks that behavior on every single change you ever make.",
      },
      {
        type: "list",
        items: [
          "Confidence to change code without fear of silently breaking things.",
          "A safety net that catches bugs in seconds instead of in production.",
          "Living documentation: a test says \"this is exactly how this function is supposed to behave.\"",
          "Faster debugging: a failing test points right at what broke.",
        ],
      },
      {
        type: "tip",
        text: "The real payoff isn't writing a test once. It's the 100th time you refactor and the tests instantly tell you whether you broke anything. That confidence is the whole point.",
      },
      {
        type: "paragraph",
        text: "Think of tests like a smoke detector. Mildly annoying to install, easy to ignore — until the day something catches fire and it saves you.",
      },
    ],
  },

  {
    slug: "what-is-jest",
    emoji: "🤖",
    title: "What Exactly Is Jest?",
    level: "Concept",
    duration: "6 min",
    track: "Foundations",
    summary:
      "Jest is three tools in one. Understand each part so the whole thing stops feeling like magic.",
    blocks: [
      {
        type: "paragraph",
        text: "\"Jest\" gets thrown around as one word, but it's really three tools bundled together. Once you can name the parts, everything you read in the docs makes more sense.",
      },
      {
        type: "heading",
        text: "1. A test runner",
      },
      {
        type: "paragraph",
        text: "It finds your test files (anything like `*.test.js` or files inside a `__tests__` folder), runs them, and prints a pass/fail report. It also runs files in parallel and gives you a `--watch` mode that re-runs tests as you edit.",
      },
      {
        type: "heading",
        text: "2. An assertion library",
      },
      {
        type: "paragraph",
        text: "That's `expect(...)` plus all the matchers (`toBe`, `toEqual`, `toThrow`, …). This is the part that actually decides whether something passed. You'll spend most of the Hands-on track here.",
      },
      {
        type: "heading",
        text: "3. A mocking framework",
      },
      {
        type: "paragraph",
        text: "`jest.fn()` and `jest.mock()` let you replace real things (a database, an API, the clock) with fakes you control, so a test stays fast and predictable.",
      },
      {
        type: "tip",
        text: "Jest was built by Meta and ships by default with Create React App, which is why it's everywhere in the React world. Cousins worth knowing: Vitest (modern, Vite-native, near-identical API) and Mocha + Chai. Learn Jest and the rest feel familiar.",
      },
    ],
  },

  {
    slug: "how-jest-works",
    emoji: "⚙️",
    title: "How Jest Runs Your Tests",
    level: "Concept",
    duration: "7 min",
    track: "Foundations",
    summary:
      "A peek under the hood: what actually happens between `npm test` and that green checkmark.",
    blocks: [
      {
        type: "paragraph",
        text: "Tests feel less magical once you know the steps Jest takes. Here's the whole journey.",
      },
      {
        type: "list",
        items: [
          "You run `npm test`. Jest scans your project for files that look like tests.",
          "For each file, it spins up a fresh, isolated environment (jsdom to fake a browser, or plain Node).",
          "Collection phase: it runs your file top-to-bottom, registering every `describe` and `test` callback — but not running the test bodies yet.",
          "Run phase: it executes each registered test, running any `beforeEach`/`afterEach` hooks around it.",
          "When `expect` fails, it throws an error. Jest catches it, marks that test red, and shows a diff of expected vs received.",
          "It tallies everything and prints the summary.",
        ],
      },
      {
        type: "heading",
        text: "Why isolation matters",
      },
      {
        type: "paragraph",
        text: "Each test file runs in its own sandbox, often in a separate worker process, in parallel. That's why one test can't accidentally leak state into another — and why fast feedback is possible even with thousands of tests.",
      },
      {
        type: "tip",
        text: "Fun fact: the runner powering this whole site uses the exact same two-phase model — collect describe/test callbacks, then run them and catch thrown assertions. You've been watching a mini-Jest the whole time.",
      },
    ],
  },

  {
    slug: "what-to-test",
    emoji: "🎚️",
    title: "What To Test (And What Not To)",
    level: "Concept",
    duration: "8 min",
    track: "Foundations",
    summary:
      "The lesson that fixes the \"writing tests feels like way too much\" problem. Test less, but test the right things.",
    blocks: [
      {
        type: "paragraph",
        text: "If testing ever felt exhausting or pointless — like you were writing endless tests just to write tests — you were probably testing the wrong things. Pros don't test everything. They test what matters.",
      },
      {
        type: "heading",
        text: "Test behavior, not implementation",
      },
      {
        type: "paragraph",
        text: "Test what your code *does* from the outside (inputs → outputs, what a caller or user observes), not *how* it does it (internal variables, private helpers, the exact function calls). Implementation-detail tests break every time you refactor, even when nothing is actually wrong. That's the exhausting kind.",
      },
      {
        type: "code",
        code: `// ❌ testing implementation: brittle, breaks on refactor
expect(component.state.internalCounter).toBe(1);

// ✅ testing behavior: survives refactors
expect(screen.getByText("You have 1 message")).toBeInTheDocument();`,
      },
      {
        type: "heading",
        text: "Worth testing",
      },
      {
        type: "list",
        items: [
          "Business logic and calculations (pricing, validation, parsing).",
          "Edge cases (empty input, zero, negative, huge values, nulls).",
          "Bugs you've already fixed — add a test so they can never come back.",
          "Anything that would be expensive or embarrassing if it broke.",
        ],
      },
      {
        type: "heading",
        text: "Usually not worth testing",
      },
      {
        type: "list",
        items: [
          "Third-party libraries and the framework itself — they have their own tests.",
          "Trivial code with no logic (a getter that just returns a value).",
          "Exact styling / pixel positions.",
          "Things so volatile they'd need rewriting every day.",
        ],
      },
      {
        type: "tip",
        text: "The one question to ask: \"Would this test fail for a reason I actually care about?\" If a failure wouldn't point to a real bug, don't write it. Aim for high-value coverage, not 100%.",
      },
      {
        type: "paragraph",
        text: "And that feeling of \"I had to use AI or I didn't know what to assert\"? That's often a signal the code's *contract* is unclear. Try describing the behavior in one sentence first — \"given X, it should return Y.\" That sentence IS your test.",
      },
    ],
  },

  {
    slug: "tdd",
    emoji: "🔴",
    title: "Test-Driven Development",
    level: "Concept",
    duration: "8 min",
    track: "Foundations",
    summary:
      "Write the test first. It sounds backwards, but it's one of the most powerful habits a developer can build.",
    blocks: [
      {
        type: "paragraph",
        text: "TDD flips the usual order: you write a failing test before you write the code that makes it pass. The cycle has three steps, often called Red → Green → Refactor.",
      },
      {
        type: "list",
        items: [
          "🔴 Red — write a small test for behavior that doesn't exist yet. Run it. It fails (red). Good — now you have a target.",
          "🟢 Green — write the simplest code that makes the test pass. No more than needed.",
          "🛠️ Refactor — clean up the code now that a test guards it. The test stays green.",
        ],
      },
      {
        type: "paragraph",
        text: "Why it works: writing the test first forces you to define exactly what \"done\" means before you get lost in code. You only build what's needed, and you end up with tests automatically.",
      },
      {
        type: "tip",
        text: "You don't have to do TDD all the time. But practicing it sharpens the single most useful testing skill: clearly describing the behavior you want.",
      },
    ],
    exercise: {
      instructions:
        "Practice the cycle. A test for `isEven` is already written (Red). Write the simplest `isEven` function that makes it pass (Green).",
      starterCode: `function isEven(n) {
  // your code here (make the tests pass)
}

test("4 is even", () => {
  expect(isEven(4)).toBe(true);
});

test("7 is not even", () => {
  expect(isEven(7)).toBe(false);
});`,
    },
    solution: `function isEven(n) {
  return n % 2 === 0;
}

test("4 is even", () => {
  expect(isEven(4)).toBe(true);
});

test("7 is not even", () => {
  expect(isEven(7)).toBe(false);
});`,
  },

  {
    slug: "tests-on-a-team",
    emoji: "🚦",
    title: "How Teams Keep Tests Alive",
    level: "Concept",
    duration: "8 min",
    track: "Foundations",
    summary:
      "Your exact question: how do real teams keep tests updated and trustworthy? Automation plus a bit of culture.",
    blocks: [
      {
        type: "paragraph",
        text: "On a good team, tests aren't something people remember to run — the system runs them automatically and refuses to ship broken code. Here's how that actually works.",
      },
      {
        type: "heading",
        text: "Continuous Integration (CI)",
      },
      {
        type: "paragraph",
        text: "Every time someone pushes code or opens a pull request, a CI service (GitHub Actions, GitLab CI, CircleCI…) automatically runs the whole test suite on a clean machine. If any test fails, the PR is blocked and can't be merged. Nobody has to remember — the robot enforces it.",
      },
      {
        type: "code",
        code: `# .github/workflows/test.yml (simplified)
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test`,
      },
      {
        type: "heading",
        text: "Catching problems even earlier",
      },
      {
        type: "list",
        items: [
          "Pre-commit hooks (e.g. Husky) run tests or linting on your machine before a commit is even allowed.",
          "Code review includes reviewing the tests — reviewers ask \"where's the test for this?\"",
          "Coverage reports track how much code is exercised by tests, so gaps are visible.",
        ],
      },
      {
        type: "heading",
        text: "Keeping them updated",
      },
      {
        type: "paragraph",
        text: "When behavior changes on purpose, you update the test in the same pull request as the code — they travel together. If a test starts failing randomly (a \"flaky\" test), the team fixes or quarantines it fast, because a test you can't trust is worse than no test. Treat tests like real code: refactor them, name them well, delete dead ones.",
      },
      {
        type: "tip",
        text: "Mental model: code and its tests are a pair. A change isn't \"done\" until its tests are green and updated. CI just makes that rule impossible to skip.",
      },
    ],
  },
];

// Foundations first, then hands-on skills. Anything without an explicit track
// defaults to the Hands-on Skills track.
const lessons = [...conceptLessons, ...skillLessons].map((lesson) => ({
  ...lesson,
  track: lesson.track || "Hands-on Skills",
}));

export default lessons;

export const TRACKS = ["Foundations", "Hands-on Skills"];

export function getLesson(slug) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonIndex(slug) {
  return lessons.findIndex((lesson) => lesson.slug === slug);
}
