import type { Equal, Expect } from '../lib/type-test';

// 12-1
export type IsArray<T> = T extends readonly unknown[] ? true : false;

export type _t1 = Expect<Equal<IsArray<string[]>, true>>;
export type _t2 = Expect<Equal<IsArray<string>, false>>;

// 12-2
type ToArray<T> = T extends unknown ? T[] : never;

// 裸の型引数なのでユニオンの各メンバーに分配される
export type Distributed = string[] | number[];

export type _t3 = Expect<Equal<ToArray<string | number>, Distributed>>;

// 12-3
// [T] で包むと「裸ではなくなる」ので分配が起きない
export type ToArraySafe<T> = [T] extends [unknown] ? T[] : never;

export type _t4 = Expect<Equal<ToArraySafe<string | number>, (string | number)[]>>;

// 12-4
export type MyExclude<T, U> = T extends U ? never : T;

export type _t5 = Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, 'b' | 'c'>>;
export type _t6 = Expect<Equal<MyExclude<string | null, null>, string>>;

// 12-5
export type ElementOf<T> = T extends readonly (infer U)[] ? U : never;

export type _t7 = Expect<Equal<ElementOf<boolean[]>, boolean>>;
export type _t8 = Expect<Equal<ElementOf<number>, never>>;

// 12-6
export type MyReturnType<F> = F extends (...args: never[]) => infer R ? R : never;

export type _t9 = Expect<Equal<MyReturnType<() => string>, string>>;
export type _t10 = Expect<Equal<MyReturnType<(a: number) => void>, void>>;

// 12-7
export type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;

export type _t11 = Expect<Equal<MyAwaited<Promise<string>>, string>>;
export type _t12 = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
export type _t13 = Expect<Equal<MyAwaited<boolean>, boolean>>;

// 12-8
// T extends never だと never が「空のユニオン」として分配され、結果も never になってしまう。
// [T] で包んで分配を止めるのが定石
export type IsNever<T> = [T] extends [never] ? true : false;

export type _t14 = Expect<Equal<IsNever<never>, true>>;
export type _t15 = Expect<Equal<IsNever<string>, false>>;
// never | string は string に潰れるので false
export type _t16 = Expect<Equal<IsNever<never | string>, false>>;

// 12-9
export type Reverse<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : [];

export type _t17 = Expect<Equal<Reverse<[1, 2, 3]>, [3, 2, 1]>>;
export type _t18 = Expect<Equal<Reverse<[]>, []>>;

// 12-10
// 引数リストごと infer で取り出してから、タプルとして先頭を見るのが安全。
// (first: infer A, ...) の形で直接マッチさせると、引数 0 個の関数も
// 「引数が少ないほうは代入可能」の規則でマッチしてしまう
export type FirstParameter<F> = F extends (...args: infer P) => unknown
  ? P extends [infer A, ...unknown[]]
    ? A
    : never
  : never;

export type _t19 = Expect<Equal<FirstParameter<(name: string, age: number) => void>, string>>;
export type _t20 = Expect<Equal<FirstParameter<() => void>, never>>;
