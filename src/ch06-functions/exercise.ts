import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 6-1: 関数型を定義する
 * 「string を受け取って boolean を返す関数」の型 Validator を定義し、
 * 空文字でないことを検査する notEmpty を実装してください。
 * notEmpty には引数の型注釈を書かないこと（文脈から推論されるはず）。
 * ============================================================ */
export type Validator = unknown; // TODO

export const notEmpty: Validator = null as never; // TODO: 関数を書く

export type _t1 = Expect<Equal<Validator, (value: string) => boolean>>;

/* ============================================================
 * 演習 6-2: オプション引数をオブジェクトにまとめる
 * greet({ name, polite }) を実装してください。
 *   polite が true なら 'ken 様' 、省略時や false なら 'ken さん'
 * ============================================================ */
export function greet(options: { name: string; polite?: boolean }): string {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 6-3: 高階関数を作る
 * 関数 fn を「一度しか実行しない」関数に変換する once を実装してください。
 * 2 回目以降は 1 回目の結果を返します。
 * 型は変えずに実装だけ書くこと。
 * ============================================================ */
export function once<T>(fn: () => T): () => T {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 6-4: コールバックの型
 * 配列の各要素に fn を適用した新しい配列を返す myMap を実装してください。
 * fn は (要素, インデックス) を受け取ります。
 * 呼び出し側で引数に型注釈を書かなくて済むようにすること。
 * ============================================================ */
export function myMap<T, U>(items: readonly T[], fn: (item: T, index: number) => U): U[] {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 6-5: オーバーロード
 * 引数が string なら文字数、string[] なら合計文字数を返す len を、
 * オーバーロードで宣言してください（実装シグネチャは書いてあります）。
 * ============================================================ */
// TODO: ここにオーバーロードの宣言を 2 行書く

export function len(input: string | string[]): number {
  if (typeof input === 'string') return input.length;
  return input.reduce((acc, s) => acc + s.length, 0);
}

// オーバーロードが正しく書けていれば、戻り値型が number に確定する
export type _t2 = Expect<Equal<ReturnType<typeof len>, number>>;

/* ============================================================
 * 演習 6-6: 関数の代入互換性を予想する
 * 代入できるものに true、できないものに false を入れてください。
 * ============================================================ */
type Handler = (event: string, index: number) => void;

// (event: string) => void を Handler に代入できるか？
export const CAN_ASSIGN_FEWER_ARGS: boolean = false; // TODO
// (event: string, index: number, extra: boolean) => void を代入できるか？
export const CAN_ASSIGN_MORE_ARGS: boolean = false; // TODO
// (event: string, index: number) => number を代入できるか？（戻り値が void 期待）
export const CAN_ASSIGN_RETURNING_VALUE: boolean = false; // TODO

export type _unusedHandler = Handler;
