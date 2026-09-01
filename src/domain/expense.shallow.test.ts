import { describe, it, expect } from 'vitest';
import { submit } from './expense';

/**
 * STARTER "shallow" tests — intentionally weak. These are the ones you critique
 * live in the session. They pass, and coverage looks green-ish, but they prove
 * almost nothing:
 *   - they only assert that *something* is returned (tautology),
 *   - they only touch the happy path for submit(),
 *   - they never exercise R2 bounds, R4-R7, or the 1000 boundary.
 *
 * The unit demo replaces/augments these with meaningful, requirement-traced
 * tests generated with Copilot from requirements.md + the coverage report.
 */
describe('expense (shallow starter tests)', () => {
  it('R1 anti-example: submit returns something', () => {
    expect(submit({ amount: 500, category: 'Travel', submitterId: 'alice' })).toBeDefined();
  });

  it('R1 anti-example: submit sets a truthy status', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    expect(e.status).toBeTruthy();
  });
});
