import { describe, expect, test } from 'vitest';
import { calculate } from '@/lib/calc';

describe('calculate', () => {
  test('adds numbers', () => {
    expect(calculate(2, 3, 'add')).toBe(5);
  });

  test('subtracts numbers', () => {
    expect(calculate(7, 2, 'subtract')).toBe(5);
  });

  test('multiplies numbers', () => {
    expect(calculate(4, 3, 'multiply')).toBe(12);
  });

  test('divides numbers', () => {
    expect(calculate(12, 4, 'divide')).toBe(3);
  });

  test('throws on divide by zero', () => {
    expect(() => calculate(5, 0, 'divide')).toThrow('Cannot divide by zero.');
  });
});
