# Expense Approval

A compact expense submission and approval application built for testing
workflows and demonstrations.

## Stack

- TypeScript and Express
- Node.js built-in SQLite
- Plain HTML and JavaScript
- Vitest and Playwright

Node.js 24 is recommended.

## Setup

```powershell
npm ci
npx playwright install chromium
```

## Run the application

```powershell
npm run start
```

Open <http://localhost:3000>. The application uses synthetic identities such
as `submitter-001`, `approver-001`, and `manager-001`.

## Test commands

| Command | Purpose |
|---|---|
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm run test:smoke` | Start the real application and verify the stack |
| `npm run test:unit` | Run unit tests with coverage |
| `npm run test:integration` | Run API integration tests |
| `npm run test:integration:coverage` | Run API integration tests with coverage |
| `npm run test:ui` | Run browser-module integration tests |
| `npm run test:e2e` | Run the Playwright browser suite |
| `npm run test:coverage` | Run unit and API coverage |
| `npm test` | Run the standard local validation sequence |

## Layout

```text
src/domain/    Domain model and policies
src/api/       Express server and SQLite persistence
src/web/       Browser interface
scripts/       Stack smoke checks
tests/         Automated test suites and shared test data
specs/         Test-planning workspace
```
