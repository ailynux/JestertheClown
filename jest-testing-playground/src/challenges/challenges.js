// Reverse-TDD challenges: the tests are written for you. Your job is to write
// the implementation that makes every test pass. This is how real TDD feels —
// the spec exists first, and you make it go green.
//
// Each challenge's `tests` string is appended to the learner's code before
// running, so the editor only needs the implementation.

const challenges = [
  {
    slug: "capitalize",
    title: "Capitalize",
    difficulty: "Warm-up",
    minutes: 5,
    blurb: "Uppercase the first letter of a word, leave the rest alone.",
    brief:
      "Implement `capitalize(word)` so it uppercases the first character and keeps the rest unchanged. An empty string should stay empty.",
    starterCode: `function capitalize(word) {
  // your code here
}`,
    hints: [
      "Strings are indexable: word[0] is the first character.",
      "word.slice(1) gives you everything after the first character.",
      "Guard the empty string first so word[0] isn't undefined.",
    ],
    solution: `function capitalize(word) {
  if (!word) return "";
  return word[0].toUpperCase() + word.slice(1);
}`,
    tests: `describe("capitalize", () => {
  test("uppercases the first letter", () => {
    expect(capitalize("jest")).toBe("Jest");
  });
  test("leaves the rest of the word untouched", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });
  test("handles an empty string", () => {
    expect(capitalize("")).toBe("");
  });
});`,
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    minutes: 8,
    blurb: "The classic: numbers, but Fizz, Buzz, and FizzBuzz.",
    brief:
      "Implement `fizzbuzz(n)`: return \"Fizz\" if n is divisible by 3, \"Buzz\" if divisible by 5, \"FizzBuzz\" if divisible by both, otherwise the number itself (as a number).",
    starterCode: `function fizzbuzz(n) {
  // your code here
}`,
    hints: [
      "Check the 'both' case (divisible by 15) FIRST, or it can never be reached.",
      "The modulo operator % gives the remainder: 9 % 3 === 0.",
      "When it isn't divisible by 3 or 5, return the number itself, not a string.",
    ],
    solution: `function fizzbuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n;
}`,
    tests: `describe("fizzbuzz", () => {
  test.each([
    [3, "Fizz"],
    [9, "Fizz"],
    [5, "Buzz"],
    [10, "Buzz"],
    [15, "FizzBuzz"],
    [30, "FizzBuzz"],
  ])("fizzbuzz(%i) -> %s", (input, expected) => {
    expect(fizzbuzz(input)).toBe(expected);
  });

  test("returns the number when nothing matches", () => {
    expect(fizzbuzz(7)).toBe(7);
    expect(fizzbuzz(1)).toBe(1);
  });
});`,
  },
  {
    slug: "is-palindrome",
    title: "Palindrome check",
    difficulty: "Easy",
    minutes: 8,
    blurb: "Reads the same forwards and backwards — ignoring case and spaces.",
    brief:
      "Implement `isPalindrome(text)`. It should ignore casing and non-letter characters. \"Race car\" and \"Never odd or even\" are palindromes.",
    starterCode: `function isPalindrome(text) {
  // your code here
}`,
    hints: [
      "Normalize first: lowercase and strip anything that isn't a-z0-9.",
      "text.toLowerCase().replace(/[^a-z0-9]/g, '') gives a clean string.",
      "Reverse with [...clean].reverse().join('') and compare.",
    ],
    solution: `function isPalindrome(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === [...clean].reverse().join("");
}`,
    tests: `describe("isPalindrome", () => {
  test("a simple palindrome", () => {
    expect(isPalindrome("racecar")).toBe(true);
  });
  test("ignores case and spaces", () => {
    expect(isPalindrome("Race car")).toBe(true);
    expect(isPalindrome("Never odd or even")).toBe(true);
  });
  test("rejects non-palindromes", () => {
    expect(isPalindrome("jester")).toBe(false);
  });
  test("an empty string is a palindrome", () => {
    expect(isPalindrome("")).toBe(true);
  });
});`,
  },
  {
    slug: "chunk",
    title: "Chunk an array",
    difficulty: "Medium",
    minutes: 12,
    blurb: "Split an array into groups of a given size.",
    brief:
      "Implement `chunk(array, size)` that splits `array` into sub-arrays of length `size`. The final chunk may be shorter. `chunk([1,2,3,4,5], 2)` → `[[1,2],[3,4],[5]]`.",
    starterCode: `function chunk(array, size) {
  // your code here
}`,
    hints: [
      "Loop with a step: for (let i = 0; i < array.length; i += size).",
      "array.slice(i, i + size) grabs one chunk.",
      "Don't mutate the input — build and return a new array.",
    ],
    solution: `function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) {
    out.push(array.slice(i, i + size));
  }
  return out;
}`,
    tests: `describe("chunk", () => {
  test("splits evenly", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });
  test("leaves a shorter final chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  test("an empty array gives an empty result", () => {
    expect(chunk([], 3)).toEqual([]);
  });
  test("does not mutate the input", () => {
    const input = [1, 2, 3];
    chunk(input, 1);
    expect(input).toEqual([1, 2, 3]);
  });
});`,
  },
  {
    slug: "create-counter",
    title: "Counter factory (closures)",
    difficulty: "Medium",
    minutes: 12,
    blurb: "Return an object that remembers its own private count.",
    brief:
      "Implement `createCounter(start = 0)` returning an object with `increment()`, `decrement()`, and `value()`. Each counter keeps its own independent state via a closure.",
    starterCode: `function createCounter(start = 0) {
  // your code here
}`,
    hints: [
      "Keep the count in a local variable inside createCounter.",
      "The returned methods 'close over' that variable, so it persists between calls.",
      "Two separate createCounter() calls must NOT share state.",
    ],
    solution: `function createCounter(start = 0) {
  let count = start;
  return {
    increment: () => { count += 1; return count; },
    decrement: () => { count -= 1; return count; },
    value: () => count,
  };
}`,
    tests: `describe("createCounter", () => {
  test("starts at 0 by default", () => {
    expect(createCounter().value()).toBe(0);
  });
  test("accepts a starting value", () => {
    expect(createCounter(10).value()).toBe(10);
  });
  test("increments and decrements", () => {
    const c = createCounter();
    c.increment();
    c.increment();
    c.decrement();
    expect(c.value()).toBe(1);
  });
  test("each counter has independent state", () => {
    const a = createCounter();
    const b = createCounter();
    a.increment();
    expect(a.value()).toBe(1);
    expect(b.value()).toBe(0);
  });
});`,
  },
  {
    slug: "debounce",
    title: "Debounce (with fake timers)",
    difficulty: "Hard",
    minutes: 15,
    blurb: "Collapse a burst of calls into one — and test it without waiting.",
    brief:
      "Implement `debounce(fn, wait)`: it returns a function that only calls `fn` after `wait` ms have passed since the LAST call. The tests use fake timers, so no real waiting happens.",
    starterCode: `function debounce(fn, wait) {
  // your code here
}`,
    hints: [
      "Keep a timer id in the closure. On each call, clearTimeout the old one.",
      "Then setTimeout a fresh call to fn after `wait` ms.",
      "Forward the arguments: setTimeout(() => fn(...args), wait).",
    ],
    solution: `function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`,
    tests: `describe("debounce", () => {
  test("fires only once after the wait", () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    const fn = debounce(spy, 100);
    fn();
    fn();
    fn();
    expect(spy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test("passes the latest arguments through", () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    const fn = debounce(spy, 50);
    fn("a");
    fn("b");
    jest.advanceTimersByTime(50);
    expect(spy).toHaveBeenCalledWith("b");
    jest.useRealTimers();
  });
});`,
  },
];

export default challenges;

export const DIFFICULTY_COLORS = {
  "Warm-up": "#7dd3fc",
  Easy: "#4ade80",
  Medium: "#ffb84c",
  Hard: "#ff8da1",
};
