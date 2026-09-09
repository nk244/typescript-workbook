import { describe, expect, it, vi } from 'vitest';
import {
  CAN_ASSIGN_FEWER_ARGS,
  CAN_ASSIGN_MORE_ARGS,
  CAN_ASSIGN_RETURNING_VALUE,
  greet,
  len,
  myMap,
  notEmpty,
  once,
} from './exercise';

describe('6-1 notEmpty', () => {
  it('空でなければ true', () => expect((notEmpty as (v: string) => boolean)('a')).toBe(true));
  it('空なら false', () => expect((notEmpty as (v: string) => boolean)('')).toBe(false));
});

describe('6-2 greet', () => {
  it('通常', () => expect(greet({ name: 'ken' })).toBe('ken さん'));
  it('丁寧', () => expect(greet({ name: 'ken', polite: true })).toBe('ken 様'));
  it('false は通常', () => expect(greet({ name: 'ken', polite: false })).toBe('ken さん'));
});

describe('6-3 once', () => {
  it('1 回しか呼ばれない', () => {
    const spy = vi.fn(() => 42);
    const wrapped = once(spy);
    expect(wrapped()).toBe(42);
    expect(wrapped()).toBe(42);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('6-4 myMap', () => {
  it('変換する', () => expect(myMap([1, 2, 3], (n) => n * 2)).toEqual([2, 4, 6]));
  it('インデックスも渡る', () => expect(myMap(['a', 'b'], (s, i) => `${i}:${s}`)).toEqual(['0:a', '1:b']));
});

describe('6-5 len', () => {
  it('文字列', () => expect(len('hello')).toBe(5));
  it('配列', () => expect(len(['ab', 'cde'])).toBe(5));
});

describe('6-6 代入互換性', () => {
  it('引数が少ないのは OK', () => expect(CAN_ASSIGN_FEWER_ARGS).toBe(true));
  it('引数が多いのは NG', () => expect(CAN_ASSIGN_MORE_ARGS).toBe(false));
  it('void 期待に値を返す関数は OK', () => expect(CAN_ASSIGN_RETURNING_VALUE).toBe(true));
});
