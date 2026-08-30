import { describe, it, expect } from 'vitest';
import { sortByDateDesc, formatDate } from '../src/lib/essays';

describe('sortByDateDesc', () => {
  it('sorts newest first', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-03-01') } };
    const c = { data: { date: new Date('2025-12-01') } };
    expect(sortByDateDesc([a, b, c]).map(x => x.data.date.getTime()))
      .toEqual([b.data.date.getTime(), a.data.date.getTime(), c.data.date.getTime()]);
  });
  it('does not mutate the input', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-03-01') } };
    const input = [a, b];
    sortByDateDesc(input);
    expect(input[0]).toBe(a);
  });
});

describe('formatDate', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(formatDate(new Date('2026-08-30'))).toBe('2026-08-30');
  });
});
