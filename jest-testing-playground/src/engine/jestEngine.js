// A tiny, browser-friendly re-implementation of Jest's core API.
// It supports describe / test / it / expect (+ many matchers), the
// beforeEach / afterEach / beforeAll / afterAll hooks, and a minimal jest.fn().
//
// This is intentionally NOT the real Jest. It exists so learners can run
// real-feeling tests directly in the browser and see them pass or fail.

/* ----------------------------- equality ----------------------------- */

function isObject(value) {
  return value !== null && typeof value === "object";
}

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!isObject(a) || !isObject(b)) return false;
  if (a.constructor !== b.constructor) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (a instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !deepEqual(val, b.get(key))) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    if (a.size !== b.size) return false;
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => deepEqual(a[key], b[key]));
}

// Like deepEqual, but `b` only needs to be a subset of `a` (toMatchObject).
function matchObject(received, expected) {
  if (!isObject(received) || !isObject(expected)) {
    return deepEqual(received, expected);
  }
  return Object.keys(expected).every((key) => {
    if (isObject(expected[key]) && isObject(received[key])) {
      return matchObject(received[key], expected[key]);
    }
    return deepEqual(received[key], expected[key]);
  });
}

/* ----------------------------- printing ----------------------------- */

export function pretty(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") {
    return value._isMockFn ? "[Function: mockFn]" : `[Function: ${value.name || "anonymous"}]`;
  }
  if (typeof value === "bigint") return `${value}n`;
  if (value instanceof Error) return `[${value.name}: ${value.message}]`;
  try {
    return JSON.stringify(
      value,
      (key, val) => (typeof val === "bigint" ? `${val}n` : val),
      2
    );
  } catch {
    return String(value);
  }
}

/* --------------------------- mock functions -------------------------- */

function createMockFn(implementation) {
  let impl = implementation;
  const mockFn = function (...args) {
    mockFn.mock.calls.push(args);
    let result;
    try {
      result = impl ? impl.apply(this, args) : undefined;
      mockFn.mock.results.push({ type: "return", value: result });
    } catch (error) {
      mockFn.mock.results.push({ type: "throw", value: error });
      throw error;
    }
    return result;
  };

  mockFn._isMockFn = true;
  mockFn.mock = { calls: [], results: [] };
  mockFn.mockReturnValue = (value) => {
    impl = () => value;
    return mockFn;
  };
  mockFn.mockImplementation = (fn) => {
    impl = fn;
    return mockFn;
  };
  mockFn.mockClear = () => {
    mockFn.mock.calls = [];
    mockFn.mock.results = [];
    return mockFn;
  };

  return mockFn;
}

const jestApi = {
  fn: (impl) => createMockFn(impl),
};

/* ------------------------------ matchers ----------------------------- */

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

function buildMatchers(received, isNot) {
  const pass = (condition, message) => {
    const ok = isNot ? !condition : condition;
    if (!ok) throw new AssertionError(message());
  };

  const label = isNot ? "not." : "";

  return {
    toBe(expected) {
      pass(
        Object.is(received, expected),
        () =>
          `expect(received).${label}toBe(expected)\n\nExpected: ${pretty(expected)}\nReceived: ${pretty(received)}`
      );
    },
    toEqual(expected) {
      pass(
        deepEqual(received, expected),
        () =>
          `expect(received).${label}toEqual(expected)\n\nExpected: ${pretty(expected)}\nReceived: ${pretty(received)}`
      );
    },
    toStrictEqual(expected) {
      pass(
        deepEqual(received, expected),
        () =>
          `expect(received).${label}toStrictEqual(expected)\n\nExpected: ${pretty(expected)}\nReceived: ${pretty(received)}`
      );
    },
    toBeTruthy() {
      pass(!!received, () => `expect(received).${label}toBeTruthy()\n\nReceived: ${pretty(received)}`);
    },
    toBeFalsy() {
      pass(!received, () => `expect(received).${label}toBeFalsy()\n\nReceived: ${pretty(received)}`);
    },
    toBeNull() {
      pass(received === null, () => `expect(received).${label}toBeNull()\n\nReceived: ${pretty(received)}`);
    },
    toBeUndefined() {
      pass(received === undefined, () => `expect(received).${label}toBeUndefined()\n\nReceived: ${pretty(received)}`);
    },
    toBeDefined() {
      pass(received !== undefined, () => `expect(received).${label}toBeDefined()\n\nReceived: ${pretty(received)}`);
    },
    toBeNaN() {
      pass(Number.isNaN(received), () => `expect(received).${label}toBeNaN()\n\nReceived: ${pretty(received)}`);
    },
    toBeGreaterThan(n) {
      pass(received > n, () => `expect(received).${label}toBeGreaterThan(${pretty(n)})\n\nReceived: ${pretty(received)}`);
    },
    toBeGreaterThanOrEqual(n) {
      pass(received >= n, () => `expect(received).${label}toBeGreaterThanOrEqual(${pretty(n)})\n\nReceived: ${pretty(received)}`);
    },
    toBeLessThan(n) {
      pass(received < n, () => `expect(received).${label}toBeLessThan(${pretty(n)})\n\nReceived: ${pretty(received)}`);
    },
    toBeLessThanOrEqual(n) {
      pass(received <= n, () => `expect(received).${label}toBeLessThanOrEqual(${pretty(n)})\n\nReceived: ${pretty(received)}`);
    },
    toBeCloseTo(n, numDigits = 2) {
      const diff = Math.abs(received - n);
      const threshold = Math.pow(10, -numDigits) / 2;
      pass(diff < threshold, () => `expect(received).${label}toBeCloseTo(${pretty(n)})\n\nExpected: ${pretty(n)}\nReceived: ${pretty(received)}`);
    },
    toContain(item) {
      const ok =
        typeof received === "string"
          ? received.includes(item)
          : Array.isArray(received) && received.includes(item);
      pass(ok, () => `expect(received).${label}toContain(${pretty(item)})\n\nReceived: ${pretty(received)}`);
    },
    toContainEqual(item) {
      const ok = Array.isArray(received) && received.some((el) => deepEqual(el, item));
      pass(ok, () => `expect(received).${label}toContainEqual(${pretty(item)})\n\nReceived: ${pretty(received)}`);
    },
    toHaveLength(length) {
      pass(received != null && received.length === length, () => `expect(received).${label}toHaveLength(${length})\n\nReceived length: ${received == null ? "n/a" : received.length}\nReceived: ${pretty(received)}`);
    },
    toHaveProperty(path, value) {
      const keys = Array.isArray(path) ? path : String(path).split(".");
      let current = received;
      let exists = true;
      for (const key of keys) {
        if (current != null && key in Object(current)) {
          current = current[key];
        } else {
          exists = false;
          break;
        }
      }
      const ok = arguments.length > 1 ? exists && deepEqual(current, value) : exists;
      pass(ok, () => `expect(received).${label}toHaveProperty(${pretty(path)})\n\nReceived: ${pretty(received)}`);
    },
    toMatch(expected) {
      const ok =
        expected instanceof RegExp ? expected.test(received) : String(received).includes(expected);
      pass(ok, () => `expect(received).${label}toMatch(${pretty(expected)})\n\nReceived: ${pretty(received)}`);
    },
    toMatchObject(expected) {
      pass(matchObject(received, expected), () => `expect(received).${label}toMatchObject(expected)\n\nExpected: ${pretty(expected)}\nReceived: ${pretty(received)}`);
    },
    toThrow(expected) {
      if (typeof received !== "function") {
        throw new AssertionError(`expect(received).${label}toThrow()\n\nReceived value must be a function, got: ${pretty(received)}`);
      }
      let threw = false;
      let error;
      try {
        received();
      } catch (e) {
        threw = true;
        error = e;
      }
      let ok = threw;
      if (threw && expected !== undefined) {
        const message = error && error.message ? error.message : String(error);
        if (expected instanceof RegExp) ok = expected.test(message);
        else if (typeof expected === "string") ok = message.includes(expected);
      }
      pass(ok, () => `expect(received).${label}toThrow(${expected === undefined ? "" : pretty(expected)})\n\n${threw ? `Thrown: ${error}` : "Function did not throw"}`);
    },
    toHaveBeenCalled() {
      const ok = received && received._isMockFn && received.mock.calls.length > 0;
      pass(ok, () => `expect(mockFn).${label}toHaveBeenCalled()\n\nCalls: ${received && received._isMockFn ? received.mock.calls.length : "received is not a mock function"}`);
    },
    toHaveBeenCalledTimes(times) {
      const ok = received && received._isMockFn && received.mock.calls.length === times;
      pass(ok, () => `expect(mockFn).${label}toHaveBeenCalledTimes(${times})\n\nReceived calls: ${received && received._isMockFn ? received.mock.calls.length : "received is not a mock function"}`);
    },
    toHaveBeenCalledWith(...args) {
      const ok =
        received &&
        received._isMockFn &&
        received.mock.calls.some((call) => deepEqual(call, args));
      pass(ok, () => `expect(mockFn).${label}toHaveBeenCalledWith(${args.map(pretty).join(", ")})\n\nActual calls: ${received && received._isMockFn ? pretty(received.mock.calls) : "received is not a mock function"}`);
    },
  };
}

function expect(received) {
  const matchers = buildMatchers(received, false);
  matchers.not = buildMatchers(received, true);
  return matchers;
}

/* ------------------------------ runner ------------------------------- */

function makeSuite(name, parent) {
  return {
    name,
    parent,
    tests: [],
    children: [],
    beforeEach: [],
    afterEach: [],
    beforeAll: [],
    afterAll: [],
  };
}

// Runs a block of user-authored test code and returns structured results.
export async function runTests(code) {
  const root = makeSuite(null, null);
  let current = root;
  const logs = [];

  const describe = (name, fn) => {
    const suite = makeSuite(name, current);
    current.children.push(suite);
    const previous = current;
    current = suite;
    fn();
    current = previous;
  };

  const test = (name, fn) => {
    current.tests.push({ name, fn });
  };

  const api = {
    describe,
    test,
    it: test,
    expect,
    jest: jestApi,
    beforeEach: (fn) => current.beforeEach.push(fn),
    afterEach: (fn) => current.afterEach.push(fn),
    beforeAll: (fn) => current.beforeAll.push(fn),
    afterAll: (fn) => current.afterAll.push(fn),
    console: {
      log: (...args) => logs.push(args.map((a) => (typeof a === "string" ? a : pretty(a))).join(" ")),
      error: (...args) => logs.push(args.map((a) => (typeof a === "string" ? a : pretty(a))).join(" ")),
      warn: (...args) => logs.push(args.map((a) => (typeof a === "string" ? a : pretty(a))).join(" ")),
    },
  };

  // Phase 1: collect the suite/test tree by executing the user's code.
  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(...Object.keys(api), `"use strict";\n${code}`);
    factory(...Object.values(api));
  } catch (error) {
    return {
      ok: false,
      compileError: error.message,
      results: [],
      logs,
      summary: { passed: 0, failed: 0, total: 0 },
    };
  }

  // Phase 2: walk the tree and actually run each test with its hooks.
  const results = [];

  const ancestorHooks = (suite, key) => {
    const chain = [];
    let node = suite;
    while (node) {
      chain.unshift(...node[key]);
      node = node.parent;
    }
    return chain;
  };

  const runSuite = async (suite, namePath) => {
    for (const hook of suite.beforeAll) await hook();

    for (const t of suite.tests) {
      const beforeEachHooks = ancestorHooks(suite, "beforeEach");
      const afterEachHooks = ancestorHooks(suite, "afterEach").reverse();
      const start = performance.now();
      try {
        for (const hook of beforeEachHooks) await hook();
        await t.fn();
        for (const hook of afterEachHooks) await hook();
        results.push({
          name: t.name,
          path: namePath,
          status: "passed",
          duration: performance.now() - start,
        });
      } catch (error) {
        results.push({
          name: t.name,
          path: namePath,
          status: "failed",
          message: error.message,
          duration: performance.now() - start,
        });
      }
    }

    for (const child of suite.children) {
      await runSuite(child, [...namePath, child.name]);
    }

    for (const hook of suite.afterAll) await hook();
  };

  try {
    await runSuite(root, []);
  } catch (error) {
    return {
      ok: false,
      compileError: `Error while running tests: ${error.message}`,
      results,
      logs,
      summary: {
        passed: results.filter((r) => r.status === "passed").length,
        failed: results.filter((r) => r.status === "failed").length,
        total: results.length,
      },
    };
  }

  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return {
    ok: failed === 0 && results.length > 0,
    compileError: null,
    results,
    logs,
    summary: { passed, failed, total: results.length },
  };
}
