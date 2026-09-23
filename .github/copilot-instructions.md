# Expense approval demo

## Stack

- Node.js 24.15.0 or newer and TypeScript
- Express
- Node's built-in SQLite
- Vitest
- Playwright

## Commands

- `npm run typecheck`
- `npm run test:smoke`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:ui`
- `npm run test:e2e`

## Layout

- `src/domain`: expense and approval domain logic
- `src/api`: database and Express server
- `src/web`: browser UI
- `tests/unit`: unit tests
- `tests/integration`: API integration tests
- `tests/ui`: browser-module tests
- `tests/e2e`: Playwright tests
- `scripts`: development and validation scripts
