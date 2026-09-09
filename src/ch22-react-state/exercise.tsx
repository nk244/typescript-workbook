import { useEffect, useState } from 'react';
import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 22-1: 非同期状態の型
 * AsyncState を判別可能なユニオンで定義してください。
 *   idle / loading / success（data を持つ）/ error（error を持つ）
 * 判別子は status、E の既定値は Error にすること。
 * ============================================================ */
export type AsyncState<T, E = Error> = unknown; // TODO

export type _t1 = Expect<
  Equal<
    AsyncState<number>,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: number }
    | { status: 'error'; error: Error }
  >
>;

/* ============================================================
 * 演習 22-2: 状態を表示に変換する（純粋関数）
 * 網羅性チェックを入れて実装してください。
 *   idle    -> '未実行'
 *   loading -> '読み込み中'
 *   success -> `完了: ${data}`
 *   error   -> `失敗: ${error.message}`
 * ============================================================ */
export function assertNever(value: never): never {
  throw new Error(`未対応: ${JSON.stringify(value)}`);
}

export function describeAsync(state: AsyncState<string>): string {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 22-3: unknown を Error に正規化する
 * catch した値を必ず Error にして返してください。
 *   Error ならそのまま / それ以外は String(value) を message にした Error
 * ============================================================ */
export function toError(value: unknown): Error {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 22-4: useAsync を実装する
 * fetcher を実行し、AsyncState を返すカスタムフックです。
 *   - 実行前は idle、実行開始で loading
 *   - 成功で success、失敗で error（toError で正規化する）
 *   - アンマウント後に setState しないこと（キャンセルフラグ）
 * 依存配列は deps をそのまま使ってください。
 * ============================================================ */
export function useAsync<T>(fetcher: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' } as AsyncState<T>);
  void useEffect;
  void fetcher;
  void deps;
  void setState;
  // TODO
  return state;
}

/* ============================================================
 * 演習 22-5: 状態で表示を出し分けるコンポーネント
 * UserName は useAsync の状態に応じて表示を切り替えます。
 *   loading -> <p>loading</p>
 *   success -> <p>{data}</p>
 *   error   -> <p role="alert">{message}</p>
 *   idle    -> null
 * ============================================================ */
export function UserName({ fetchName }: { fetchName: () => Promise<string> }) {
  void fetchName;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 22-6: 型安全な API クライアント
 * Endpoints からパスとレスポンス型の対応を導いてください。
 * api('/users') は User[] を、api('/settings') は Settings を返すこと。
 * 実装は fetcher(path) の結果をそのまま返すだけで構いません。
 * ============================================================ */
export type User = { id: number; name: string };
export type Settings = { theme: 'light' | 'dark' };

export type Endpoints = {
  '/users': User[];
  '/settings': Settings;
};

export async function api(
  fetcher: (path: string) => Promise<unknown>,
  path: unknown,
): Promise<unknown> {
  // TODO: シグネチャをジェネリックにして、戻り値の型を導く
  throw new Error('not implemented');
}
