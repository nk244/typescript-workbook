import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 17-1: 手書きの型ガード
 * 値が User の形をしているかを判定する型ガードを実装してください。
 *   User = { id: number; name: string }
 * as は使わないこと。
 * ============================================================ */
export type User = { id: number; name: string };

export function isUser(value: unknown): value is User {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 17-2: JSON を安全にパースする
 * 文字列を JSON としてパースし、Result で返してください。
 *   - パースに失敗したら { ok: false, error: 'invalid-json' }
 *   - 成功したら { ok: true, value: unknown }
 * ============================================================ */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function safeJsonParse(text: string): Result<unknown, 'invalid-json'> {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 17-3: ミニ・スキーマバリデータを作る（この章の本丸）
 *
 * Validator<T> は「unknown を受け取り、T かどうかを検査するもの」です。
 * 次の 5 つを実装してください。
 *   v.string()  / v.number() / v.boolean()
 *   v.array(itemValidator)
 *   v.object({ key: validator, ... })
 *
 * エラーメッセージは以下の形式にすること（テストで照合します）。
 *   型が違う          : `expected string but got number`
 *   配列の要素が違う  : `[1] expected string but got number`
 *   オブジェクトの項目: `name: expected string but got number`
 *   キーがない        : `name: expected string but got undefined`
 * ============================================================ */
export type Validator<T> = {
  parse: (value: unknown) => Result<T, string>;
};

/** Validator から、それが検査する型を取り出す */
export type Infer<V> = unknown; // TODO

/** 値の種類を表す文字列を返すヘルパー（実装済み。エラーメッセージ用） */
export function typeNameOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

export const v = {
  string(): Validator<string> {
    throw new Error('not implemented');
  },

  number(): Validator<number> {
    throw new Error('not implemented');
  },

  boolean(): Validator<boolean> {
    throw new Error('not implemented');
  },

  array<T>(item: Validator<T>): Validator<T[]> {
    throw new Error('not implemented');
  },

  object<S extends Record<string, Validator<unknown>>>(
    shape: S,
  ): Validator<{ [K in keyof S]: Infer<S[K]> }> {
    throw new Error('not implemented');
  },
};

/* ============================================================
 * 演習 17-4: スキーマから型を導く
 * userSchema を v で組み立て、型 InferredUser を導いてください。
 *   { id: number; name: string; tags: string[] }
 * 型を手で書かないこと。
 * ============================================================ */
export const userSchema = null as unknown as Validator<unknown>; // TODO

export type InferredUser = Infer<typeof userSchema>;

export type _t1 = Expect<Equal<InferredUser, { id: number; name: string; tags: string[] }>>;

/* ============================================================
 * 演習 17-5: 境界をひとつにまとめる
 * JSON 文字列を受け取り、パース + 検証して User を返してください。
 *   - JSON として不正なら 'invalid-json'
 *   - 形が違えば検証エラーメッセージをそのまま error に入れる
 * ============================================================ */
export function parseUser(text: string): Result<InferredUser, string> {
  throw new Error('not implemented');
}
