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
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>; // TODO
export type UpdateUserInput = Partial<CreateUserInput>; // TODO

export type _t1 = Expect<Equal<CreateUserInput, { name: string; email: string }>>;
export type _t2 = Expect<Equal<UpdateUserInput, { name?: string; email?: string }>>;

/* ============================================================
 * 演習 10-2: 一覧表示用の型
 * id と name だけを持つ UserSummary を Pick で導いてください。
 * ============================================================ */
export type UserSummary = Pick<User, 'id' | 'name'>; // TODO

export type _t3 = Expect<Equal<UserSummary, { id: number; name: string }>>;

/* ============================================================
 * 演習 10-3: Record でラベル表を作る
 * Status のすべてに対応するラベル表を作ってください。
 * 型注釈を書いたうえで、実際の値も埋めること。
 *   idle -> '待機中' / loading -> '読み込み中' / success -> '完了' / error -> '失敗'
 * ============================================================ */
export type Status = 'idle' | 'loading' | 'success' | 'error';

export const STATUS_LABELS: Record<Status, string> = {
  // TODO: 型注釈 Record<...> をつけて、4 つすべて埋める
  idle: '待機中',
  loading: '読み込み中',
  success: '完了',
  error: '失敗'
};

/* ============================================================
 * 演習 10-4: ユニオンを削る
 * Status から 'idle' を除いた ActiveStatus を導いてください。
 * ============================================================ */
export type ActiveStatus = Exclude<Status, 'idle'>; // TODO

export type _t4 = Expect<Equal<ActiveStatus, 'loading' | 'success' | 'error'>>;

/* ============================================================
 * 演習 10-5: 実装から型を導く
 * 下の関数の戻り値の型を ReturnType で取り出してください。
 * 手でオブジェクト型を書かないこと。
 * ============================================================ */
export function buildConfig(host: string, port: number) {
  return { host, port, url: `http://${host}:${port}` };
}

export type Config = ReturnType<typeof buildConfig>; // TODO
export type ConfigArgs = Parameters<typeof buildConfig>; // TODO: buildConfig の引数タプル

export type _t5 = Expect<Equal<Config, { host: string; port: number; url: string }>>;
export type _t6 = Expect<Equal<ConfigArgs, [host: string, port: number]>>;

/* ============================================================
 * 演習 10-6: Promise を剥がす
 * fetchUser の「解決後の値」の型を取り出してください。
 * （Promise<X> は「あとで X になる値の入れ物」。中身の X が「解決後の値」です。
 *   Promise は第16章で詳しく扱います。この章の README の第4節末尾「Awaited を読むための Promise 入門」にも簡単な説明があります）
 * ============================================================ */
export async function fetchUser(id: number): Promise<User> {
  void id;
  throw new Error('not implemented');
}

export type FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // TODO

export type _t7 = Expect<Equal<FetchedUser, User>>;

/* ============================================================
 * 演習 10-7: 実際に使ってみる
 * 関数 createUser の本体を書いて、User 型のオブジェクトを返してください。
 * 型はオブジェクトを作れないので、「User の 4 つのプロパティをすべて持つ
 * オブジェクトリテラル」を return する、ということです。
 *   - id        : 引数 nextId の値
 *   - name      : 引数 input の name
 *   - email     : 引数 input の email
 *   - createdAt : 引数 now の値
 * 例: createUser({ name: 'ken', email: 'k@example.com' }, 7, now)
 *     → { id: 7, name: 'ken', email: 'k@example.com', createdAt: now }
 * ============================================================ */
export function createUser(input: CreateUserInput, nextId: number, now: Date): User {
  // throw new Error('not implemented');
  return {
    id: nextId,
    name: input.name,
    email: input.email,
    createdAt: now
  }
}

/* ============================================================
 * 演習 10-8: null を潰す型
 * MaybeUser から null / undefined を除いた型を導いてください。
 * ============================================================ */
export type MaybeUser = User | null | undefined;
export type DefiniteUser = NonNullable<MaybeUser>; // TODO

export type _t8 = Expect<Equal<DefiniteUser, User>>;
