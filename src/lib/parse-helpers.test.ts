import { describe, it, expect } from 'vitest';
import { parseAmount, parseDate } from './parse-helpers';

describe('parseAmount', () => {
  it('parses simple number string', () => {
    expect(parseAmount('-75.50')).toBe(-75.5);
    expect(parseAmount('1800')).toBe(1800);
  });

  it('parses European format (1.234,56)', () => {
    expect(parseAmount('1.234,56')).toBe(1234.56);
    expect(parseAmount('-75,50')).toBe(-75.5);
  });

  it('parses US format (1,234.56)', () => {
    expect(parseAmount('1,234.56')).toBe(1234.56);
    expect(parseAmount('1,234')).toBe(1234);
  });

  it('returns null for invalid input', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount(null)).toBeNull();
  });

  it('accepts number type', () => {
    expect(parseAmount(42)).toBe(42);
    expect(parseAmount(-10.5)).toBe(-10.5);
  });

  it('strips euro symbol from amount', () => {
    expect(parseAmount('984,51€')).toBe(984.51);
    expect(parseAmount('-7,30€')).toBe(-7.3);
    expect(parseAmount('1.009,61€')).toBe(1009.61);
  });
});

describe('parseDate', () => {
  it('parses ISO date', () => {
    const d = parseDate('2024-01-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2024);
    expect(d!.getMonth()).toBe(0);
    expect(d!.getDate()).toBe(15);
  });

  it('parses DD/MM/YYYY', () => {
    expect(parseDate('15/01/2024')).toEqual(new Date(2024, 0, 15));
  });

  it('parses DD-MM-YYYY', () => {
    expect(parseDate('16-01-2024')).toEqual(new Date(2024, 0, 16));
  });

  it('returns null for invalid', () => {
    expect(parseDate('')).toBeNull();
    expect(parseDate('not a date')).toBeNull();
    expect(parseDate(null)).toBeNull();
  });
});
