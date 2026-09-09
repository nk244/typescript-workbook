import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 3-1: typeof で絞り込む
 * 数値ならそのまま、文字列なら Number に変換して返す。
 * 変換できない文字列（NaN になる）は 0 を返すこと。
 * ============================================================ */
export function toNumber(input: string | number): number {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 3-2: リテラル型のユニオンを定義する
 * 注文の状態は 'pending' / 'shipped' / 'delivered' / 'cancelled' の 4 つ。
 * OrderStatus 型を定義し、canCancel を実装してください。
 * キャンセルできるのは pending と shipped のときだけです。
 * ============================================================ */
export type OrderStatus = string; // TODO: リテラル型のユニオンに書き換える

export function canCancel(status: OrderStatus): boolean {
  throw new Error('not implemented');
}

// 型が正しく定義できていれば、このテストが通る
export type _t1 = Expect<Equal<OrderStatus, 'pending' | 'shipped' | 'delivered' | 'cancelled'>>;

/* ============================================================
 * 演習 3-3: null を早期 return で消す
 * items が null なら 0、空配列なら 0、それ以外は合計を返す。
 * for でも reduce でもよい。
 * ============================================================ */
export function sum(items: number[] | null): number {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 3-4: in 演算子で絞り込む
 * 犬なら 'ワン'、猫なら 'ニャー' を返してください。
 * 型定義は変更せず、in 演算子で判別すること。
 * ============================================================ */
export type Dog = { name: string; bark: () => string };
export type Cat = { name: string; meow: () => string };

export function speak(animal: Dog | Cat): string {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 3-5: 絞り込みが効かない例を直す
 * 下のコードはコンパイルエラーになります。
 * 型注釈やアサーション(as)を足すのではなく、
 * 「ローカル定数に取り出す」書き方で直してください。
 * ============================================================ */
export function formatLater(user: { name: string | null }): () => string {
  if (user.name !== null) {
    // ここでエラーになる: 絞り込みはコールバックの中まで持ち越せない
    return () => user.name.toUpperCase();
  }
  return () => 'ANONYMOUS';
}

/* ============================================================
 * 演習 3-6: unknown なエラーを扱う（実務頻出）
 * catch した値は unknown。
 * Error ならその message を、文字列ならそれ自身を、
 * それ以外は '不明なエラー' を返してください。
 * ============================================================ */
export function toMessage(error: unknown): string {
  throw new Error('not implemented');
}
