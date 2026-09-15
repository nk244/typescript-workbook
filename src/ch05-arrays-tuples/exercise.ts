import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 5-1: readonly 配列を受け取る
 * 引数を破壊せずに、昇順に並べた新しい配列を返してください。
 * 引数の型は readonly のまま（sort は破壊的なので直接呼べません）。
 * ============================================================ */
export function sorted(items: readonly number[]): number[] {
  const sortedItems: number[] = [...items];
  return sortedItems.sort();
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 5-2: noUncheckedIndexedAccess と付き合う
 * 配列の先頭要素を返し、空なら fallback を返してください。
 * as は使わないこと。
 * ============================================================ */
export function firstOr(items: readonly number[], fallback: number): number {
  const first = items[0];
  return first ?? fallback;
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 5-3: タプルを定義する
 * 「名前と年齢の組」を表す Person タプル型を定義してください。
 * 3 番目に「メールアドレス（省略可能）」も入れます。
 * ============================================================ */
export type Person = [name: string, age: number, email?: string];
export type _t1 = Expect<Equal<Person, [name: string, age: number, email?: string]>>;

/* ============================================================
 * 演習 5-4: as const で定数から型を作る（重要パターン）
 * ROLES を as const で固定し、そこから Role 型を導いてください。
 * ROLES の中身は書き換えないこと。
 * ============================================================ */
export const ROLES = ['admin', 'editor', 'viewer'] as const;

export type Role = (typeof ROLES)[number];

export type _t2 = Expect<Equal<Role, 'admin' | 'editor' | 'viewer'>>;

/* ============================================================
 * 演習 5-5: 実行時にも型の恩恵を受ける
 * 与えられた文字列が Role のどれかであれば true を返す型ガードです。
 * ROLES を使って実装してください（'admin' などを直接書かない）。
 * ※ 戻り値の `value is Role` は「型述語」です。第9章で詳しくやります。
 * ============================================================ */
export function isRole(value: string): value is Role {
  return ROLES.includes(value as Role);
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 5-6: enum の代替パターン
 * オブジェクト定数 LogLevel から、値のユニオン型 LogLevelValue を導いてください。
 * ============================================================ */
export const LogLevel = {
  Debug: 'debug',
  Info: 'info',
  Error: 'error',
} as const;

export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel]; // (typeof LogLevel)との違いは？どういう理屈？

export type _t3 = Expect<Equal<LogLevelValue, 'debug' | 'info' | 'error'>>;

/* ============================================================
 * 演習 5-7: タプルを返す関数
 * [商, 余り] のタプルを返す divmod を実装してください。
 * 戻り値の型注釈も自分で書くこと。
 * ============================================================ */
export function divmod(a: number, b: number): [quatient: number, remainder: number] {
  const q: number = Math.trunc(a / b);
  const r: number = a % b;
  return [q, r];
  // throw new Error('not implemented');
}

export type _t4 = Expect<Equal<ReturnType<typeof divmod>, [quotient: number, remainder: number]>>;
