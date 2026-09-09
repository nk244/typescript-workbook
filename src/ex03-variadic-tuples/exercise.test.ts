import { describe, expect, it, vi } from 'vitest';
import { bindFirst, pipe, withTiming } from './exercise';

describe('ex03-4 withTiming', () => {
  it('元の関数と同じ結果を返す', () => {
    const onDone = vi.fn();
    const add = (a: number, b: number) => a + b;
    const timed = withTiming(add, onDone) as (a: number, b: number) => number;
    expect(timed(1, 2)).toBe(3);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(typeof onDone.mock.calls[0]?.[0]).toBe('number');
  });
});

describe('ex03-5 bindFirst', () => {
  it('第 1 引数を固定する', () => {
    const greet = (greeting: string, name: string) => `${greeting}, ${name}`;
    const hello = bindFirst(greet, 'Hello') as (name: string) => string;
    expect(hello('ken')).toBe('Hello, ken');
  });
});

describe('ex03-7 pipe', () => {
  it('左から順に適用する', () => {
    const f = pipe(
      (n: number) => `${n}`,
      (s: string) => s.length,
    );
    expect(f(1234)).toBe(4);
  });
});
