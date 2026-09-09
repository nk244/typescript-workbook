/**
 * 型レベルのテストに使うユーティリティ。
 * 「実行時ではなくコンパイル時に」正しさを検査するための道具です。
 *
 * 使い方:
 *   type Result = MyType<'a'>;
 *   type _t1 = Expect<Equal<Result, 'A'>>;   // 型が違えば tsc がエラーを出す
 *
 * 第12章（Conditional Types）でこの実装自体を読み解きます。
 * それまでは「そういう道具がある」と思って使って構いません。
 */

/** X と Y が完全に同じ型なら true、違えば false。 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/** X と Y が違う型なら true。 */
export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;

/** T が true でなければコンパイルエラーにする。 */
export type Expect<T extends true> = T;

/** T が false でなければコンパイルエラーにする。 */
export type ExpectFalse<T extends false> = T;

/** A が B に代入可能なら true。（部分型かどうかの検査） */
export type IsAssignable<A, B> = A extends B ? true : false;

/** 実行時には何もしない。型テスト用ファイルを「モジュール」にするためのダミー。 */
export const __typeTest = true;
