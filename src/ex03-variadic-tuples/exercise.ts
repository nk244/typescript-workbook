import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 ex03-1: タプルの分解
 * ============================================================ */
export type Head<T extends readonly unknown[]> = unknown; // TODO
export type Tail<T extends readonly unknown[]> = unknown; // TODO
export type Last<T extends readonly unknown[]> = unknown; // TODO

export type _t1 = Expect<Equal<Head<[1, 2, 3]>, 1>>;
export type _t2 = Expect<Equal<Tail<[1, 2, 3]>, [2, 3]>>;
export type _t3 = Expect<Equal<Last<[1, 2, 3]>, 3>>;
export type _t4 = Expect<Equal<Tail<[]>, never>>;

/* ============================================================
 * 演習 ex03-2: タプルの合成
 * ============================================================ */
export type Push<T extends readonly unknown[], V> = unknown; // TODO
export type Concat<A extends readonly unknown[], B extends readonly unknown[]> = unknown; // TODO

export type _t5 = Expect<Equal<Push<[1, 2], 3>, [1, 2, 3]>>;
export type _t6 = Expect<Equal<Concat<[1], [2, 3]>, [1, 2, 3]>>;

/* ============================================================
 * 演習 ex03-3: Mapped Type でタプルの形を保つ
 * すべての要素の Promise を剥がした型を作ってください（タプルのままにすること）。
 * ============================================================ */
export type AwaitAll<T extends readonly unknown[]> = unknown; // TODO

export type _t7 = Expect<Equal<AwaitAll<[Promise<string>, Promise<number>]>, [string, number]>>;
export type _t8 = Expect<Equal<AwaitAll<[string, Promise<boolean>]>, [string, boolean]>>;

/* ============================================================
 * 演習 ex03-4: シグネチャを保つラッパー
 * fn を呼ぶ前後で計測する withTiming を実装してください。
 *   - 引数と戻り値の型は元の関数のまま
 *   - 呼び出しにかかったミリ秒を onDone に渡す
 * ============================================================ */
export function withTiming(fn: unknown, onDone: (ms: number) => void): unknown {
  // TODO: シグネチャをジェネリックにして実装する
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex03-5: 第 1 引数を束縛する
 * bindFirst(fn, first) は「残りの引数だけを取る関数」を返します。
 * ============================================================ */
export function bindFirst(fn: unknown, first: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex03-6: pipe の結果型
 * 関数を左から順に適用したときの最終的な戻り値型を求める型を作ってください。
 * ============================================================ */
export type PipeResult<Fns extends readonly unknown[], In> = unknown; // TODO

export type _t9 = Expect<
  Equal<PipeResult<[(n: number) => string, (s: string) => boolean], number>, boolean>
>;
export type _t10 = Expect<Equal<PipeResult<[], number>, number>>;

/* ============================================================
 * 演習 ex03-7: pipe の実装
 * 型は 2 引数版だけ用意してあります（実務でもオーバーロードで並べることが多い）。
 * 実装を書いてください。
 * ============================================================ */
export function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  throw new Error('not implemented');
}
