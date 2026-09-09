import { describe, expect, it } from 'vitest';
import { assertNever, countItems, describeValue, displayName } from './exercise';

describe('2-1 describeValue', () => {
  it('string は大文字に', () => expect(describeValue('abc')).toBe('ABC'));
  it('number は文字列に', () => expect(describeValue(42)).toBe('42'));
  it('その他は不明', () => {
    expect(describeValue(null)).toBe('不明');
    expect(describeValue({})).toBe('不明');
    expect(describeValue(true)).toBe('不明');
  });
});

describe('2-2 displayName', () => {
  it('値があればそのまま', () => expect(displayName('西尾')).toBe('西尾'));
  it('null/undefined/空文字は名無し', () => {
    expect(displayName(null)).toBe('名無し');
    expect(displayName(undefined)).toBe('名無し');
    expect(displayName('')).toBe('名無し');
  });
});

describe('2-3 assertNever', () => {
  it('必ず投げる', () => expect(() => assertNever('だめ')).toThrow('だめ'));
});

describe('2-5 countItems', () => {
  it('配列なら要素数', () => expect(countItems([1, 2, 3])).toBe(3));
  it('配列でなければ 0', () => {
    expect(countItems(null)).toBe(0);
    expect(countItems('abc')).toBe(0);
    expect(countItems(undefined)).toBe(0);
  });
});
