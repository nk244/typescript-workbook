import type { Equal, Expect } from '../lib/type-test';

// 1-1
export function withTax(price: number): number {
  return Math.floor(price * 1.1);
}

// 1-2
export function greet(name: string): string {
  return `${name}さん、こんにちは`;
}

// 1-3
export const inferMe1 = 42;
// eslint-disable-next-line prefer-const -- let の推論を見るための例
export let inferMe2 = 42;
export const inferMe3 = [1, 2, 3];

// const は再代入されないのでリテラル型 42 まで狭められる
type A = 42;
// let は再代入されうるので number まで広げられる（widening）
type B = number;
// 配列リテラルは要素型のユニオンの配列。const でも中身は書き換えられるので
// 要素はリテラル型に固定されない
type C = number[];

export type _t1 = Expect<Equal<typeof inferMe1, A>>;
export type _t2 = Expect<Equal<typeof inferMe2, B>>;
export type _t3 = Expect<Equal<typeof inferMe3, C>>;

// 1-4
export const REASON_1 = "実際は string の '3' だが、number が期待されているため代入できない";
export const REASON_2 = '配列の要素 1 は number だが、string[] は要素がすべて string であることを要求する';
