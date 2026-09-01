# Expense Approval

An expense submission and approval application with domain, API, and browser
test coverage.

## Stack
TypeScript · Express · built-in SQLite · Vitest (unit + integration) ·
Playwright (E2E). Node.js 22.5+ is required for the built-in SQLite API.

## Layout
```
specs/expense-approval.md # Functional requirements
openapi.yaml              # API contract
src/domain/               # Business rules and unit tests
src/api/                  # Express, SQLite, and integration tests
src/web/                  # Browser interface
tests/e2e/                # Playwright tests
coverage/unit/            # Generated unit coverage
coverage/integration/     # Generated integration coverage
```

## Setup
```
npm install
npx playwright install
```

## Run the application

```text
npm run start
```

Open http://localhost:3000.

## Validation commands

```text
npm run typecheck                  # TypeScript
npm run test:unit                  # unit tests + coverage/unit
npm run test:integration           # integration tests
npm run test:integration:coverage  # integration tests + coverage/integration
npm run test:e2e                   # starts the app automatically
npm test                           # complete local validation
```

Coverage reports are written to `coverage/unit` and `coverage/integration`.

## Users (for segregation-of-duties, R5)
Submitter = `alice`, approver = `bob`. Use the **Approve as** dropdown to
approve as `Manager` for amounts over 1,000 (R6).
