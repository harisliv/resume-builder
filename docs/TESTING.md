# Testing Setup

## Test Framework

- **Vitest** for test runner
- **jsdom** environment for DOM testing
- **Testing Library** for React component testing
- **MSW** (Mock Service Worker) for API mocking

## Test File Organization

- Test files are located in `__tests__/` directories
- Co-locate tests with the code they test when possible
- Setup file: `tests/setupTests.ts`

## Configuration

See `vitest.config.ts` for full configuration:

- Path aliases configured to match `tsconfig.json`
- jsdom environment for browser-like testing
- Global test utilities available

## Testing Patterns

- Use Testing Library queries for component interaction
- Mock external dependencies and API calls with MSW
- Test user interactions, not implementation details

## AI Workflow Mocking

- Set `MOCK_AI=true` to force AI suggestion/improve flows to return deterministic mock payloads instead of calling model providers
- `NEXT_PUBLIC_TESTING_FEATURES=true` also enables the same mock AI path for local testing
- In mock mode, AI attempts are not consumed
