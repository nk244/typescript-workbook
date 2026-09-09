import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 23-1: テストを仕様書として読み、実装する
 * exercise.test.ts を先に読んでください。そこに書かれた振る舞いを
 * 満たすように groupBy を実装します。
 *   - 配列と「キーを取り出す関数」を受け取る
 *   - キーごとに要素をまとめた Map を返す
 *   - 出現順を保つこと
 * ============================================================ */
export function groupBy<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]> {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 23-2: 境界値を自分で洗い出す
 * chunk は配列を size ごとに分割します。
 * テストに書かれていない境界（size が 0 以下、空配列）も
 * 「例外を投げる / 空配列を返す」のどちらが適切か考えて実装し、
 * その判断を CHUNK_POLICY に書いてください。
 *   size <= 0 のとき: 'throw' か 'empty' か
 * ============================================================ */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  throw new Error('not implemented');
}

export const CHUNK_POLICY: 'throw' | 'empty' = 'empty'; // TODO: 実装に合わせる

/* ============================================================
 * 演習 23-3: 型テストを書く
 * groupBy の型が期待どおりかを Expect / Equal で検査してください。
 * ============================================================ */
type User = { id: number; role: 'admin' | 'user' };

// TODO: groupBy(users, (u) => u.role) の戻り値型を書いてください
export type GroupedByRole = unknown;

export type _t1 = Expect<Equal<GroupedByRole, Map<'admin' | 'user', User[]>>>;

// 実際の呼び出しからも同じ型が出ることを確かめる（コンパイルできれば OK）
export type _t2 = Expect<
  Equal<ReturnType<typeof groupBy<User, 'admin' | 'user'>>, GroupedByRole>
>;

/* ============================================================
 * 演習 23-4: @ts-expect-error を使う
 * 下の行のコメントを外すと「エラーになるはず」です。
 * @ts-expect-error を付けて、エラーが出ることを型テストにしてください。
 * （エラーが出なくなったら @ts-expect-error 自体がエラーになります）
 * ============================================================ */
export function greet(name: string): string {
  return `${name}さん`;
}

// TODO: 次の 1 行の上に @ts-expect-error を付けて有効化する
// greet(42);
