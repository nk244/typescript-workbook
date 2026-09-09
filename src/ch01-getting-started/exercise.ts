import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 1-1: 型注釈をつける
 * 引数に型をつけて、税込価格（小数点以下切り捨て）を返してください。
 * 税率は 0.1 とします。
 * ============================================================ */
export function withTax(price: unknown /* TODO: number にする */) {
  // TODO: 実装する
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 1-2: 戻り値の型を明示する
 * 「name さん、こんにちは」という文字列を返す関数です。
 * 引数と戻り値の両方に型注釈をつけてください。
 * ============================================================ */
export function greet(name: unknown /* TODO */) /* TODO: 戻り値の型 */ {
  // TODO: 実装する
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 1-3: 型推論を読む（型レベル問題）
 * 下の 3 つの変数が何型に推論されるか予想し、
 * A / B / C を「推論される型」に書き換えてエラーを消してください。
 * ※ 変数の宣言のほうは変更しないこと。
 * ============================================================ */
export const inferMe1 = 42;
// eslint-disable-next-line prefer-const -- let の推論を見るための例
export let inferMe2 = 42;
export const inferMe3 = [1, 2, 3];

type A = unknown; // TODO: inferMe1 の型に書き換える
type B = unknown; // TODO: inferMe2 の型に書き換える
type C = unknown; // TODO: inferMe3 の型に書き換える

export type _t1 = Expect<Equal<typeof inferMe1, A>>;
export type _t2 = Expect<Equal<typeof inferMe2, B>>;
export type _t3 = Expect<Equal<typeof inferMe3, C>>;

/* ============================================================
 * 演習 1-4: なぜエラーになるのか説明する
 * 下のコードのコメントを外すと 2 か所エラーになります。
 * エラーメッセージを読み、「実際の型」と「期待された型」を
 * REASON_1 / REASON_2 に文字列で書いてください（日本語で可）。
 * 書いたらコメントは戻して（=エラーが出ない状態にして）ください。
 *
 *   const x: number = '3';
 *   const y: string[] = ['a', 1];
 * ============================================================ */
export const REASON_1 = ''; // TODO: 1 行で説明を書く（空文字以外なら OK）
export const REASON_2 = ''; // TODO: 1 行で説明を書く
