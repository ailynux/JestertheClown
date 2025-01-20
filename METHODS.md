# Jest Methods Documentation

Welcome to the **Jest Methods Documentation**! 
-- need to add more 
---

## Table of Contents

- [Installation](#installation)
- [Basic Methods](#basic-methods)
  - [`test` and `it`](#test-and-it)
  - [`expect`](#expect)
- [Matchers](#matchers)
  - [Common Matchers](#common-matchers)
  - [Truthiness](#truthiness)
  - [Numbers](#numbers)
  - [Strings](#strings)
  - [Arrays and Iterables](#arrays-and-iterables)
  - [Objects](#objects)
- [Mock Functions](#mock-functions)
  - [`jest.fn`](#jestfn)
  - [`jest.spyOn`](#jestspyon)
- [Setup and Teardown](#setup-and-teardown)
  - [`beforeEach` and `afterEach`](#beforeeach-and-aftereach)
  - [`beforeAll` and `afterAll`](#beforeall-and-afterall)
- [Asynchronous Code Testing](#asynchronous-code-testing)
  - [Promises](#promises)
  - [Async/Await](#asyncawait)
  - [Callbacks](#callbacks)
- [Advanced Features](#advanced-features)
  - [Snapshots](#snapshots)
  - [Timers](#timers)
  - [Custom Matchers](#custom-matchers)

---

## Installation

Install Jest using npm or yarn:

```bash
npm install --save-dev jest
# or
yarn add --dev jest
```

Add a test script to your `package.json`:

```json
"scripts": {
  "test": "jest"
}
```

Run your tests:

```bash
npm test
```

---

## Basic Methods

### `test` and `it`

Use `test` or `it` to define a test case.

```javascript
test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

it('multiplies 2 * 3 to equal 6', () => {
  expect(2 * 3).toBe(6);
});
```

### `expect`

`expect` is used to create assertions. Combine it with matchers to validate values.

---

## Matchers

### Common Matchers

```javascript
test('object assignment', () => {
  const data = { one: 1 };
  data['two'] = 2;
  expect(data).toEqual({ one: 1, two: 2 });
});
```

### Truthiness

```javascript
test('null values', () => {
  const value = null;
  expect(value).toBeNull();
  expect(value).toBeDefined();
  expect(value).not.toBeUndefined();
  expect(value).not.toBeTruthy();
  expect(value).toBeFalsy();
});
```

### Numbers

```javascript
test('numeric comparisons', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(4);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4);
});
```

### Strings

```javascript
test('string matching', () => {
  expect('team').not.toMatch(/I/);
  expect('Christoph').toMatch(/stop/);
});
```

### Arrays and Iterables

```javascript
test('array contains', () => {
  const shoppingList = ['diapers', 'kleenex', 'trash bags'];
  expect(shoppingList).toContain('kleenex');
});
```

### Objects

```javascript
test('object properties', () => {
  const data = { name: 'Jest' };
  expect(data).toHaveProperty('name', 'Jest');
});
```

---

## Mock Functions

### `jest.fn`

Create mock functions for testing.

```javascript
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
```

### `jest.spyOn`

Spy on existing methods.

```javascript
const obj = { method: () => 'Hello' };
const spy = jest.spyOn(obj, 'method');
obj.method();
expect(spy).toHaveBeenCalled();
```

---

## Setup and Teardown

### `beforeEach` and `afterEach`

Run code before and after each test.

```javascript
beforeEach(() => {
  initializeDatabase();
});

afterEach(() => {
  clearDatabase();
});
```

### `beforeAll` and `afterAll`

Run code once before and after all tests.

```javascript
beforeAll(() => {
  connectToDatabase();
});

afterAll(() => {
  disconnectFromDatabase();
});
```

---

## Asynchronous Code Testing

### Promises

```javascript
test('resolves to "data"', () => {
  return expect(Promise.resolve('data')).resolves.toBe('data');
});
```

### Async/Await

```javascript
test('async function', async () => {
  const data = await fetchData();
  expect(data).toBe('Hello');
});
```

### Callbacks

```javascript
test('callback function', done => {
  fetchData((data) => {
    expect(data).toBe('Hello');
    done();
  });
});
```

---

## Advanced Features

### Snapshots

```javascript
test('matches snapshot', () => {
  const tree = renderComponent();
  expect(tree).toMatchSnapshot();
});
```

### Timers

```javascript
jest.useFakeTimers();

test('delayed function', () => {
  const callback = jest.fn();
  setTimeout(callback, 1000);
  jest.runAllTimers();
  expect(callback).toHaveBeenCalled();
});
```

### Custom Matchers

Add your own matchers using `expect.extend`.

```javascript
expect.extend({
  toBeEven(received) {
    const pass = received % 2 === 0;
    return {
      pass,
      message: () => `expected ${received} to be even`,
    };
  },
});

test('even number', () => {
  expect(4).toBeEven();
});
```

---

## Conclusion

Jest is a powerful testing framework that simplifies writing, organizing, and maintaining tests. This guide covered the most commonly used Jest methods and features. Explore [Jest's official documentation](https://jestjs.io/docs/getting-started) for further details.

