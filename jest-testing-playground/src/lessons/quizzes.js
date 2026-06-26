// Optional knowledge-check quizzes, keyed by lesson slug. A lesson with a quiz
// shows it after the reading; getting them right is a quick confidence check.
// answer = index of the correct option.

const quizzes = {
  "your-first-test": [
    {
      q: "What happens to a test() that contains no expect() assertion?",
      options: [
        "It throws an error",
        "It is skipped",
        "It passes silently — a false positive",
        "It fails by default",
      ],
      answer: 2,
      explain:
        "With nothing to assert, there's nothing to fail, so it passes — which is dangerous because it gives false confidence.",
    },
    {
      q: "Which test name is the most useful when it fails?",
      options: [
        'test("works", ...)',
        'test("cart", ...)',
        'test("returns 0 for an empty cart", ...)',
        'test("test 1", ...)',
      ],
      answer: 2,
      explain: "A good name describes the behavior and condition — the name becomes the bug report.",
    },
  ],
  "matchers-tobe-toequal": [
    {
      q: "You compare two different objects with the same contents. Which passes?",
      options: [
        "toBe — objects are equal by value",
        "toEqual — it checks deep value equality",
        "Both pass",
        "Neither can compare objects",
      ],
      answer: 1,
      explain:
        "toBe uses Object.is (reference identity), so two different object instances fail. toEqual compares values deeply.",
    },
    {
      q: "expect(2 + 2).toBe(4) passes because…",
      options: [
        "Numbers are objects",
        "Primitives with the same value are identical under Object.is",
        "toBe always rounds",
        "It actually uses toEqual internally",
      ],
      answer: 1,
      explain: "For primitives like numbers and strings, value equality and identity are the same thing.",
    },
  ],
  truthiness: [
    {
      q: "Which value is NOT falsy in JavaScript?",
      options: ["0", '""', "[]", "null"],
      answer: 2,
      explain: "An empty array (and empty object) is truthy. 0, \"\", null, undefined, NaN, and false are falsy.",
    },
  ],
  "testing-functions-and-errors": [
    {
      q: "How do you correctly assert that a function throws?",
      options: [
        "expect(fn()).toThrow()",
        "expect(fn).toThrow()",
        "expect(() => fn()).toThrow()",
        "Both B and C",
      ],
      answer: 3,
      explain:
        "You must pass the function itself (not call it) so Jest can invoke it and catch the error. A wrapper arrow or the bare reference both work.",
    },
  ],
  "async-testing": [
    {
      q: "Why must you return or await the promise in an async test?",
      options: [
        "For performance",
        "Otherwise the test finishes before the assertion runs",
        "Jest requires the 'async' keyword",
        "It prevents memory leaks",
      ],
      answer: 1,
      explain:
        "If you don't await/return, the test function completes synchronously and Jest never sees the assertion — it can pass incorrectly.",
    },
  ],
  mocking: [
    {
      q: "What is the main purpose of jest.fn()?",
      options: [
        "To speed up tests",
        "To create a fake function you can inspect and control",
        "To mock the file system",
        "To generate random data",
      ],
      answer: 1,
      explain:
        "A mock function records how it was called and lets you stub return values, so you can test code in isolation.",
    },
  ],
  tdd: [
    {
      q: "What is the correct order of the TDD cycle?",
      options: [
        "Green → Red → Refactor",
        "Refactor → Red → Green",
        "Red → Green → Refactor",
        "Red → Refactor → Green",
      ],
      answer: 2,
      explain: "Write a failing test (Red), make it pass simply (Green), then clean up safely (Refactor).",
    },
  ],
  "what-to-test": [
    {
      q: "Which is the healthiest testing focus?",
      options: [
        "Test every private method",
        "Test behavior and public outputs",
        "Aim for 100% coverage at all costs",
        "Test the framework itself",
      ],
      answer: 1,
      explain:
        "Behavior tests survive refactors and describe what matters. Implementation-detail tests are brittle.",
    },
  ],
};

export default quizzes;
