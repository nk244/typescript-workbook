import { describe, expect, it } from 'vitest';
import { divmod, firstOr, isRole, LogLevel, ROLES, sorted } from './exercise';

describe('5-1 sorted', () => {
  it('昇順に並べる', () => expect(sorted([3, 1, 2])).toEqual([1, 2, 3]));
  it('元の配列を壊さない', () => {
    const src = [3, 1, 2];
    sorted(src);
    expect(src).toEqual([3, 1, 2]);
  });
});

describe('5-2 firstOr', () => {
  it('先頭', () => expect(firstOr([5, 6], 0)).toBe(5));
  it('空なら fallback', () => expect(firstOr([], -1)).toBe(-1));
});

describe('5-4/5-5 ROLES と isRole', () => {
  it('ROLES の中身', () => expect(ROLES).toEqual(['admin', 'editor', 'viewer']));
  it('含まれる', () => expect(isRole('admin')).toBe(true));
  it('含まれない', () => expect(isRole('root')).toBe(false));
});

describe('5-6 LogLevel', () => {
  it('値が取れる', () => expect(LogLevel.Info).toBe('info'));
});

describe('5-7 divmod', () => {
  it('商と余り', () => expect(divmod(7, 2)).toEqual([3, 1]));
  it('割り切れる', () => expect(divmod(8, 4)).toEqual([2, 0]));
});
