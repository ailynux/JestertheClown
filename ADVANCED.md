# Advanced Jest Testing Patterns

## Table of Contents
- [Custom Test Environments](#custom-test-environments)
- [Advanced Mocking Strategies](#advanced-mocking-strategies)
- [Testing Complex Async Operations](#testing-complex-async-operations)
- [Performance Testing](#performance-testing)
- [Integration Testing Patterns](#integration-testing-patterns)

## Custom Test Environments

### Creating a Custom Environment
```javascript
class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.testPath = config.testPath;
  }

  async setup() {
    await super.setup();
    // Set up custom global state
    this.global.customGlobal = function() {
      return 'custom value';
    };
  }

  async teardown() {
    // Clean up custom state
    this.global.customGlobal = null;
    await super.teardown();
  }
}

module.exports = CustomEnvironment;
```

### Using Test Environment in Jest Config
```javascript
module.exports = {
  testEnvironment: './custom-environment.js'
};
```

## Advanced Mocking Strategies

### Partial Module Mocks
```javascript
// userService.js
import { db } from './database';

export const userService = {
  async getUser(id) {
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
  },
  async updateUser(id, data) {
    return db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
  }
};

// userService.test.js
jest.mock('./database', () => ({
  db: {
    query: jest.fn()
  }
}));

describe('userService', () => {
  test('getUser should handle complex queries', async () => {
    const mockUser = { id: 1, name: 'Test' };
    const { db } = require('./database');
    
    db.query.mockImplementationOnce((query, params) => {
      expect(query).toMatch(/SELECT.*FROM users/);
      expect(params).toContain(1);
      return Promise.resolve(mockUser);
    });

    const result = await userService.getUser(1);
    expect(result).toEqual(mockUser);
  });
});
```

## Testing Complex Async Operations

### Testing Race Conditions
```javascript
describe('Race Condition Tests', () => {
  test('should handle concurrent operations correctly', async () => {
    const promiseA = slowOperation();
    const promiseB = fastOperation();
    
    const results = await Promise.all([promiseA, promiseB]);
    
    expect(results[0]).toBe('slow');
    expect(results[1]).toBe('fast');
  });
});
```

### Testing with Timers
```javascript
describe('Timer-based Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test('debounced function called once', () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 1000);

    // Simulate multiple rapid calls
    for (let i = 0; i < 5; i++) {
      debounced();
    }

    // Fast-forward time
    jest.runAllTimers();
    
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

## Performance Testing

### Response Time Assertions
```javascript
describe('Performance Tests', () => {
  test('API call should complete within 100ms', async () => {
    const start = performance.now();
    await apiCall();
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
});
```

### Memory Usage Testing
```javascript
describe('Memory Tests', () => {
  test('should not leak memory', () => {
    const getHeapUsage = () => process.memoryUsage().heapUsed;
    const initialMemory = getHeapUsage();
    
    // Perform operations
    heavyOperation();
    
    // Force garbage collection if --expose-gc flag is used
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = getHeapUsage();
    const diff = finalMemory - initialMemory;
    
    expect(diff).toBeLessThan(1000000); // Less than 1MB difference
  });
});
```

## Integration Testing Patterns

### API Integration Tests
```javascript
describe('API Integration', () => {
  const api = new API({
    baseURL: process.env.TEST_API_URL,
    timeout: 5000
  });

  test('complete user workflow', async () => {
    // Create user
    const user = await api.users.create({
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(user.id).toBeDefined();

    // Update user
    const updated = await api.users.update(user.id, {
      name: 'Updated Name'
    });
    expect(updated.name).toBe('Updated Name');

    // Delete user
    await api.users.delete(user.id);
    
    // Verify deletion
    await expect(api.users.get(user.id)).rejects.toThrow();
  });
});
```

### Database Integration
```javascript
describe('Database Integration', () => {
  let connection;
  
  beforeAll(async () => {
    connection = await createTestDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  test('should handle transaction rollback', async () => {
    const transaction = await connection.transaction();
    
    try {
      await transaction.execute('INSERT INTO users (name) VALUES (?)', ['Test']);
      await transaction.execute('INSERT INTO invalid_table (x) VALUES (?)', [1]);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }

    const result = await connection.query('SELECT * FROM users WHERE name = ?', ['Test']);
    expect(result.length).toBe(0);
  });
});
```

## Advanced Tips

1. Use `jest.isolateModules()` for testing modules with side effects
2. Implement custom matchers for domain-specific assertions
3. Use snapshot serializers for complex objects
4. Leverage test.each for data-driven tests
5. Implement custom test reporters for specialized output

## Best Practices

1. Keep test setups isolated and reproducible
2. Mock external dependencies consistently
3. Use typed mocks with TypeScript for better type safety
4. Implement retry logic for flaky tests
5. Use separate configs for unit and integration tests
