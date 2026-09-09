import type { Equal, Expect } from '../lib/type-test';

// 2-1
export function describeValue(value: unknown): string {
  if (typeof value === 'string') return value.toUpperCase();
  if (typeof value === 'number') return String(value);
  return '不明';
}

// 2-2
export function displayName(name: string | null | undefined): string {
  // 空文字も既定値に倒したいので、ここは ?? ではなく || が正解
  return name || '名無し';
}

// 2-3
export function assertNever(message: string): never {
  throw new Error(message);
}

// 2-4
// [] で囲む理由は第12章（Conditional Types）で説明します。今は気にしなくて OK。
type Assignable<A, B> = [A] extends [B] ? true : false;

export type _t1 = Expect<Equal<Assignable<42, number>, true>>;
export type _t2 = Expect<Equal<Assignable<number, 42>, false>>;
// never は空集合なので、あらゆる型の部分集合。よって代入できる
export type _t3 = Expect<Equal<Assignable<never, string>, true>>;
// unknown は全体集合なので、あらゆる型を受け取れる
export type _t4 = Expect<Equal<Assignable<string, unknown>, true>>;

// 2-5
export function countItems(input: unknown): number {
  if (Array.isArray(input)) return input.length;
  return 0;
}
