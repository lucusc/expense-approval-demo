# Copilot instructions — Expense Approval demo

When generating tests, treat `requirements.md` as the source of truth (spec-driven,
per Lunch & Learn Session 1). Rules:

- Every test must trace to a requirement ID (R1–R7); name or comment the test with it.
- Prefer meaningful assertions on behavior and error messages over `toBeDefined()`
  / "does not throw" checks. No tautologies. Do not over-mock the unit under test.
- Cover edge and error paths, including boundaries (e.g. amount exactly 0, exactly
  1,000, and exactly 10,000) and workflow guards (deciding an already-decided expense).
- Unit tests are colocated in `src/domain`. Integration tests are colocated in
  `src/api`, exercise the real Express app against a disk-backed temporary SQLite
  DB, and assert persisted state + the `openapi.yaml` contract. E2E tests use
  Playwright against the running app at http://localhost:3000.
- Use `npm run test:unit` for unit branch coverage and
  `npm run test:integration:coverage` for integration coverage. Treat the JSON
  summaries and failing output as evidence for the next test-generation pass.
