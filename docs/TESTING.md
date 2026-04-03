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
- For complex UI flows like `components/MatchJob`, prefer one main integration test file plus a few focused child-component tests for risky seams like selection state, tabs, and accessibility behavior
- When testing confirm flows, mock `useWarningDialog()` directly instead of mounting the provider unless provider behavior is the subject under test
- For modal workflows with success + cancel exits, add one regression test for the success-close path so discard-confirm logic does not accidentally fire after a completed action
- When refactoring multi-step flows, add a regression test that the canonical review surface stays singular, so removed intermediate modals do not creep back in
- For targeted loading states, test both sides: the selected row shows loading, and unrelated surfaces remain visible
- When a flow uses `useWarningDialog()` for a final confirm step, assert the exact dialog payload (`title`, `description`, `confirmLabel`, `variant`) in the feature test

## AI Workflow Mocking

- Set `MOCK_AI=true` to force AI suggestion/improve flows to return deterministic mock payloads instead of calling model providers
- `NEXT_PUBLIC_TESTING_FEATURES=true` also enables the same mock AI path for local testing
- In mock mode, AI attempts are not consumed
