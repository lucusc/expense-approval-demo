# Expense Withdrawal (Cancel a Pending Expense)

## Overview & user story

Submitters sometimes file an expense by mistake (wrong amount, wrong category, or a
duplicate). Today the only way out is for an approver to reject it, which leaves a
misleading "Rejected" record. This feature lets the submitter withdraw their own
expense while it is still awaiting a decision.

> As a submitter, I want to withdraw my own expense while it is still Pending, so that
> a mistaken submission never has to be rejected by an approver.

## Rules

1. Only an expense with status `Pending` can be withdrawn. Any other status
   (`Approved`, `Rejected`, `Cancelled`) is a workflow conflict.
2. Only the submitter may withdraw their own expense. Any other user — including a
   Manager — is a workflow conflict.
3. Withdrawal moves the expense to the new terminal status `Cancelled`.
4. `Cancelled` is terminal: a cancelled expense can no longer be approved or rejected.
   This falls out of the existing `status !== 'Pending'` guard in `approve()`.
5. Withdrawal records no `approverId` and no `reason`; those fields are left unchanged.

## Domain change

In `src/domain/expense.ts`:

- Extend the `Status` union with `'Cancelled'`:
  `export type Status = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';`
- Add a `cancel(expense: Expense, user: User): Expense` function that mirrors the
  guard style of `approve()`:
  - throws `WorkflowError('Only a Pending expense can be withdrawn')` when
    `expense.status !== 'Pending'`;
  - throws `WorkflowError('Only the submitter can withdraw their own expense')` when
    `user.id !== expense.submitterId`;
  - otherwise returns `{ ...expense, status: 'Cancelled' }` (pure, no mutation).

## API

`POST /expenses/:id/cancel`

- Request body: `{ "userId": string }`
- `200` with the updated expense on success.
- `404 { "error": "Not found" }` when no expense has that id (same pre-check as
  `/approve` and `/reject`).
- Domain failures are surfaced through the existing `handleError` mapping:
  `WorkflowError` -> `409`, `ValidationError` -> `400`, anything else -> `500`.
- The updated row is persisted with `db.update(...)` before responding.

## Acceptance criteria

- [ ] `Status` includes `'Cancelled'`.
- [ ] `cancel(expense, user)` exists, is pure, and mirrors the `approve()` guard style.
- [ ] `cancel` throws `WorkflowError` when the expense is not `Pending`.
- [ ] `cancel` throws `WorkflowError` when the caller is not the submitter.
- [ ] `POST /expenses/:id/cancel` returns `200` and persists `status: 'Cancelled'`.
- [ ] `POST /expenses/:id/cancel` returns `404` for an unknown id.
- [ ] `POST /expenses/:id/cancel` returns `409` for a non-submitter caller.
- [ ] Unit tests cover `cancel`: success, non-Pending, wrong user.
- [ ] Integration test covers the endpoint end to end against the real app + SQLite.
- [ ] `openapi.yaml` documents the endpoint, a `CancelInput` schema, and the extended
      `Status` enum.
- [ ] The full `npm test` suite passes.

## Files likely to change

- `src/domain/expense.ts` — `Status` union and the `cancel()` function.
- `src/api/server.ts` — the `POST /expenses/:id/cancel` route.
- `src/domain/expense.test.ts` — unit tests for `cancel()`.
- `src/api/server.integration.test.ts` — integration test for the endpoint.
- `openapi.yaml` — endpoint, `CancelInput`, `Status` enum.
- `specs/expense-withdrawal.md` — this document.

## Out of scope

- Any web UI for withdrawal (`src/web/`) and related end-to-end tests.
- Un-cancelling / restoring a cancelled expense.
- Authentication or authorization beyond the `userId` supplied in the body.
- Withdrawal after a decision has been made, or manager overrides.
- Audit history, timestamps, or notifications.
