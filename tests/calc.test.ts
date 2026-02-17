import { describe, expect, test } from 'vitest';
import { calculateFairSplit } from '@/lib/calc';

describe('calculateFairSplit', () => {
  test('calculates base fair split and keeps total matched', () => {
    const result = calculateFairSplit({
      total: 30000,
      people: 6,
      drinkers: 3,
      cups: 6,
      cupPrice: 500,
    });

    expect(result.nondrinkerPay).toBe(3500);
    expect(result.drinkerPay).toBe(6500);
    expect(result.drinkerPayPlusOneCount).toBe(0);
    expect(result.totalCheck).toBe(30000);
  });

  test('distributes rounding remainder to drinkers first', () => {
    const result = calculateFairSplit({
      total: 10001,
      people: 4,
      drinkers: 2,
      cups: 1,
      cupPrice: 500,
    });

    expect(result.nondrinkerPay).toBe(2250);
    expect(result.drinkerPay).toBe(2750);
    expect(result.drinkerPayPlusOneCount).toBe(1);
    expect(result.totalCheck).toBe(10001);
  });

  test('works when drinkers is zero', () => {
    const result = calculateFairSplit({
      total: 10000,
      people: 3,
      drinkers: 0,
      cups: 0,
      cupPrice: 500,
    });

    expect(result.nondrinkerPay).toBe(3333);
    expect(result.totalCheck).toBe(10000);
  });

  test('validates invalid ranges', () => {
    expect(() =>
      calculateFairSplit({
        total: 1000,
        people: 3,
        drinkers: 4,
        cups: 1,
        cupPrice: 500,
      }),
    ).toThrow('drinkers must be between 0 and people.');
  });
});
