import type { Equal, Expect } from '../lib/type-test';

// 8-1
export function last<T>(items: readonly T[]): T | undefined {
  return items[items.length - 1];
}

export type _t1 = Expect<Equal<ReturnType<typeof last<number>>, number | undefined>>;

// 8-2
export function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// 8-3
// K を keyof T に制約すると、戻り値を T[K] として「キーに対応する値の型」で返せる
export function pluck<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 8-4
export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): { [P in K]: T[P] } {
  const out = {} as { [P in K]: T[P] };
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}

// 8-5
export class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  get size(): number {
    return this.#items.length;
  }
}

// 8-6
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export type _t2 = Expect<
  Equal<Result<number>, { ok: true; value: number } | { ok: false; error: Error }>
>;
export type _t3 = Expect<
  Equal<Result<string, string>, { ok: true; value: string } | { ok: false; error: string }>
>;

// 8-7
// T が引数にしか現れないので、型引数には何の役目もない
export function debugLog(value: unknown): void {
  void value;
}
