# Expense Approval

An expense submission and approval application with a starter test harness.

## Stack
TypeScript · Express · built-in SQLite · Vitest (unit + integration) ·
Playwright (E2E). Node.js 22.5+ is required for the built-in SQLite API.

## Layout
```
specs/                    # Test-planning workspace
src/domain/               # Business rules
src/api/                  # Express and SQLite
src/web/                  # Browser interface
scripts/                  # Smoke validation
tests/                    # Unit, integration, UI, and E2E test tiers
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
npm run test:smoke                 # real app smoke test
npm run test:unit                  # unit tests + coverage/unit
npm run test:integration           # integration tests
npm run test:integration:coverage  # integration tests + coverage/integration
npm run test:ui                    # UI module tests
npm run test:e2e                   # starts the app automatically
npm test                           # complete local validation
```

Coverage reports are written to `coverage/unit` and `coverage/integration`.

## Users (for segregation-of-duties)
Use the current-user selector to switch between `submitter-001`,
`approver-001`, and `manager-001`.
