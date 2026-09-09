import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 12-1: 条件型の基本
 * T が配列なら true、そうでなければ false を返す型を作ってください。
 * ============================================================ */
export type IsArray<T> = unknown; // TODO

export type _t1 = Expect<Equal<IsArray<string[]>, true>>;
export type _t2 = Expect<Equal<IsArray<string>, false>>;

/* ============================================================
 * 演習 12-2: 分配を体験する
 * 次の型が何になるか予想して書いてください。
 *   type ToArray<T> = T extends unknown ? T[] : never;
 *   ToArray<string | number> は？
 * ============================================================ */
type ToArray<T> = T extends unknown ? T[] : never;

export type Distributed = unknown; // TODO: ToArray<string | number> の結果を書く

export type _t3 = Expect<Equal<ToArray<string | number>, Distributed>>;

/* ============================================================
 * 演習 12-3: 分配を止める
 * ユニオンを分配せずに配列にする型を作ってください。
 * ToArraySafe<string | number> が (string | number)[] になること。
 * ============================================================ */
export type ToArraySafe<T> = unknown; // TODO

export type _t4 = Expect<Equal<ToArraySafe<string | number>, (string | number)[]>>;

/* ============================================================
 * 演習 12-4: Exclude を自作する
 * 分配の性質を使って実装してください。
 * ============================================================ */
export type MyExclude<T, U> = unknown; // TODO

export type _t5 = Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, 'b' | 'c'>>;
export type _t6 = Expect<Equal<MyExclude<string | null, null>, string>>;

/* ============================================================
 * 演習 12-5: infer で要素型を取り出す
 * 配列の要素型を取り出す型を作ってください。配列でなければ never。
 * ============================================================ */
export type ElementOf<T> = unknown; // TODO

export type _t7 = Expect<Equal<ElementOf<boolean[]>, boolean>>;
export type _t8 = Expect<Equal<ElementOf<number>, never>>;

/* ============================================================
 * 演習 12-6: ReturnType を自作する
 * ============================================================ */
export type MyReturnType<F> = unknown; // TODO

export type _t9 = Expect<Equal<MyReturnType<() => string>, string>>;
export type _t10 = Expect<Equal<MyReturnType<(a: number) => void>, void>>;

/* ============================================================
 * 演習 12-7: Awaited を自作する
 * ネストした Promise も剥がせるようにすること（再帰）。
 * ============================================================ */
export type MyAwaited<T> = unknown; // TODO

export type _t11 = Expect<Equal<MyAwaited<Promise<string>>, string>>;
export type _t12 = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
export type _t13 = Expect<Equal<MyAwaited<boolean>, boolean>>;

/* ============================================================
 * 演習 12-8: never を判定する
 * T が never のときだけ true になる型を作ってください。
 * （素直に書くと分配のせいで失敗します）
 * ============================================================ */
export type IsNever<T> = unknown; // TODO

export type _t14 = Expect<Equal<IsNever<never>, true>>;
export type _t15 = Expect<Equal<IsNever<string>, false>>;
export type _t16 = Expect<Equal<IsNever<never | string>, false>>;

/* ============================================================
 * 演習 12-9: タプルを再帰で処理する
 * タプルの要素を逆順にする型を作ってください。
 * ============================================================ */
export type Reverse<T extends readonly unknown[]> = unknown; // TODO

export type _t17 = Expect<Equal<Reverse<[1, 2, 3]>, [3, 2, 1]>>;
export type _t18 = Expect<Equal<Reverse<[]>, []>>;

/* ============================================================
 * 演習 12-10: 実用 — 関数の第 1 引数の型を取り出す
 * ============================================================ */
export type FirstParameter<F> = unknown; // TODO

export type _t19 = Expect<Equal<FirstParameter<(name: string, age: number) => void>, string>>;
export type _t20 = Expect<Equal<FirstParameter<() => void>, never>>;
