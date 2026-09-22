/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  mutate: ['src/domain/approval.ts'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.unit.config.mts',
  },
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress'],
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
};
