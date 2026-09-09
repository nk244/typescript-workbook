import { describe, expect, it } from 'vitest';
import { last, longest, pick, pluck, Stack } from './exercise';

describe('8-1 last', () => {
  it('最後の要素', () => expect(last([1, 2, 3])).toBe(3));
  it('空なら undefined', () => expect(last([])).toBeUndefined());
});

describe('8-2 longest', () => {
  it('文字列', () => expect(longest('abc', 'de')).toBe('abc'));
  it('配列', () => expect(longest([1], [2, 3])).toEqual([2, 3]));
});

describe('8-3 pluck', () => {
  it('値を取り出す', () => {
    const user = { name: 'ken', age: 30 };
    expect(pluck(user, 'name')).toBe('ken');
    expect(pluck(user, 'age')).toBe(30);
  });
});

describe('8-4 pick', () => {
  it('選んだキーだけ', () => {
    const user = { name: 'ken', age: 30, secret: 'x' };
    expect(pick(user, ['name', 'age'])).toEqual({ name: 'ken', age: 30 });
  });
  it('空配列なら空オブジェクト', () => {
    expect(pick({ a: 1 }, [])).toEqual({});
  });
});

describe('8-5 Stack', () => {
  it('LIFO で動く', () => {
    const s = new Stack<number>();
    expect(s.size).toBe(0);
    s.push(1);
    s.push(2);
    expect(s.size).toBe(2);
    expect(s.peek()).toBe(2);
    expect(s.pop()).toBe(2);
    expect(s.pop()).toBe(1);
    expect(s.pop()).toBeUndefined();
  });
});
