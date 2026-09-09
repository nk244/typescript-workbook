import type { Equal, Expect } from '../lib/type-test';

type User = { id: number; name: string; email: string };

/* ============================================================
 * 演習 ex05-1: Prettify
 * 交差型を「展開済みの 1 つのオブジェクト型」に変換する型を作ってください。
 * ============================================================ */
export type Prettify<T> = unknown; // TODO

export type _t1 = Expect<
  Equal<
    Prettify<Omit<User, 'id'> & { onSave: () => void }>,
    { name: string; email: string; onSave: () => void }
  >
>;

/* ============================================================
 * 演習 ex05-2: null を除く
 * compact は null / undefined を取り除いた配列を返します。
 * 戻り値が正しく絞り込まれるように実装してください。
 * ============================================================ */
export function compact<T>(items: readonly T[]): NonNullable<T>[] {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex05-3: 型の付いた Object.keys / entries
 * 「自分が作ったオブジェクトに対してだけ使う」前提のラッパーを作ってください。
 * as を使ってよいですが、なぜ嘘なのかをコメントに書くこと。
 * ============================================================ */
export function objectKeys(obj: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

export function objectEntries(obj: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

export type _t2 = Expect<Equal<ReturnType<typeof objectKeys<User>>, (keyof User)[]>>;
export type _t3 = Expect<
  Equal<ReturnType<typeof objectEntries<User>>, [keyof User, User[keyof User]][]>
>;

/* ============================================================
 * 演習 ex05-4: 型でエラーメッセージを出す
 * id を持たない型を渡したとき、ホバーで理由が読めるようにしてください。
 * ============================================================ */
export type Invalid<Message extends string> = { readonly __error: Message };

export type RequireId<T> = unknown; // TODO

export type _t4 = Expect<Equal<RequireId<{ id: number }>, { id: number }>>;
export type _t5 = Expect<Equal<RequireId<{ name: string }>, Invalid<'id プロパティが必要です'>>>;

/* ============================================================
 * 演習 ex05-5: using で後始末を自動化する
 * Disposable を実装した Span クラスを作ってください。
 *   - コンストラクタで log に `start:<name>` を積む
 *   - スコープを抜けたら `end:<name>` を積む
 * ============================================================ */
export class Span {
  constructor(
    public readonly name: string,
    private readonly log: string[],
  ) {
    // TODO: 開始を記録する
  }

  // TODO: Symbol.dispose を実装する
}

export function runWithSpan(log: string[]): void {
  // TODO: using を使って Span を作り、log に 'work' を積む
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex05-6: 推論結果を確認する小技
 * 下の値の型を、実際にホバーして確かめてから書いてください。
 * ============================================================ */
export const inferred = { id: 1, tags: ['a', 'b'] } as const;

export type InferredType = unknown; // TODO

export type _t6 = Expect<Equal<InferredType, typeof inferred>>;
