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
  // Asymmetric matchers (expect.any, expect.objectContaining, ...) can appear on
  // either side; let them decide the match against the concrete value.
  if (b && b._isAsymmetric) return b.asymmetricMatch(a);
  if (a && a._isAsymmetric) return a.asymmetricMatch(b);

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
    const e = expected[key];
    if (e && e._isAsymmetric) return e.asymmetricMatch(received[key]);
    if (isObject(e) && isObject(received[key])) {
      return matchObject(received[key], e);
    }
    return deepEqual(received[key], e);
  });
}

/* ----------------------- asymmetric matchers ----------------------- */

function makeAsymmetric(asymmetricMatch, toStr) {
  return { _isAsymmetric: true, asymmetricMatch, toString: () => toStr, label: toStr };
}

function matchesType(constructor, actual) {
  if (constructor === Number) return typeof actual === "number" || actual instanceof Number;
  if (constructor === String) return typeof actual === "string" || actual instanceof String;
  if (constructor === Boolean) return typeof actual === "boolean";
  if (constructor && constructor.name === "BigInt") return typeof actual === "bigint";
  if (constructor === Function) return typeof actual === "function";
  if (constructor === Symbol) return typeof actual === "symbol";
  if (constructor === Object) return actual !== null && typeof actual === "object";
  if (constructor === Array) return Array.isArray(actual);
  return actual != null && actual instanceof constructor;
}

const asymmetricMatchers = {
  any: (constructor) =>
    makeAsymmetric(
      (actual) => matchesType(constructor, actual),
      `Any<${(constructor && constructor.name) || "?"}>`
    ),
  anything: () =>
    makeAsymmetric((actual) => actual !== null && actual !== undefined, "Anything"),
  arrayContaining: (sample) =>
    makeAsymmetric(
      (actual) =>
        Array.isArray(actual) &&
        sample.every((s) => actual.some((a) => deepEqual(a, s))),
      `ArrayContaining ${pretty(sample)}`
    ),
  objectContaining: (sample) =>
    makeAsymmetric((actual) => matchObject(actual, sample), `ObjectContaining ${pretty(sample)}`),
  stringContaining: (sub) =>
    makeAsymmetric(
      (actual) => typeof actual === "string" && actual.includes(sub),
      `StringContaining ${pretty(sub)}`
    ),
  stringMatching: (re) =>
    makeAsymmetric(
      (actual) => typeof actual === "string" && (re instanceof RegExp ? re.test(actual) : actual.includes(re)),
      `StringMatching ${pretty(re)}`
    ),
};

/* ----------------------------- printing ----------------------------- */

export function pretty(value) {
  if (value && value._isAsymmetric) return value.label;
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
  const onceQueue = [];
  const mockFn = function (...args) {
    mockFn.mock.calls.push(args);
    const activeImpl = onceQueue.length ? onceQueue.shift() : impl;
    let result;
    try {
      result = activeImpl ? activeImpl.apply(this, args) : undefined;
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
  mockFn.mockReturnValueOnce = (value) => {
    onceQueue.push(() => value);
    return mockFn;
  };
  mockFn.mockImplementation = (fn) => {
    impl = fn;
    return mockFn;
  };
  mockFn.mockImplementationOnce = (fn) => {
    onceQueue.push(fn);
    return mockFn;
  };
  mockFn.mockResolvedValue = (value) => {
    impl = () => Promise.resolve(value);
    return mockFn;
  };
  mockFn.mockRejectedValue = (value) => {
    impl = () => Promise.reject(value);
    return mockFn;
  };
  mockFn.mockClear = () => {
    mockFn.mock.calls = [];
    mockFn.mock.results = [];
    return mockFn;
  };
  mockFn.mockReset = () => {
    mockFn.mockClear();
    impl = undefined;
    onceQueue.length = 0;
    return mockFn;
  };

  return mockFn;
}

/* --------------------------- fake modules --------------------------- */

// Built-in "modules" learners can require() and mock, so module-mocking can be
// taught without a real bundler. Each factory returns a fresh copy of exports.
const defaultModules = {
  "./greeter": () => ({
    greet: (name) => `Hello, ${name}!`,
    shout: (name) => `HEY ${String(name).toUpperCase()}!!!`,
  }),
  "./api": () => ({
    fetchUser: (id) => Promise.resolve({ id, name: "Ada Lovelace" }),
    fetchUsers: () =>
      Promise.resolve([
        { id: 1, name: "Ada" },
        { id: 2, name: "Grace" },
      ]),
  }),
  "./mathlib": () => ({
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    double: (n) => n * 2,
  }),
  "./logger": () => ({
    log: () => {},
    warn: () => {},
  }),
};

// Auto-mock: every function export becomes a jest.fn() returning undefined.
function autoMock(realExports) {
  const mocked = {};
  for (const key of Object.keys(realExports)) {
    mocked[key] = typeof realExports[key] === "function" ? createMockFn() : realExports[key];
  }
  return mocked;
}

const jestApi = {
  fn: (impl) => createMockFn(impl),
  // Replace obj[method] with a mock that still calls the original by default.
  spyOn: (obj, method) => {
    const original = obj[method];
    if (typeof original !== "function") {
      throw new Error(`Cannot spy on ${String(method)}: it is not a function`);
    }
    const mock = createMockFn(function (...args) {
      return original.apply(this, args);
    });
    mock.mockRestore = () => {
      obj[method] = original;
      return mock;
    };
    obj[method] = mock;
    return mock;
  },
  clearAllMocks: () => {},
};

/* ------------------------------ matchers ----------------------------- */

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

// Set by the runner before each test so toMatchSnapshot() knows where it is.
let snapshotCtx = null;

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
    toBeInstanceOf(constructor) {
      const ok = typeof constructor === "function" && received instanceof constructor;
      pass(ok, () => `expect(received).${label}toBeInstanceOf(${(constructor && constructor.name) || pretty(constructor)})\n\nReceived: ${pretty(received)}`);
    },
    toMatchSnapshot() {
      const serialized = pretty(received);
      // No snapshot store wired up (e.g. used outside the runner) — just pass.
      if (!snapshotCtx) return;
      const idx = (snapshotCtx.counts[snapshotCtx.testKey] =
        (snapshotCtx.counts[snapshotCtx.testKey] || 0) + 1);
      const key = `${snapshotCtx.testKey} ${idx}`;

      if (!(key in snapshotCtx.store)) {
        snapshotCtx.store[key] = serialized;
        snapshotCtx.written.push(key);
        return; // first run: record + pass
      }
      const prev = snapshotCtx.store[key];
      pass(
        prev === serialized,
        () =>
          `expect(received).${label}toMatchSnapshot()\n\nSnapshot name: ${key}\n\n- Snapshot\n+ Received\n\n- ${prev}\n+ ${serialized}`
      );
    },
  };
}

// Matcher names, derived once so the async wrappers stay in sync automatically.
const MATCHER_NAMES = Object.keys(buildMatchers(undefined, false));

// Builds .resolves / .rejects: await the promise, then run the normal matcher
// against the resolved value (or the thrown error, for rejects).
function buildAsyncMatchers(received, isNot, isRejects) {
  const wrap = {};
  for (const name of MATCHER_NAMES) {
    wrap[name] = async (...args) => {
      let value;
      let threw = false;
      let err;
      try {
        value = await received;
      } catch (e) {
        threw = true;
        err = e;
      }
      if (isRejects) {
        if (!threw) {
          throw new AssertionError(
            `expect(received).rejects.${name}()\n\nExpected the promise to reject, but it resolved to: ${pretty(value)}`
          );
        }
        const target = name === "toThrow" ? () => { throw err; } : err;
        return buildMatchers(target, isNot)[name](...args);
      }
      if (threw) {
        throw new AssertionError(
          `expect(received).resolves.${name}()\n\nExpected the promise to resolve, but it rejected with: ${pretty(err)}`
        );
      }
      return buildMatchers(value, isNot)[name](...args);
    };
  }
  return wrap;
}

function expect(received) {
  const matchers = buildMatchers(received, false);
  matchers.not = buildMatchers(received, true);
  matchers.resolves = buildAsyncMatchers(received, false, false);
  matchers.resolves.not = buildAsyncMatchers(received, true, false);
  matchers.rejects = buildAsyncMatchers(received, false, true);
  matchers.rejects.not = buildAsyncMatchers(received, true, true);
  return matchers;
}

// Asymmetric matchers live on expect itself: expect.any(String), etc.
expect.any = asymmetricMatchers.any;
expect.anything = asymmetricMatchers.anything;
expect.arrayContaining = asymmetricMatchers.arrayContaining;
expect.objectContaining = asymmetricMatchers.objectContaining;
expect.stringContaining = asymmetricMatchers.stringContaining;
expect.stringMatching = asymmetricMatchers.stringMatching;

/* ---------------------------- fake timers ---------------------------- */

// A minimal, deterministic timer system. When fake timers are on, the user's
// setTimeout/setInterval calls are queued instead of really scheduled, and the
// learner advances "time" manually with jest.advanceTimersByTime / runAllTimers.
function createTimerManager() {
  let fake = null; // { queue, now, nextId }

  const enabled = () => fake !== null;

  const drainUntil = (targetTime) => {
    let guard = 0;
    while (true) {
      const due = fake.queue
        .filter((t) => t.time <= targetTime)
        .sort((a, b) => a.time - b.time);
      if (due.length === 0) break;
      const timer = due[0];
      fake.now = timer.time;
      if (timer.type === "interval") {
        timer.time += timer.delay; // reschedule before running
      } else {
        fake.queue = fake.queue.filter((t) => t.id !== timer.id);
      }
      timer.fn(...timer.args);
      if (++guard > 10000) throw new Error("Too many timer callbacks (possible infinite loop)");
    }
    fake.now = targetTime;
  };

  return {
    useFake: () => { fake = { queue: [], now: 0, nextId: 1 }; },
    useReal: () => { fake = null; },
    clearAll: () => { if (fake) fake.queue = []; },
    setTimeout: (fn, delay = 0, ...args) => {
      if (!enabled()) return setTimeout(fn, delay, ...args);
      const id = fake.nextId++;
      fake.queue.push({ id, fn, args, time: fake.now + delay, type: "timeout" });
      return id;
    },
    setInterval: (fn, delay = 0, ...args) => {
      if (!enabled()) return setInterval(fn, delay, ...args);
      const id = fake.nextId++;
      fake.queue.push({ id, fn, args, time: fake.now + delay, delay, type: "interval" });
      return id;
    },
    clearTimeout: (id) => {
      if (!enabled()) return clearTimeout(id);
      fake.queue = fake.queue.filter((t) => t.id !== id);
    },
    clearInterval: (id) => {
      if (!enabled()) return clearInterval(id);
      fake.queue = fake.queue.filter((t) => t.id !== id);
    },
    advanceBy: (ms) => { if (enabled()) drainUntil(fake.now + ms); },
    runAll: () => {
      if (!enabled()) return;
      let guard = 0;
      while (fake.queue.length) {
        const max = Math.max(...fake.queue.map((t) => t.time));
        drainUntil(max);
        if (++guard > 1000) break;
      }
    },
    runOnlyPending: () => {
      if (!enabled()) return;
      const max = fake.queue.length ? Math.max(...fake.queue.map((t) => t.time)) : fake.now;
      drainUntil(max);
    },
  };
}

/* --------------------------- snapshot store -------------------------- */

const SNAPSHOT_KEY = "jest-carnival-snapshots";

function loadSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSnapshots(store) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota / unavailable storage */
  }
}

export function clearSnapshots() {
  try {
    localStorage.removeItem(SNAPSHOT_KEY);
  } catch {
    /* ignore */
  }
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

  const timers = createTimerManager();

  // Snapshot store is persisted across runs so re-running can detect changes.
  const snapStore = loadSnapshots();
  const snap = { store: snapStore, counts: {}, written: [], testKey: "" };

  // Per-run module registry for require() + jest.mock().
  const moduleMocks = {};
  const resolveModule = (path) => {
    if (path in moduleMocks) return moduleMocks[path];
    if (path in defaultModules) return defaultModules[path]();
    throw new Error(
      `Cannot find module '${path}'. Available demo modules: ${Object.keys(defaultModules).join(", ")}`
    );
  };
  const requireActual = (path) => {
    if (path in defaultModules) return defaultModules[path]();
    throw new Error(`Cannot find module '${path}'`);
  };

  const jest = {
    ...jestApi,
    useFakeTimers: () => timers.useFake(),
    useRealTimers: () => timers.useReal(),
    clearAllTimers: () => timers.clearAll(),
    advanceTimersByTime: (ms) => timers.advanceBy(ms),
    runAllTimers: () => timers.runAll(),
    runOnlyPendingTimers: () => timers.runOnlyPending(),
    mock: (path, factory) => {
      if (factory) {
        moduleMocks[path] = factory();
      } else if (path in defaultModules) {
        moduleMocks[path] = autoMock(defaultModules[path]());
      } else {
        moduleMocks[path] = {};
      }
    },
    unmock: (path) => {
      delete moduleMocks[path];
    },
    requireActual,
  };

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

  // test.each(table)(name, fn) — runs the test once per row. Each row may be an
  // array (spread as arguments) or a single value. Supports %s/%d/%i/%p/%# in
  // the test name.
  const formatEachName = (name, args, index) => {
    let i = 0;
    let out = name.replace(/%[sdipf#]/g, (token) => {
      if (token === "%#") return String(index);
      const a = args[i++];
      return typeof a === "string" ? a : pretty(a);
    });
    if (i === 0) out = `${name} [${args.map(pretty).join(", ")}]`;
    return out;
  };
  const makeEach = () => (table) => (name, fn) => {
    table.forEach((row, index) => {
      const args = Array.isArray(row) ? row : [row];
      current.tests.push({
        name: formatEachName(name, args, index),
        fn: () => fn(...args),
      });
    });
  };
  test.each = makeEach();

  const logLine = (level) => (...args) =>
    logs.push({
      level,
      text: args.map((a) => (typeof a === "string" ? a : pretty(a))).join(" "),
    });

  const api = {
    describe,
    test,
    it: test,
    expect,
    jest,
    beforeEach: (fn) => current.beforeEach.push(fn),
    afterEach: (fn) => current.afterEach.push(fn),
    beforeAll: (fn) => current.beforeAll.push(fn),
    afterAll: (fn) => current.afterAll.push(fn),
    require: resolveModule,
    setTimeout: timers.setTimeout,
    clearTimeout: timers.clearTimeout,
    setInterval: timers.setInterval,
    clearInterval: timers.clearInterval,
    console: {
      log: logLine("log"),
      info: logLine("info"),
      error: logLine("error"),
      warn: logLine("warn"),
      debug: logLine("log"),
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
  snapshotCtx = snap;

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
      snap.testKey = [...namePath, t.name].join(" > ");
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

  let runError = null;
  try {
    await runSuite(root, []);
  } catch (error) {
    runError = error;
  } finally {
    saveSnapshots(snapStore);
    snapshotCtx = null;
    timers.useReal();
  }

  const snapshots = { written: snap.written.length };

  if (runError) {
    return {
      ok: false,
      compileError: `Error while running tests: ${runError.message}`,
      results,
      logs,
      snapshots,
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
    snapshots,
    summary: { passed, failed, total: results.length },
  };
}
