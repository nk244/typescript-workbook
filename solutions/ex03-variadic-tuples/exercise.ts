import type { Equal, Expect } from '../lib/type-test';

// ex03-1
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]]
  ? H
  : never;
export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R]
  ? R
  : never;
// 先頭が可変長でもマッチできる
export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L]
  ? L
  : never;

export type _t1 = Expect<Equal<Head<[1, 2, 3]>, 1>>;
export type _t2 = Expect<Equal<Tail<[1, 2, 3]>, [2, 3]>>;
export type _t3 = Expect<Equal<Last<[1, 2, 3]>, 3>>;
export type _t4 = Expect<Equal<Tail<[]>, never>>;

// ex03-2
export type Push<T extends readonly unknown[], V> = [...T, V];
export type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];

export type _t5 = Expect<Equal<Push<[1, 2], 3>, [1, 2, 3]>>;
export type _t6 = Expect<Equal<Concat<[1], [2, 3]>, [1, 2, 3]>>;

// ex03-3
// Mapped Type はタプルに対しては「各位置」に適用されるので、長さと順序が保たれる
export type AwaitAll<T extends readonly unknown[]> = { [K in keyof T]: Awaited<T[K]> };

export type _t7 = Expect<Equal<AwaitAll<[Promise<string>, Promise<number>]>, [string, number]>>;
export type _t8 = Expect<Equal<AwaitAll<[string, Promise<boolean>]>, [string, boolean]>>;

// ex03-4
export function withTiming<F extends (...args: never[]) => unknown>(
  fn: F,
  onDone: (ms: number) => void,
): (...args: Parameters<F>) => ReturnType<F> {
  return (...args) => {
    const started = performance.now();
    try {
      // 引数タプルをそのまま渡す。F の引数型と Parameters<F> は同じものだが、
      // ジェネリックのままでは compiler が同一視できないので一度 never[] に落とす
      return fn(...(args as never[])) as ReturnType<F>;
    } finally {
      onDone(performance.now() - started);
    }
  };
}

// ex03-5
export function bindFirst<A, Rest extends unknown[], R>(
  fn: (first: A, ...rest: Rest) => R,
  first: A,
): (...rest: Rest) => R {
  return (...rest) => fn(first, ...rest);
}

// ex03-6
export type PipeResult<Fns extends readonly unknown[], In> = Fns extends readonly [
  (arg: In) => infer Out,
  ...infer Rest,
]
  ? PipeResult<Rest, Out>
  : In;

export type _t9 = Expect<
  Equal<PipeResult<[(n: number) => string, (s: string) => boolean], number>, boolean>
>;
export type _t10 = Expect<Equal<PipeResult<[], number>, number>>;

// ex03-7
export function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a));
}
