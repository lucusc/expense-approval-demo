import { describe, it, expect } from 'vitest';
import { submit } from './expense';


describe('expense tests', () => {
  it('submit returns something', () => {
    expect(submit({ amount: 500, category: 'Travel', submitterId: 'alice' })).toBeDefined();
  });

  it('submit sets a truthy status', () => {
    const e = submit({ amount: 500, category: 'Meals', submitterId: 'alice' });
    expect(e.status).toBeTruthy();
  });
});
