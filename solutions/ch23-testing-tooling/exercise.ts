import type { Equal, Expect } from '../lib/type-test';

// 23-1
export function groupBy<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    // Map#get は K が存在しなければ undefined。?? で初期化する
    const bucket = map.get(key) ?? [];
    bucket.push(item);
    map.set(key, bucket);
  }
  return map;
}

// 23-2
export function chunk<T>(items: readonly T[], size: number): T[][] {
  // size が 0 以下なら無限ループになりうる。ここでは空配列を返す方針にした
  // （throw にするのも正解。大事なのは方針を決めてテストに書くこと）
  if (size <= 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export const CHUNK_POLICY: 'throw' | 'empty' = 'empty';

// 23-3
type User = { id: number; role: 'admin' | 'user' };

export type GroupedByRole = Map<'admin' | 'user', User[]>;

export type _t1 = Expect<Equal<GroupedByRole, Map<'admin' | 'user', User[]>>>;

export type _t2 = Expect<
  Equal<ReturnType<typeof groupBy<User, 'admin' | 'user'>>, GroupedByRole>
>;

// 23-4
export function greet(name: string): string {
  return `${name}さん`;
}

// @ts-expect-error 数値は渡せない。エラーが出なくなったらこの行自体がエラーになる
greet(42);
