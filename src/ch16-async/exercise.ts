import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 16-1: async 関数の戻り値型
 * ユーザー名を返す非同期関数です。戻り値の型注釈を書いてください。
 * ============================================================ */
export async function fetchName(id: string) /* TODO: 戻り値型 */ {
  return `user-${id}`;
}

export type _t1 = Expect<Equal<ReturnType<typeof fetchName>, Promise<string>>>;

/* ============================================================
 * 演習 16-2: catch した unknown を扱う
 * fn を実行し、成功なら結果を、失敗ならエラーメッセージ文字列を返してください。
 * Error なら message、そうでなければ String(e) を使うこと。
 * ============================================================ */
export async function runSafely<T>(fn: () => Promise<T>): Promise<T | string> {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 16-3: Result 型を返す
 * Result 型を定義し、パースに成功したら数値、
 * 失敗したら 'invalid-number' を返す parseNumber を実装してください。
 * ============================================================ */
export type Result<T, E = Error> = unknown; // TODO

export function parseNumber(input: string): Result<number, 'invalid-number'> {
  throw new Error('not implemented');
}

export type _t2 = Expect<
  Equal<
    Result<number, 'invalid-number'>,
    { ok: true; value: number } | { ok: false; error: 'invalid-number' }
  >
>;

/* ============================================================
 * 演習 16-4: Result を安全に取り出す
 * 成功なら値を、失敗なら fallback を返す unwrapOr を実装してください。
 * ============================================================ */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 16-5: Promise.all でタプルを保つ
 * 3 つの非同期処理を並行に実行し、タプルで返してください。
 * 戻り値の型は書かず、推論に任せること（テストで型を検査します）。
 * ============================================================ */
export async function loadAll() {
  const a = async (): Promise<string> => 'a';
  const b = async (): Promise<number> => 1;
  const c = async (): Promise<boolean> => true;
  // TODO: Promise.all を使って [string, number, boolean] を返す
  throw new Error('not implemented');
}

export type _t3 = Expect<Equal<Awaited<ReturnType<typeof loadAll>>, [string, number, boolean]>>;

/* ============================================================
 * 演習 16-6: 直列と並行の違い
 * items をすべて処理し、結果の配列を返してください。
 *   - processSerial: 1 件ずつ順番に（前の完了を待つ）
 *   - processParallel: すべて同時に
 * ============================================================ */
export async function processSerial<T, U>(
  items: readonly T[],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  throw new Error('not implemented');
}

export async function processParallel<T, U>(
  items: readonly T[],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 16-7: allSettled を判別可能なユニオンとして扱う
 * 成功した値だけを取り出してください。
 * ============================================================ */
export async function collectFulfilled<T>(promises: readonly Promise<T>[]): Promise<T[]> {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 16-8: タイムアウト付きの待機
 * promise が ms 以内に解決しなければ Error('timeout') で reject してください。
 * ============================================================ */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  throw new Error('not implemented');
}
