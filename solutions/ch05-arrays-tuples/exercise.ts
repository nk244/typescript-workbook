import type { Equal, Expect } from '../lib/type-test';

// 5-1
export function sorted(items: readonly number[]): number[] {
  // sort は破壊的なので、まずコピーしてから並べ替える
  // （Node 20+ / ES2023 なら items.toSorted((a, b) => a - b) でもよい）
  return [...items].sort((a, b) => a - b);
}

// 5-2
export function firstOr(items: readonly number[], fallback: number): number {
  return items[0] ?? fallback;
}

// 5-3
export type Person = [name: string, age: number, email?: string];

export type _t1 = Expect<Equal<Person, [name: string, age: number, email?: string]>>;

// 5-4
export const ROLES = ['admin', 'editor', 'viewer'] as const;

// typeof ROLES は readonly ['admin', 'editor', 'viewer']
// [number] でその要素型（＝3 つのユニオン）を取り出す
export type Role = (typeof ROLES)[number];

export type _t2 = Expect<Equal<Role, 'admin' | 'editor' | 'viewer'>>;

// 5-5
export function isRole(value: string): value is Role {
  // readonly ('admin'|...)[] に対する includes は引数型が厳しいので
  // string[] として扱えるよう readonly string[] に一度広げる
  return (ROLES as readonly string[]).includes(value);
}

// 5-6
export const LogLevel = {
  Debug: 'debug',
  Info: 'info',
  Error: 'error',
} as const;

// keyof typeof LogLevel は 'Debug' | 'Info' | 'Error'（キー側）
// それでインデックスアクセスすると値側のユニオンになる
export type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];

export type _t3 = Expect<Equal<LogLevelValue, 'debug' | 'info' | 'error'>>;

// 5-7
export function divmod(a: number, b: number): [quotient: number, remainder: number] {
  return [Math.floor(a / b), a % b];
}

export type _t4 = Expect<Equal<ReturnType<typeof divmod>, [quotient: number, remainder: number]>>;
