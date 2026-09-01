# Expense Approval — GHCP "Meaningful Tests" demo repo

A deliberately small, layered app for the GoA GitHub Copilot Lunch & Learn
(Session 3). One requirement is traceable across **unit → integration → E2E**,
and Copilot builds quality tests at each layer by grounding in *evidence*
(coverage, the API contract, the live app) — not just better prompting.

## Stack
TypeScript · Express · built-in SQLite · Vitest (unit + integration) ·
Playwright (E2E). Node.js 22.5+ is required for the built-in SQLite API.

## Layout
```
requirements.md          # R1–R7, the yardstick
openapi.yaml             # API contract = integration ground truth
src/domain/              # business rules + colocated UNIT tests
src/api/                 # Express + SQLite + colocated INTEGRATION tests
src/web/                 # tiny web page        -> E2E layer
tests/e2e/               # R1 seed, then generated live by a Playwright agent
coverage/unit/           # unit HTML + JSON summary (generated)
coverage/integration/    # integration HTML + JSON summary (generated)
```

## Setup
```
npm install
npx playwright install     # only needed for the E2E layer
```

## Demo run order
1. **Unit** — `npm run test:unit`
   Show the colocated shallow starter tests pass but branch coverage is low and
   R2/R4–R7 are untested. Open `coverage/unit/index.html`, then feed the report
   plus `requirements.md` to Copilot and ask
   it to gap-analyze and generate meaningful, requirement-traced tests
   (including the amount **1,000** boundary — planted defect #1).
2. **Integration** — `npm run test:integration`
   The colocated seed test proves Express and a disk-backed temporary SQLite DB.
   With Copilot + `openapi.yaml`, generate tests that assert persisted DB state
   and the contract — including rejecting an **already-Approved** expense
   (planted defect #2, only visible via real state). Run
   `npm run test:integration:coverage` when coverage evidence is useful.
3. **E2E** — Run the meaningful R1 seed with `npm run test:e2e`, then start the
   app with `npm run start` and point a Playwright agent at
   http://localhost:3000. Extend the seed through **R4**: submit → Pending →
   approve → Approved. Then add the R2 validation path.

## Validation commands

```text
npm run typecheck                  # TypeScript
npm run test:unit                  # unit tests + coverage/unit
npm run test:integration           # integration tests
npm run test:integration:coverage  # integration tests + coverage/integration
npm run test:e2e                   # starts the app automatically
npm test                           # complete local validation
```

The generated `coverage/*/coverage-summary.json` files are compact evidence for
an agent; the HTML reports are the visual artifact to show during the demo.

## Starter-state requirement trace

| Requirement | Unit | Integration | E2E | Demo gap |
| --- | --- | --- | --- | --- |
| R1 submit Pending | Shallow anti-example | Seed + persisted row | Critical smoke journey | Strengthen unit assertions |
| R2 amount bounds | — | — | — | 0, 10,000, and invalid values |
| R3 categories | — | — | — | Valid enum and invalid category |
| R4 approve Pending | — | — | — | Domain, persisted API, browser journey |
| R5 no self-approval | — | — | — | Error and unchanged persisted state |
| R6 Manager over 1,000 | — | — | — | 1,000/1,000.01 boundary |
| R7 reject once with reason | — | — | — | Empty reason and already-decided guard |

This table is intentionally incomplete at the start. Update it after each agent
loop to make requirement coverage—not only line coverage—the visible score.

## Planted defects (for the payoff)
1. `requiresManager()` uses `amount >= 1000`; R6 says **over** 1,000. The
   exact-1,000 boundary is untested by the starter tests.
2. `reject()` is missing the guard against deciding a non-Pending expense; the
   integration layer catches it via persisted state.

## Users (for segregation-of-duties, R5)
Submitter = `alice`, approver = `bob`. Use the **Approve as** dropdown to
approve as `Manager` for amounts over 1,000 (R6).
