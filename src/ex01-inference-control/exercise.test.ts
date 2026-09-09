import { describe, expect, it } from 'vitest';
import { cast, createLight, defineRoutes, withDefault } from './exercise';

describe('ex01-2 createLight', () => {
  it('候補にある色を選べる', () => expect(createLight(['red', 'green'], 'green')).toBe('green'));
});

describe('ex01-3 withDefault', () => {
  // NoInfer を付けると fallback は推論元にならないので、
  // T を決めたいときは呼び出し側で明示するか、value 側から決まるようにする
  it('値があればそれ', () => expect(withDefault<string>('a', 'b')).toBe('a'));
  it('undefined なら fallback', () => expect(withDefault<string>(undefined, 'b')).toBe('b'));
});

describe('ex01-4 defineRoutes', () => {
  it('先頭を返す', () => expect(defineRoutes(['/home', '/about'])).toBe('/home'));
});

describe('ex01-6 cast', () => {
  it('値をそのまま返す', () => {
    const toUser = (cast as () => (input: unknown) => { id: number })();
    expect(toUser({ id: 1 })).toEqual({ id: 1 });
  });
});
