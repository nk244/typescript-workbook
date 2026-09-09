import { describe, expect, it } from 'vitest';
import { CHUNK_POLICY, chunk, groupBy } from './exercise';

describe('23-1 groupBy', () => {
  const users = [
    { id: 1, role: 'admin' },
    { id: 2, role: 'user' },
    { id: 3, role: 'admin' },
  ] as const;

  it('キーごとにまとめる', () => {
    const result = groupBy(users, (u) => u.role);
    expect(result.get('admin')).toEqual([users[0], users[2]]);
    expect(result.get('user')).toEqual([users[1]]);
  });

  it('出現順を保つ', () => {
    const result = groupBy([3, 1, 2, 4], (n) => n % 2);
    expect([...result.keys()]).toEqual([1, 0]);
    expect(result.get(1)).toEqual([3, 1]);
  });

  it('空配列なら空の Map', () => {
    expect(groupBy([], (n: number) => n).size).toBe(0);
  });

  it('存在しないキーは undefined', () => {
    expect(groupBy([1], (n) => n).get(99)).toBeUndefined();
  });
});

describe('23-2 chunk', () => {
  it('割り切れる', () => expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]));
  it('余りがある', () => expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]));
  it('size が要素数より大きい', () => expect(chunk([1], 5)).toEqual([[1]]));
  it('空配列', () => expect(chunk([], 2)).toEqual([]));

  it('size が 0 以下のときの方針が実装と一致している', () => {
    if (CHUNK_POLICY === 'throw') {
      expect(() => chunk([1, 2], 0)).toThrow();
    } else {
      expect(chunk([1, 2], 0)).toEqual([]);
    }
  });
});
