import type { Equal, Expect } from '../lib/type-test';

// 6-1
export type Validator = (value: string) => boolean;

// 型注釈が先にあるので、value の型は書かなくても string と推論される
export const notEmpty: Validator = (value) => value.length > 0;

export type _t1 = Expect<Equal<Validator, (value: string) => boolean>>;

// 6-2
export function greet(options: { name: string; polite?: boolean }): string {
  return options.polite === true ? `${options.name} 様` : `${options.name} さん`;
}

// 6-3
export function once<T>(fn: () => T): () => T {
  let called = false;
  let result: T;
  return () => {
    if (!called) {
      result = fn();
      called = true;
    }
    return result;
  };
}

// 6-4
export function myMap<T, U>(items: readonly T[], fn: (item: T, index: number) => U): U[] {
  // 手で for を回すと noUncheckedIndexedAccess のせいで items[i] が T | undefined に
  // なってしまう。map を使えばその問題自体が起きない（要素は必ず存在する）
  return items.map((item, index) => fn(item, index));
}

// 6-5
export function len(input: string): number;
export function len(input: string[]): number;

export function len(input: string | string[]): number {
  if (typeof input === 'string') return input.length;
  return input.reduce((acc, s) => acc + s.length, 0);
}

export type _t2 = Expect<Equal<ReturnType<typeof len>, number>>;

// 6-6
type Handler = (event: string, index: number) => void;

// 呼び出し側が渡した引数を無視するのは安全なので許される
export const CAN_ASSIGN_FEWER_ARGS: boolean = true;
// 呼び出し側が渡さない引数を要求するのは危険なので許されない
export const CAN_ASSIGN_MORE_ARGS: boolean = false;
// void 期待の場所では戻り値は捨てられるだけなので許される
export const CAN_ASSIGN_RETURNING_VALUE: boolean = true;

export type _unusedHandler = Handler;
