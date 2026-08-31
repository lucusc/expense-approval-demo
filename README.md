# Expense Approval — GHCP "Meaningful Tests" demo repo

A deliberately small, layered app for the GoA GitHub Copilot Lunch & Learn
(Session 3). One requirement is traceable across **unit → integration → E2E**,
and Copilot builds quality tests at each layer by grounding in *evidence*
(coverage, the API contract, the live app) — not just better prompting.

## Stack
TypeScript · Express · SQLite (better-sqlite3) · Vitest (unit + integration) ·
Playwright (E2E).

## Layout
```
requirements.md          # R1–R7, the yardstick
openapi.yaml             # API contract = integration ground truth
src/domain/              # pure business rules  -> UNIT layer
src/api/                 # Express + SQLite     -> INTEGRATION layer
src/web/                 # tiny web page        -> E2E layer
tests/unit/              # starter SHALLOW tests (critique these live)
tests/integration/       # seed harness; expand live with Copilot
tests/e2e/               # generated live by a Playwright agent
```

## Setup
```
npm install
npx playwright install     # only needed for the E2E layer
```

## Demo run order
1. **Unit** — `npm run test:unit`
   Show the shallow starter tests pass but branch coverage is low and R2/R4–R7
   are untested. Feed the coverage report + `requirements.md` to Copilot and ask
   it to gap-analyze and generate meaningful, requirement-traced tests
   (including the amount **1,000** boundary — planted defect #1).
2. **Integration** — `npm run test:integration`
   Seed test proves the harness. With Copilot + `openapi.yaml`, generate tests
   that assert persisted DB state and the contract — including rejecting an
   **already-Approved** expense (planted defect #2, only visible via real state).
3. **E2E** — `npm run start`, then a Playwright agent against
   http://localhost:3000. Start from **R4**: submit → Pending → approve →
   Approved. Then add the R2 validation path.

## Planted defects (for the payoff)
1. `requiresManager()` uses `amount > 1000`; the exact-1,000 boundary is
   ambiguous vs the policy wording and untested by the starter tests.
2. `reject()` is missing the guard against deciding a non-Pending expense; the
   integration layer catches it via persisted state.

## Users (for segregation-of-duties, R5)
Submitter = `alice`, approver = `bob`. Use the **Approve as** dropdown to
approve as `Manager` for amounts over 1,000 (R6).
