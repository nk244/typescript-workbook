/* ============================================================
 * 総合演習 (2/3): 外部データの取り込み
 * ============================================================ */
import type { Task } from './domain';

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * TODO: unknown を検証して Task[] にする。
 *   - 配列でなければ 'expected array'
 *   - i 番目が Task の形でなければ `invalid task at ${i}`
 *   - createdAt は ISO 文字列 -> Date に変換する
 *   - as は使わずに、型ガードで絞り込むこと
 */
export function parseTasks(input: unknown): Result<Task[], string> {
  throw new Error('not implemented');
}
