import { describe, it, expect } from 'vitest';
import { essaySchema } from '../src/lib/schemas';

describe('essaySchema', () => {
  it('accepts a valid essay', () => {
    const r = essaySchema.safeParse({ title: '你好', date: '2026-08-30', tags: ['随笔'] });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.date).toBeInstanceOf(Date);
  });
  it('rejects a missing title', () => {
    expect(essaySchema.safeParse({ date: '2026-08-30' }).success).toBe(false);
  });
  it('rejects an invalid date', () => {
    expect(essaySchema.safeParse({ title: 'x', date: 'not-a-date' }).success).toBe(false);
  });
});
