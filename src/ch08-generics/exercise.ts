import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 8-1: 最初のジェネリック関数
 * 配列の最後の要素を返す last を実装してください。
 * 空配列なら undefined を返します。
 * ============================================================ */
export function last(items: unknown): unknown {
  // TODO: シグネチャをジェネリックに書き換えて実装する
  throw new Error('not implemented');
}

export type _t1 = Expect<Equal<ReturnType<typeof last<number>>, number | undefined>>;

/* ============================================================
 * 演習 8-2: 制約をつける
 * 2 つの値のうち length が大きいほうを返す longest を実装してください。
 * length を持つものだけを受け取れるようにすること。
 * ============================================================ */
export function longest<T>(a: T, b: T): T {
  // TODO: T に制約をつけて実装する
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 8-3: keyof と インデックスアクセス型
 * オブジェクトから指定キーの値を取り出す pluck を実装してください。
 * 存在しないキーを渡すとコンパイルエラーになること。
 * ============================================================ */
export function pluck(obj: unknown, key: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 8-4: 複数キーを取り出す
 * 指定した複数のキーだけを持つ新しいオブジェクトを返す pick を実装してください。
 * 戻り値の型は「選んだキーだけを持つオブジェクト」になること。
 * ヒント: Pick<T, K> という組み込み型があります（第10章）が、
 *        まずは自分で戻り値型を書いてみてください。
 * ============================================================ */
export function pick(obj: unknown, keys: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 8-5: ジェネリックなクラス
 * 型安全なスタック Stack<T> を実装してください。
 *   - push(item): 積む
 *   - pop(): 取り出す（空なら undefined）
 *   - peek(): 見るだけ（空なら undefined）
 *   - size: 現在の要素数（getter）
 * ============================================================ */
export class Stack<T> {
  // TODO
}

/* ============================================================
 * 演習 8-6: ジェネリックな型エイリアス
 * 「成功なら値、失敗ならエラー」を表す Result 型を定義してください。
 *   成功: { ok: true;  value: T }
 *   失敗: { ok: false; error: E }
 * E のデフォルトは Error にすること。
 * ============================================================ */
export type Result<T, E = never> = unknown; // TODO

export type _t2 = Expect<
  Equal<Result<number>, { ok: true; value: number } | { ok: false; error: Error }>
>;
export type _t3 = Expect<
  Equal<Result<string, string>, { ok: true; value: string } | { ok: false; error: string }>
>;

/* ============================================================
 * 演習 8-7: 型引数が不要な例を見抜く
 * 下の関数はジェネリクスにする意味がありません。
 * 型引数をなくして、同じことを unknown で書き直してください。
 * ============================================================ */
export function debugLog<T>(value: T): void {
  void value;
}
