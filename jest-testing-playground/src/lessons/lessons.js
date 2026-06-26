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
        type: "heading",
        text: "What a failure actually looks like",
      },
      {
        type: "paragraph",
        text: "Failing tests are not the enemy — they're the whole point. A good failure message hands you everything you need to debug. When `expect(2 + 2).toBe(5)` fails, Jest prints both sides so you can see the mismatch at a glance:",
      },
      {
        type: "code",
        code: `expect(received).toBe(expected)

Expected: 5
Received: 4`,
      },
      {
        type: "paragraph",
        text: "Two numbers, side by side. Real debugging is mostly reading these messages carefully — the answer is almost always right there. Get comfortable *reading* failures, not fearing them.",
      },
      {
        type: "heading",
        text: "Naming tests well",
      },
      {
        type: "paragraph",
        text: "The string you pass to `test(...)` is documentation. Six months from now, a failing test named `\"works\"` tells you nothing, but `\"returns 0 for an empty cart\"` tells you exactly what broke. Describe the *behavior* and the *condition*: \"it does X when Y.\"",
      },
      {
        type: "code",
        code: `// 🙈 vague — useless when it fails
test("cart", () => { /* ... */ });

// 🙌 specific — the name IS the bug report
test("returns 0 for an empty cart", () => { /* ... */ });`,
      },
      {
        type: "tip",
        text: "Golden rule: test behavior, not implementation details. Check WHAT your code does (its output), not HOW it does it (its internal steps). Behavior tests survive refactors; implementation tests break the moment you tidy up.",
      },
      {
        type: "warning",
        text: "A test with no `expect` inside it always passes — silently. An empty test is worse than no test because it gives false confidence. Every test needs at least one real assertion.",
      },
    ],
    exercise: {
      instructions:
        "Run this test and watch it pass. Then change `4` to `5` and run again — read the failure message carefully and notice how it shows Expected vs Received. Then change it back to green.",
      starterCode: `test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});`,
    },
    solution: `test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});`,
    recap: [
      "Every test follows the shape `test(name, () => { expect(...).matcher(...) })`.",
      "Passing is green, failing is red — and a failure prints Expected vs Received to guide you.",
      "Name tests after the behavior and condition: \"it does X when Y.\"",
      "Test behavior, not implementation. And a test with no `expect` is a false positive.",
    ],
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
        type: "heading",
        text: "Why does toBe fail on objects?",
      },
      {
        type: "paragraph",
        text: "`toBe` uses `Object.is` under the hood — essentially the `===` operator. For primitives, `===` compares *values*: `2 === 2` is true. But for objects and arrays, `===` compares *references* — it asks \"are these the exact same object in memory?\" Two objects with identical contents are still two different objects, so `===` (and `toBe`) says no.",
      },
      {
        type: "code",
        code: `const a = { name: "Jester" };
const b = { name: "Jester" };
const c = a;

console.log(a === b); // false — different objects
console.log(a === c); // true  — same reference

expect(a).toBe(c);     // ✅ literally the same object
expect(a).toEqual(b);  // ✅ same shape and values`,
      },
      {
        type: "paragraph",
        text: "`toEqual` ignores references and walks the whole structure recursively, comparing every value. That's exactly what you want 99% of the time when checking objects and arrays.",
      },
      {
        type: "heading",
        text: "toEqual vs toStrictEqual",
      },
      {
        type: "paragraph",
        text: "There's a stricter cousin: `toStrictEqual`. It also checks that `undefined` properties and types line up. `toEqual` treats `{ a: undefined }` and `{}` as equal; `toStrictEqual` does not. Reach for `toStrictEqual` when those subtle differences matter.",
      },
      {
        type: "code",
        code: `expect({ a: undefined, b: 2 }).toEqual({ b: 2 });       // ✅ passes
expect({ a: undefined, b: 2 }).toStrictEqual({ b: 2 }); // ❌ fails`,
      },
      {
        type: "tip",
        text: "Rule of thumb: use toBe for primitives (numbers, strings, booleans) and toEqual for objects and arrays. Reach for toStrictEqual when undefined keys or class types must match exactly.",
      },
      {
        type: "warning",
        text: "This is the single most common beginner trap: using toBe on an object and getting a baffling failure where Expected and Received look identical. They ARE identical in content — just not the same reference. Switch to toEqual.",
      },
    ],
    exercise: {
      instructions:
        "The second test is failing because it uses the wrong matcher for an object. Read the failure (Expected and Received look the same!), then fix it so both tests pass.",
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
    recap: [
      "`toBe` is `===`: value comparison for primitives, reference comparison for objects.",
      "`toEqual` recursively compares contents — use it for objects and arrays.",
      "`toStrictEqual` additionally checks `undefined` keys and class types.",
      "Identical-looking Expected/Received on a failure usually means you used `toBe` on an object.",
    ],
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
      {
        type: "heading",
        text: "The falsy values you must memorize",
      },
      {
        type: "paragraph",
        text: "JavaScript has exactly eight falsy values — everything else is truthy. Knowing them cold saves you from a whole category of bugs:",
      },
      {
        type: "code",
        code: `false, 0, -0, 0n, "", null, undefined, NaN
// ↑ all falsy. EVERYTHING else (including [], {}, "0", "false") is truthy.`,
      },
      {
        type: "paragraph",
        text: "That last part trips people up constantly: an empty array `[]` and an empty object `{}` are *truthy*. So is the string `\"0\"`. If you ever write `if (items)` to check \"do I have items?\", remember an empty array passes that check.",
      },
      {
        type: "heading",
        text: "null vs undefined — they're different",
      },
      {
        type: "paragraph",
        text: "`undefined` means \"this was never assigned a value.\" `null` means \"intentionally set to nothing.\" Jest keeps them separate, so be precise: `toBeNull()` only matches `null`, `toBeUndefined()` only matches `undefined`, and `toBeDefined()` is the opposite of `toBeUndefined()`.",
      },
      {
        type: "code",
        code: `let notSet;
expect(notSet).toBeUndefined();   // ✅
expect(notSet).toBeNull();        // ❌ undefined is not null

const cleared = null;
expect(cleared).toBeNull();       // ✅
expect(cleared).toBeDefined();    // ✅ null counts as "defined"`,
      },
      {
        type: "tip",
        text: "Prefer the specific matcher over a generic one. `expect(x).toBeNull()` gives a clearer failure than `expect(x === null).toBe(true)` — and reads like a sentence.",
      },
      {
        type: "warning",
        text: "`toBeTruthy`/`toBeFalsy` are blunt instruments. `expect(user).toBeTruthy()` passes for `42`, `\"hi\"`, `[]`, and `{}` alike. If you actually care that `user` is a specific value, assert that value instead — truthiness checks can hide bugs.",
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
    recap: [
      "Eight falsy values: `false, 0, -0, 0n, \"\", null, undefined, NaN`. Everything else is truthy.",
      "`[]` and `{}` are truthy — a common source of bugs in `if` checks.",
      "`null` (intentional nothing) and `undefined` (never set) are distinct; match each precisely.",
      "Prefer specific matchers over `toBeTruthy/toBeFalsy`, which can mask real values.",
    ],
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
      {
        type: "paragraph",
        text: "Passing a string checks for a substring; passing a regular expression unlocks real pattern power — case-insensitivity, anchors, character classes, and more.",
      },
      {
        type: "code",
        code: `expect("Hello World").toMatch(/hello/i);   // i = ignore case
expect("abc123").toMatch(/^[a-z]+\\d+$/);   // letters then digits
expect("error: timeout").not.toMatch(/success/);`,
      },
      {
        type: "heading",
        text: "Why toBeCloseTo exists",
      },
      {
        type: "paragraph",
        text: "Computers store decimals in binary, and most decimals can't be represented exactly — just like 1/3 can't be written exactly in decimal. So `0.1 + 0.2` actually evaluates to `0.30000000000000004`. This isn't a Jest quirk; it's how floating-point works in every language.",
      },
      {
        type: "code",
        code: `console.log(0.1 + 0.2);            // 0.30000000000000004
expect(0.1 + 0.2).toBeCloseTo(0.3); // ✅ close enough
// optional second arg = number of decimal digits to check
expect(3.14159).toBeCloseTo(3.14, 2); // ✅ matches to 2 places`,
      },
      {
        type: "tip",
        text: "Use toBe for integers (they're exact) and toBeCloseTo for any value that came out of decimal arithmetic — money, percentages, averages, physics.",
      },
      {
        type: "warning",
        text: "Beginners reach for `toMatch` to compare two strings for equality. Don't — use `toBe`. `toMatch` is for partial/pattern matching, and `expect(\"on\").toMatch(\"on\")` would also pass against \"button\", \"onion\", etc.",
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
    recap: [
      "Compare numbers with `toBeGreaterThan`, `toBeLessThan`, and their `OrEqual` variants.",
      "Floating-point math is imprecise everywhere — use `toBeCloseTo` for decimals, `toBe` for integers.",
      "`toMatch` takes a substring or a regex; regex unlocks case-insensitivity, anchors, and classes.",
      "Don't use `toMatch` for equality — use `toBe`, since a substring can match by accident.",
    ],
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
      {
        type: "heading",
        text: "toContain vs toContainEqual",
      },
      {
        type: "paragraph",
        text: "`toContain` uses reference/value equality (like `toBe`). That's perfect for arrays of primitives, but it fails for arrays of objects — because each object is a distinct reference. For \"does this array contain an object that looks like this?\", use `toContainEqual`.",
      },
      {
        type: "code",
        code: `const acts = [{ name: "clown" }, { name: "juggler" }];

expect(acts).toContain({ name: "clown" });      // ❌ different reference
expect(acts).toContainEqual({ name: "clown" }); // ✅ deep match`,
      },
      {
        type: "heading",
        text: "Matching part of an object with toMatchObject",
      },
      {
        type: "paragraph",
        text: "Often you only care about *some* fields — say an API returns 20 properties but you only need to verify three. `toMatchObject` asserts that the received object contains (at least) the given subset, ignoring extra keys.",
      },
      {
        type: "code",
        code: `const response = { id: 7, name: "Jester", createdAt: "2026-01-01", internal: true };

// only assert what you care about
expect(response).toMatchObject({ id: 7, name: "Jester" }); // ✅`,
      },
      {
        type: "tip",
        text: "Reach for the most specific matcher you can: toHaveLength beats checking .length with toBe, and toMatchObject beats pulling out individual fields. Specific matchers give clearer failure messages.",
      },
      {
        type: "warning",
        text: "`toContain` on an array of objects almost always fails for confusing reasons. The moment your array holds objects, switch to `toContainEqual` (or `toEqual` on the whole array).",
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
    recap: [
      "Arrays: `toContain` (membership) and `toHaveLength` (size).",
      "For arrays of objects, use `toContainEqual` — `toContain` compares references.",
      "Objects: `toHaveProperty(\"a.b\", value)` reaches nested keys with dot paths.",
      "`toMatchObject` checks a subset of fields and ignores the rest — great for API responses.",
    ],
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
      {
        type: "heading",
        text: "Four ways to match an error",
      },
      {
        type: "paragraph",
        text: "`toThrow` is flexible about what you pass it. Each form is progressively more specific — and more specific is better, because it proves you threw the *right* error, not just *some* error:",
      },
      {
        type: "code",
        code: `expect(fn).toThrow();                       // threw anything at all
expect(fn).toThrow("Cannot divide");        // message contains this substring
expect(fn).toThrow(/divide by zero/i);      // message matches this regex
expect(fn).toThrow(TypeError);              // is an instance of this error class`,
      },
      {
        type: "heading",
        text: "The Arrange–Act–Assert shape",
      },
      {
        type: "paragraph",
        text: "Most function tests read best in three beats. **Arrange** the inputs, **Act** by calling the function, **Assert** on the result. Keeping these visually separate makes a test instantly scannable.",
      },
      {
        type: "code",
        code: `test("applies a discount", () => {
  // Arrange
  const price = 100;
  const code = "SAVE10";

  // Act
  const final = applyDiscount(price, code);

  // Assert
  expect(final).toBe(90);
});`,
      },
      {
        type: "warning",
        text: "The #1 toThrow mistake: forgetting the wrapper. `expect(divide(10, 0)).toThrow()` runs `divide(10, 0)` immediately, the error escapes before `expect` is even called, and your test errors out instead of passing. Always wrap: `expect(() => divide(10, 0))`.",
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
    recap: [
      "Test real functions: call them and assert on the return value.",
      "To assert a throw, pass a wrapper: `expect(() => fn()).toThrow()`.",
      "`toThrow` accepts nothing, a substring, a regex, or an error class — prefer the specific forms.",
      "Structure tests as Arrange → Act → Assert for instant readability.",
    ],
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
      {
        type: "heading",
        text: "The exact running order",
      },
      {
        type: "paragraph",
        text: "When you mix all four hooks, Jest runs them in a predictable order. For each test: every `beforeAll` (once, up front) → `beforeEach` → the test → `afterEach` → and finally `afterAll` once at the end. Outer (describe-level) hooks wrap inner ones.",
      },
      {
        type: "code",
        code: `beforeAll(() => console.log("1: once, before everything"));
beforeEach(() => console.log("2: before each test"));
afterEach(() => console.log("3: after each test"));
afterAll(() => console.log("4: once, after everything"));

test("a", () => {}); // logs 2, 3
test("b", () => {}); // logs 2, 3
// overall: 1, [2,3], [2,3], 4`,
      },
      {
        type: "heading",
        text: "beforeEach vs beforeAll — choosing right",
      },
      {
        type: "paragraph",
        text: "Default to `beforeEach`. It rebuilds fresh state for every test, which keeps tests isolated and independent. Only use `beforeAll` for genuinely expensive, read-only setup (like starting a server or seeding a database once) — and never mutate that shared resource inside a test.",
      },
      {
        type: "warning",
        text: "Shared mutable state set up in `beforeAll` is a classic flaky-test factory. If test A modifies it, test B might pass or fail depending on the order they run in. When in doubt, reset in `beforeEach`.",
      },
      {
        type: "tip",
        text: "Use afterEach for cleanup that must always happen — restoring spies, clearing timers, closing connections — so one test's mess never leaks into the next.",
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
    recap: [
      "`beforeEach`/`afterEach` run around every test; `beforeAll`/`afterAll` run once per group.",
      "Order per test: beforeAll (once) → beforeEach → test → afterEach → … → afterAll (once).",
      "Default to `beforeEach` for fresh, isolated state; reserve `beforeAll` for expensive read-only setup.",
      "Shared mutable state across tests causes flakiness and order-dependent failures.",
    ],
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
      {
        type: "code",
        code: `describe("ShoppingCart", () => {
  describe("when empty", () => {
    test("total is 0", () => { /* ... */ });
    test("checkout is disabled", () => { /* ... */ });
  });

  describe("with items", () => {
    test("sums the prices", () => { /* ... */ });
    test("applies tax", () => { /* ... */ });
  });
});`,
      },
      {
        type: "paragraph",
        text: "Notice how the names read like sentences when combined: \"ShoppingCart › when empty › total is 0.\" That nesting is exactly what shows up in your test output, so a failure tells you the component, the scenario, and the expectation all at once.",
      },
      {
        type: "heading",
        text: "Hooks are scoped to their describe",
      },
      {
        type: "paragraph",
        text: "A `beforeEach` inside a `describe` only runs for the tests in that block. This lets each scenario build its own starting point without affecting unrelated tests — a huge organizational win on bigger files.",
      },
      {
        type: "code",
        code: `describe("with items", () => {
  let cart;
  beforeEach(() => {
    cart = new ShoppingCart();
    cart.add({ price: 10 });
  });
  // every test in here starts with a one-item cart
});`,
      },
      {
        type: "tip",
        text: "Helpful focus tools while developing: describe.only / test.only run just that block, and describe.skip / test.skip temporarily ignore one. Just don't commit a stray .only — it silently disables the rest of your suite.",
      },
      {
        type: "warning",
        text: "describe is for organization, not behavior — code written directly inside a describe (outside a hook or test) runs during the collection phase, before any test. Put setup in beforeEach, not loose in the describe body.",
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
    recap: [
      "`describe` groups related tests and makes output read like sentences.",
      "Nest describes to mirror scenarios; the nesting appears in failure messages.",
      "Hooks like `beforeEach` are scoped to their describe block.",
      "Use `.only`/`.skip` while developing — but never commit a stray `.only`.",
    ],
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
      {
        type: "heading",
        text: "The false-pass trap, shown",
      },
      {
        type: "paragraph",
        text: "This is the single most dangerous async testing bug. Here's a test that *looks* fine but is completely broken — it never actually checks anything:",
      },
      {
        type: "code",
        code: `// 🐛 BROKEN: not async, no await
test("user is loaded", () => {
  fetchUser(1).then((user) => {
    expect(user.name).toBe("WRONG"); // never runs before the test ends!
  });
});
// The test passes. The assertion inside .then runs later — after Jest
// already marked it green. You have a test that can never fail.`,
      },
      {
        type: "paragraph",
        text: "The fix is to give Jest something to wait for: either `await` the promise, or `return` it. Both tell Jest \"don't finish this test until the async work settles.\"",
      },
      {
        type: "code",
        code: `// ✅ await (cleanest)
test("user is loaded", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Jester");
});

// ✅ or return the promise
test("user is loaded", () => {
  return fetchUser(1).then((user) => {
    expect(user.name).toBe("Jester");
  });
});`,
      },
      {
        type: "heading",
        text: "Testing rejections",
      },
      {
        type: "paragraph",
        text: "To assert that async code fails, wrap the await in a try/catch — or use the much tidier `.rejects` matcher (its own lesson). Don't forget `expect.assertions(n)` if you want to guarantee the catch block actually ran.",
      },
      {
        type: "code",
        code: `test("rejects bad ids", async () => {
  await expect(fetchUser(-1)).rejects.toThrow("invalid id");
});`,
      },
      {
        type: "warning",
        text: "Rule: every promise in a test must be awaited or returned. A bare `expect(...)` inside a `.then` with no await/return is the classic test that passes forever and protects nothing.",
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
    recap: [
      "Make the test wait: mark the callback `async` and `await` the promise (or `return` it).",
      "Forgetting to await creates a test that passes without ever asserting anything.",
      "Test rejections with try/catch or the `.rejects` matcher.",
      "Rule: every promise in a test must be awaited or returned.",
    ],
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
        type: "heading",
        text: "Why mock at all?",
      },
      {
        type: "paragraph",
        text: "This is the part that finally makes Jest \"click\" for most people. Imagine testing a `checkout()` function that charges a credit card and sends an email. You do NOT want your test suite to actually charge real cards or spam real inboxes every time it runs. Mocks let you swap those real, slow, dangerous dependencies for fast fakes you fully control.",
      },
      {
        type: "list",
        items: [
          "**Speed** — a mock returns instantly; a real network call takes hundreds of milliseconds.",
          "**Isolation** — you're testing YOUR code, not the payment provider's. If their server is down, your test shouldn't break.",
          "**Control** — you can force a mock to return success, failure, or weird edge cases on demand.",
          "**Safety** — no real emails, charges, or database writes during a test run.",
        ],
      },
      {
        type: "heading",
        text: "Two things mocks do",
      },
      {
        type: "paragraph",
        text: "A mock plays two roles, and it helps to keep them straight. First, it's a **spy**: it remembers how it was called (how many times, with what arguments). Second, it's a **stub**: you can program what it returns so the code under test receives a controlled answer.",
      },
      {
        type: "code",
        code: `const getUser = jest.fn();

// stub: program the return value
getUser.mockReturnValue({ id: 1, name: "Jester" });
// you can even queue different values per call
getUser.mockReturnValueOnce({ id: 2 }); // used on the 1st call only

// spy: inspect how it was used afterwards
getUser("by-id", 1);
expect(getUser).toHaveBeenCalledWith("by-id", 1);
expect(getUser.mock.calls).toHaveLength(1);`,
      },
      {
        type: "paragraph",
        text: "For functions that return promises (most real dependencies), use `mockResolvedValue` and `mockRejectedValue` to fake async results cleanly:",
      },
      {
        type: "code",
        code: `const api = jest.fn();
api.mockResolvedValue({ ok: true });   // resolves to this
// api.mockRejectedValue(new Error("down")); // or simulate a failure`,
      },
      {
        type: "tip",
        text: "Use mockReturnValue to control output: const getId = jest.fn().mockReturnValue(7). And reset mocks between tests (jest.clearAllMocks or a beforeEach) so call counts don't bleed across tests.",
      },
      {
        type: "warning",
        text: "Don't over-mock. If you mock everything, your test only proves your mocks were called in the right order — not that the real thing works. Mock the slow/dangerous edges (network, DB, time); run your own logic for real.",
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
    recap: [
      "Mock the slow/dangerous edges (network, DB, email, time) — for speed, isolation, control, and safety.",
      "A mock is both a spy (records calls) and a stub (you program its return value).",
      "Program output with `mockReturnValue` / `mockResolvedValue` (and the `…Once` variants).",
      "Reset mocks between tests, and don't over-mock or you test the mocks, not the code.",
    ],
  },
  {
    slug: "parametrized-tests",
    emoji: "🧮",
    title: "Parametrized Tests with test.each",
    level: "Intermediate",
    duration: "6 min",
    summary:
      "Stop copy-pasting the same test. Run one test across a whole table of inputs with test.each.",
    blocks: [
      {
        type: "paragraph",
        text: "When you want to check the *same* behavior against many inputs, copy-pasting a test five times is noisy and easy to get wrong. `test.each` runs a single test body once per row of data.",
      },
      {
        type: "code",
        code: `test.each([\n  [1, 1, 2],\n  [2, 3, 5],\n  [10, -4, 6],\n])("add(%i, %i) = %i", (a, b, expected) => {\n  expect(add(a, b)).toBe(expected);\n});`,
      },
      {
        type: "paragraph",
        text: "Each array row is spread as the arguments to your test function. The placeholders in the name (`%i`, `%s`, `%p`, `%#` for the index) get filled in, so each case shows up as its own labelled test in the results.",
      },
      {
        type: "tip",
        text: "This is perfect for edge-case tables: a list of inputs and their expected outputs. One readable test, many cases, and a failure tells you exactly which row broke.",
      },
      {
        type: "warning",
        text: "Don't cram unrelated assertions into one `test.each`. It's for the same check across different data — not a dumping ground for everything.",
      },
    ],
    exercise: {
      instructions:
        "Finish the table so `isVowel` is checked for several letters. Add a row that asserts \"z\" is NOT a vowel (expected false), then run.",
      starterCode: `function isVowel(ch) {
  return "aeiou".includes(ch);
}

test.each([
  ["a", true],
  ["e", true],
  // add a row for "z" -> false
])("isVowel(%s) === %p", (ch, expected) => {
  expect(isVowel(ch)).toBe(expected);
});`,
    },
    solution: `function isVowel(ch) {
  return "aeiou".includes(ch);
}

test.each([
  ["a", true],
  ["e", true],
  ["z", false],
])("isVowel(%s) === %p", (ch, expected) => {
  expect(isVowel(ch)).toBe(expected);
});`,
    recap: [
      "`test.each(table)(name, fn)` runs one test per row of `table`.",
      "Array rows are spread as the arguments to your test callback.",
      "Name placeholders: `%s` string, `%i`/`%d` number, `%p` pretty value, `%#` row index.",
      "Use it for the same assertion across many inputs — especially edge cases.",
    ],
  },
  {
    slug: "promises-resolves-rejects",
    emoji: "🔀",
    title: "Async Matchers: resolves & rejects",
    level: "Intermediate",
    duration: "6 min",
    summary:
      "A cleaner way to assert on promises — without manually awaiting first.",
    blocks: [
      {
        type: "paragraph",
        text: "You already know you can `await` a promise and then assert on the value. Jest gives you a tidier shortcut: `.resolves` and `.rejects` let you match directly on a promise.",
      },
      {
        type: "code",
        code: `// the long way\nconst user = await fetchUser(1);\nexpect(user.name).toBe("Jester");\n\n// with .resolves\nawait expect(fetchUser(1)).resolves.toHaveProperty("name", "Jester");`,
      },
      {
        type: "paragraph",
        text: "`.resolves` waits for the promise to fulfil, then runs the matcher on the resolved value. `.rejects` expects the promise to be rejected, and runs the matcher on the error.",
      },
      {
        type: "code",
        code: `await expect(loadMissing()).rejects.toThrow("not found");`,
      },
      {
        type: "warning",
        text: "Always `await` (or `return`) the expectation. If you forget, the test can finish before the promise settles and a real failure may slip through as a false pass.",
      },
    ],
    exercise: {
      instructions:
        "Write two tests: one asserting `getPrice()` resolves to 42, and one asserting `getError()` rejects with the message \"boom\". Remember to await each expectation.",
      starterCode: `function getPrice() {
  return Promise.resolve(42);
}
function getError() {
  return Promise.reject(new Error("boom"));
}

// test 1: getPrice resolves to 42

// test 2: getError rejects with "boom"`,
    },
    solution: `function getPrice() {
  return Promise.resolve(42);
}
function getError() {
  return Promise.reject(new Error("boom"));
}

test("getPrice resolves to 42", async () => {
  await expect(getPrice()).resolves.toBe(42);
});

test("getError rejects with boom", async () => {
  await expect(getError()).rejects.toThrow("boom");
});`,
    recap: [
      "`.resolves` runs the matcher on a promise's fulfilled value.",
      "`.rejects` expects rejection and runs the matcher on the error.",
      "Always `await` (or `return`) the expectation so the test waits for it.",
      "`.rejects.toThrow(msg)` is the idiomatic way to assert a failure message.",
    ],
  },
  {
    slug: "spying",
    emoji: "🕵️",
    title: "Spying with jest.spyOn",
    level: "Advanced",
    duration: "7 min",
    summary:
      "Watch a real method without replacing it — then take over its behavior when you need to.",
    blocks: [
      {
        type: "paragraph",
        text: "`jest.fn()` creates a brand-new fake. But sometimes you want to watch a method that already exists on an object — log how it was called while letting it run normally. That's `jest.spyOn`.",
      },
      {
        type: "code",
        code: `const spy = jest.spyOn(analytics, "track");\n\nanalytics.track("signup");\n\nexpect(spy).toHaveBeenCalledWith("signup");\nspy.mockRestore(); // put the real method back`,
      },
      {
        type: "paragraph",
        text: "By default a spy *calls through* to the real implementation, so behavior is unchanged — you're just observing. When you want to fake the result instead, chain `.mockReturnValue(...)` or `.mockImplementation(...)`.",
      },
      {
        type: "code",
        code: `jest.spyOn(api, "fetchUser").mockReturnValue({ id: 1 });`,
      },
      {
        type: "warning",
        text: "A spy mutates the real object for the rest of the test. Call `spy.mockRestore()` (or restore in afterEach) so you don't leak fake behavior into other tests.",
      },
    ],
    exercise: {
      instructions:
        "Spy on `logger.write`, call `saveUser` which uses it, and assert the spy was called with \"saved\". Restore the spy at the end.",
      starterCode: `const logger = {
  write(msg) {
    return msg.toUpperCase();
  },
};

function saveUser() {
  logger.write("saved");
}

test("logs when saving", () => {
  // spy on logger.write
  saveUser();
  // assert it was called with "saved"
  // restore the spy
});`,
    },
    solution: `const logger = {
  write(msg) {
    return msg.toUpperCase();
  },
};

function saveUser() {
  logger.write("saved");
}

test("logs when saving", () => {
  const spy = jest.spyOn(logger, "write");
  saveUser();
  expect(spy).toHaveBeenCalledWith("saved");
  spy.mockRestore();
});`,
    recap: [
      "`jest.spyOn(obj, 'method')` wraps an existing method so you can watch its calls.",
      "By default it calls through to the real method — behavior is unchanged.",
      "Chain `.mockReturnValue` / `.mockImplementation` to fake the result instead.",
      "Always `mockRestore()` to undo the spy and avoid leaking into other tests.",
    ],
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
    recap: [
      "Software breaks when you change it; manual testing doesn't scale.",
      "A test is a tiny program that re-checks a behavior automatically, forever.",
      "Tests give you confidence to refactor, a fast safety net, and living documentation.",
      "The payoff compounds: it's the 100th change, not the first, where tests pay off.",
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
    recap: [
      "Jest is three tools in one: a test runner, an assertion library, and a mocking framework.",
      "The runner finds and runs test files and reports pass/fail.",
      "`expect` + matchers decide whether something passed.",
      "`jest.fn()` / `jest.mock()` replace real dependencies with controllable fakes.",
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
    recap: [
      "Jest works in two phases: collect all `describe`/`test` callbacks, then run them.",
      "Each test file runs in its own isolated environment (jsdom or Node).",
      "A failing `expect` throws; Jest catches it, marks the test red, and shows a diff.",
      "Isolation + parallel workers are why thousands of tests stay fast and independent.",
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
    recap: [
      "Test behavior (inputs → outputs), not implementation details.",
      "Focus on business logic, edge cases, and bugs you've already fixed.",
      "Skip third-party code, trivial getters, and exact styling.",
      "Ask: \"would this test fail for a reason I actually care about?\" If not, skip it.",
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
    recap: [
      "TDD cycle: Red (failing test) → Green (simplest passing code) → Refactor.",
      "Writing the test first forces you to define \"done\" before you code.",
      "You build only what's needed and end up with tests for free.",
      "You don't need TDD always — but it sharpens describing behavior clearly.",
    ],
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
    recap: [
      "CI runs the whole suite automatically on every push/PR and blocks merging if it's red.",
      "Pre-commit hooks and code review catch problems even before CI.",
      "Update tests in the same PR as the code change — they travel together.",
      "Fix or quarantine flaky tests fast; an untrustworthy test is worse than none.",
    ],
  },
  {
    slug: "snapshot-testing",
    emoji: "📸",
    title: "Snapshot Testing",
    level: "Concept",
    duration: "6 min",
    track: "Foundations",
    summary:
      "Jest's \"take a photo and compare it later\" feature — powerful, but easy to misuse.",
    blocks: [
      {
        type: "paragraph",
        text: "A snapshot test captures the output of something (often a rendered component or a big object) and saves it to a file. On the next run, Jest compares the new output to the saved snapshot and fails if they differ.",
      },
      {
        type: "code",
        code: `test("renders the card", () => {\n  const tree = renderer.create(<Card title="Hi" />).toJSON();\n  expect(tree).toMatchSnapshot();\n});`,
      },
      {
        type: "paragraph",
        text: "The first run creates a `.snap` file next to your test. You commit that file. Later, if the output changes, the test fails and shows a diff. If the change was intentional, you update the snapshot with `jest --updateSnapshot` (or press `u` in watch mode).",
      },
      {
        type: "heading",
        text: "When they're great — and when they hurt",
      },
      {
        type: "list",
        items: [
          "Good for: catching unexpected changes in stable, serializable output.",
          "Bad when: snapshots are huge — nobody reviews a 500-line diff, so people just press `u`.",
          "Rule of thumb: prefer small, focused assertions for important behavior; reach for snapshots for broad \"did the shape change?\" coverage.",
        ],
      },
      {
        type: "warning",
        text: "The #1 snapshot anti-pattern: blindly running `--updateSnapshot` every time a test fails. That defeats the entire point — you're just re-photographing whatever the code does now, bug and all.",
      },
    ],
    recap: [
      "Snapshots save output to a file and compare future runs against it.",
      "Commit `.snap` files; update them deliberately with `--updateSnapshot` only when the change is intended.",
      "Keep snapshots small and reviewable — giant ones get rubber-stamped.",
      "They complement, not replace, explicit behavior assertions.",
    ],
  },
  {
    slug: "react-testing-library",
    emoji: "🧩",
    title: "Testing React Components",
    level: "Concept",
    duration: "8 min",
    track: "Foundations",
    summary:
      "How Jest pairs with React Testing Library to test components the way a user actually uses them.",
    blocks: [
      {
        type: "paragraph",
        text: "Jest runs your tests, but it doesn't know anything about React. For components, the standard partner is React Testing Library (RTL). Its guiding principle: test your UI the way a user would — find things by what's on screen, interact, and assert on what the user sees.",
      },
      {
        type: "code",
        code: `import { render, screen } from "@testing-library/react";\nimport userEvent from "@testing-library/user-event";\n\ntest("increments the counter", async () => {\n  render(<Counter />);\n\n  // find by accessible text, like a user would\n  await userEvent.click(screen.getByRole("button", { name: /add/i }));\n\n  expect(screen.getByText("Count: 1")).toBeInTheDocument();\n});`,
      },
      {
        type: "heading",
        text: "The core pieces",
      },
      {
        type: "list",
        items: [
          "`render(<Component />)` mounts the component into a fake DOM (jsdom).",
          "`screen.getByRole / getByText / getByLabelText` find elements the way users and screen readers do.",
          "`userEvent` simulates real interactions — clicks, typing, tabbing.",
          "`@testing-library/jest-dom` adds matchers like `toBeInTheDocument()` and `toBeDisabled()`.",
        ],
      },
      {
        type: "warning",
        text: "Avoid testing internal state or implementation details (which hooks ran, private variables). Query by role/text and assert on what's rendered — those tests survive refactors.",
      },
      {
        type: "tip",
        text: "Mental model: if a test would still make sense described to a non-programmer (\"click Add, the count shows 1\"), it's testing behavior. That's the RTL sweet spot.",
      },
    ],
    recap: [
      "Jest runs the tests; React Testing Library renders and queries components.",
      "Query by role/text/label — the way a user or screen reader finds things.",
      "Use `userEvent` for realistic interactions and `jest-dom` matchers for assertions.",
      "Test visible behavior, not implementation details, so tests survive refactors.",
    ],
  },
  {
    slug: "code-coverage",
    emoji: "📊",
    title: "Understanding Code Coverage",
    level: "Concept",
    duration: "6 min",
    track: "Foundations",
    summary:
      "What that coverage percentage actually means — and why 100% is the wrong goal.",
    blocks: [
      {
        type: "paragraph",
        text: "Run `jest --coverage` and you get a report of how much of your code was executed while the tests ran. It's a useful map of untested areas — but it measures the wrong thing if you treat the number as a goal.",
      },
      {
        type: "heading",
        text: "The four numbers",
      },
      {
        type: "list",
        items: [
          "Statements — what % of statements ran.",
          "Branches — what % of if/else and ternary paths were taken.",
          "Functions — what % of functions were called.",
          "Lines — what % of lines executed.",
        ],
      },
      {
        type: "paragraph",
        text: "Branch coverage is the most revealing: it's easy to call a function (100% function coverage) while never testing its `else` path. A high branch number means more of your decision points were actually exercised.",
      },
      {
        type: "warning",
        text: "Coverage tells you what code RAN, not whether it's CORRECT. You can have 100% coverage with zero real assertions. Chasing 100% leads to pointless tests for trivial code.",
      },
      {
        type: "tip",
        text: "Use coverage as a flashlight, not a scoreboard. Look at what's red to find risky untested logic — but let the value of the code, not the percentage, decide what's worth testing.",
      },
    ],
    recap: [
      "`jest --coverage` reports statements, branches, functions, and lines executed.",
      "Branch coverage best reveals untested decision paths.",
      "Coverage shows what ran, not whether it's correct — assertions still matter.",
      "Treat it as a guide to gaps, not a target to maximize.",
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
