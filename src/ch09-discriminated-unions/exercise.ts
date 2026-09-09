import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 9-1: 判別可能なユニオンを定義する
 * 図形 Shape を定義してください。
 *   - circle: radius を持つ
 *   - rect:   width, height を持つ
 *   - triangle: base, height を持つ
 * 判別子のプロパティ名は kind にすること。
 * ============================================================ */
export type Shape = unknown; // TODO

/* ============================================================
 * 演習 9-2: 網羅性チェック付きの switch
 * area を実装してください。default で assertNever を呼ぶこと。
 * （三角形の面積は base * height / 2）
 * ============================================================ */
export function assertNever(value: never): never {
  throw new Error(`未対応のケース: ${JSON.stringify(value)}`);
}

export function area(shape: Shape): number {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 9-3: 不正な状態を表現できなくする
 * 下の RequestState は「ありえない組み合わせ」を作れてしまいます。
 * 判別可能なユニオンで書き直してください。
 *   - idle:    何も持たない
 *   - loading: 何も持たない
 *   - success: data: string[] を持つ
 *   - error:   message: string を持つ
 * 判別子は status にすること。
 * ============================================================ */
export type RequestState = unknown; // TODO

export type _t1 = Expect<
  Equal<
    RequestState,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: string[] }
    | { status: 'error'; message: string }
  >
>;

/* ============================================================
 * 演習 9-4: 状態から表示文字列を作る
 * renderState を実装してください。
 *   idle    -> '待機中'
 *   loading -> '読み込み中...'
 *   success -> '3 件' のように件数
 *   error   -> 'エラー: メッセージ'
 * ここでも網羅性チェックを入れること。
 * ============================================================ */
export function renderState(state: RequestState): string {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 9-5: 型述語を書く
 * 値が「0 個以上の string を持つ配列」であることを判定する
 * 型述語 isStringArray を実装してください。
 * ============================================================ */
export function isStringArray(value: unknown): boolean {
  // TODO: 戻り値型を型述語にする
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 9-6: assertion 関数
 * 値が null / undefined でないことを表明する assertIsDefined を実装してください。
 * null か undefined なら Error を投げます。
 * ============================================================ */
export function assertIsDefined<T>(value: T): void {
  // TODO: 戻り値型を asserts 述語にする
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 9-7: 網羅性チェックが効くことを確かめる
 * 9-1 の Shape に 'square' を足してみてください（size を持つ）。
 * area がコンパイルエラーになるはずです。確認したら、
 * square にも対応して EXHAUSTIVE_CONFIRMED を true にしてください。
 * （square を Shape に残したままでも、消しても構いません。
 *   残す場合は area も対応させること）
 * ============================================================ */
export const EXHAUSTIVE_CONFIRMED = false; // TODO: 確認したら true
