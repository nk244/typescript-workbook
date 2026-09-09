import type { Equal, Expect } from '../lib/type-test';

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

/* ============================================================
 * 演習 10-1: 入力型を導く
 * User から次の 2 つを、組み込みユーティリティ型だけで導いてください。
 *   CreateUserInput: id と createdAt を除いたもの
 *   UpdateUserInput: CreateUserInput のすべてを省略可能にしたもの
 * ============================================================ */
export type CreateUserInput = unknown; // TODO
export type UpdateUserInput = unknown; // TODO

export type _t1 = Expect<Equal<CreateUserInput, { name: string; email: string }>>;
export type _t2 = Expect<Equal<UpdateUserInput, { name?: string; email?: string }>>;

/* ============================================================
 * 演習 10-2: 一覧表示用の型
 * id と name だけを持つ UserSummary を Pick で導いてください。
 * ============================================================ */
export type UserSummary = unknown; // TODO

export type _t3 = Expect<Equal<UserSummary, { id: number; name: string }>>;

/* ============================================================
 * 演習 10-3: Record でラベル表を作る
 * Status のすべてに対応するラベル表を作ってください。
 * 型注釈を書いたうえで、実際の値も埋めること。
 *   idle -> '待機中' / loading -> '読み込み中' / success -> '完了' / error -> '失敗'
 * ============================================================ */
export type Status = 'idle' | 'loading' | 'success' | 'error';

export const STATUS_LABELS = {
  // TODO: 型注釈 Record<...> をつけて、4 つすべて埋める
};

/* ============================================================
 * 演習 10-4: ユニオンを削る
 * Status から 'idle' を除いた ActiveStatus を導いてください。
 * ============================================================ */
export type ActiveStatus = unknown; // TODO

export type _t4 = Expect<Equal<ActiveStatus, 'loading' | 'success' | 'error'>>;

/* ============================================================
 * 演習 10-5: 実装から型を導く
 * 下の関数の戻り値の型を ReturnType で取り出してください。
 * 手でオブジェクト型を書かないこと。
 * ============================================================ */
export function buildConfig(host: string, port: number) {
  return { host, port, url: `http://${host}:${port}` };
}

export type Config = unknown; // TODO
export type ConfigArgs = unknown; // TODO: buildConfig の引数タプル

export type _t5 = Expect<Equal<Config, { host: string; port: number; url: string }>>;
export type _t6 = Expect<Equal<ConfigArgs, [host: string, port: number]>>;

/* ============================================================
 * 演習 10-6: Promise を剥がす
 * fetchUser の「解決後の値」の型を取り出してください。
 * ============================================================ */
export async function fetchUser(id: number): Promise<User> {
  void id;
  throw new Error('not implemented');
}

export type FetchedUser = unknown; // TODO

export type _t7 = Expect<Equal<FetchedUser, User>>;

/* ============================================================
 * 演習 10-7: 実際に使ってみる
 * createUser を実装してください。
 *   - CreateUserInput を受け取る
 *   - id は引数 nextId をそのまま使う
 *   - createdAt は引数 now をそのまま使う
 * ============================================================ */
export function createUser(input: CreateUserInput, nextId: number, now: Date): User {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 10-8: null を潰す型
 * MaybeUser から null / undefined を除いた型を導いてください。
 * ============================================================ */
export type MaybeUser = User | null | undefined;
export type DefiniteUser = unknown; // TODO

export type _t8 = Expect<Equal<DefiniteUser, User>>;
