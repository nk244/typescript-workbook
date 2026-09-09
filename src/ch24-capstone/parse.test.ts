import { describe, expect, it } from 'vitest';
import { parseTasks } from './parse';

const valid = {
  id: 'a1',
  title: '買い物',
  priority: 'high',
  done: false,
  createdAt: '2024-05-01T00:00:00.000Z',
};

describe('parseTasks', () => {
  it('正しい配列をパースする', () => {
    const result = parseTasks([valid]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value[0]?.title).toBe('買い物');
    expect(result.value[0]?.createdAt).toBeInstanceOf(Date);
    expect(result.value[0]?.createdAt.toISOString()).toBe('2024-05-01T00:00:00.000Z');
  });

  it('空配列も通る', () => {
    expect(parseTasks([])).toEqual({ ok: true, value: [] });
  });

  it('配列でなければエラー', () => {
    expect(parseTasks({})).toEqual({ ok: false, error: 'expected array' });
    expect(parseTasks(null)).toEqual({ ok: false, error: 'expected array' });
  });

  it('要素の形が違えば位置つきでエラー', () => {
    expect(parseTasks([valid, { ...valid, priority: 'urgent' }])).toEqual({
      ok: false,
      error: 'invalid task at 1',
    });
    expect(parseTasks([{ ...valid, done: 'yes' }])).toEqual({
      ok: false,
      error: 'invalid task at 0',
    });
    expect(parseTasks([{ ...valid, createdAt: 'not-a-date' }])).toEqual({
      ok: false,
      error: 'invalid task at 0',
    });
  });
});
