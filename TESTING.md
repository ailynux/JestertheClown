# 🧪 Comprehensive Jest Testing Guide

_ add another tab

Welcome to the **Jest Testing Guide**! This guide covers everything you need to write **effective, maintainable, and robust** tests for projects using **Jest** and **React Testing Library**. 

---

## 📌 Table of Contents

- [🛠 Setup & Installation](#-setup--installation)
- [📖 Writing Your First Test](#-writing-your-first-test)
- [🧩 Testing Components](#-testing-components)
- [🔄 Mocking & Stubs](#-mocking--stubs)
- [📡 Async Testing](#-async-testing)
- [📊 Coverage Reports](#-coverage-reports)
- [🛑 Debugging Failing Tests](#-debugging-failing-tests)
- [📝 Best Practices](#-best-practices)

---

## 🛠 Setup & Installation

Ensure you have **Jest** and **React Testing Library** installed:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom ts-jest
```

For TypeScript projects, configure Jest in `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
```

---

## 📖 Writing Your First Test

Create a test file: `Button.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

Run the test suite:

```bash
npm test
```

---

## 🧩 Testing Components

### 🔹 Testing Props
```typescript
it('renders with the correct className', () => {
  const { container } = render(<Button className="primary" />);
  expect(container.firstChild).toHaveClass('primary');
});
```

### 🔹 Simulating User Events
```typescript
import userEvent from '@testing-library/user-event';

it('calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  await userEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

---

## 🔄 Mocking & Stubs

### 🔹 Mocking Functions
```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue('Mocked Value');
console.log(mockFn()); // Output: Mocked Value
```

### 🔹 Mocking API Calls
```typescript
jest.mock('../utils/api');
import { fetchUserData } from '../utils/api';

it('fetches user data successfully', async () => {
  fetchUserData.mockResolvedValue({ name: 'John Doe' });
  const userData = await fetchUserData(1);
  expect(userData.name).toBe('John Doe');
});
```

---

## 📡 Async Testing

### 🔹 Handling Promises
```typescript
it('resolves successfully', async () => {
  await expect(Promise.resolve('Success')).resolves.toBe('Success');
});
```

### 🔹 Using `findBy`
```typescript
it('renders async element', async () => {
  render(<MyComponent />);
  expect(await screen.findByText(/Loaded/)).toBeInTheDocument();
});
```

---

## 📊 Coverage Reports

Generate a test coverage report:

```bash
npm test -- --coverage
```

Set a coverage threshold in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

---

## 🛑 Debugging Failing Tests

### 🔹 Run tests in watch mode
```bash
npm test -- --watch
```

### 🔹 Debug using `.only` and `.skip`
```typescript
test.only('this test runs', () => {});
test.skip('this test is skipped', () => {});
```

### 🔹 Use `console.log` in tests
```typescript
console.log(screen.debug());
```

---

## 📝 Best Practices

- ✅ **Use Arrange-Act-Assert pattern** for clear test structure.
- ✅ **Write meaningful test names** (e.g., `should update button text when clicked`).
- ✅ **Mock external dependencies** to keep tests isolated.
- ✅ **Use `findBy` over `waitFor`** where applicable.
- ✅ **Focus on testing behavior, not implementation details.**

---

🎯 **Want to contribute?** Feel free to submit a PR to enhance the Jest testing guide! 

