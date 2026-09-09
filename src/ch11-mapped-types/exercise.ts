import type { Equal, Expect } from '../lib/type-test';

type User = { id: number; name: string; email?: string };
type ReadonlyUser = { readonly id: number; readonly name: string };

/* ============================================================
 * 演習 11-1: keyof と インデックスアクセス型
 * ============================================================ */
export type UserKeys = unknown; // TODO: User のキーのユニオン
export type UserValues = unknown; // TODO: User の値のユニオン（? は考慮しなくてよい）

export type _t1 = Expect<Equal<UserKeys, 'id' | 'name' | 'email'>>;
export type _t2 = Expect<Equal<UserValues, number | string | undefined>>;

/* ============================================================
 * 演習 11-2: Partial を自作する
 * 組み込みの Partial を使わずに実装してください。
 * ============================================================ */
export type MyPartial<T> = unknown; // TODO

export type _t3 = Expect<Equal<MyPartial<{ a: number; b: string }>, { a?: number; b?: string }>>;

/* ============================================================
 * 演習 11-3: Readonly を外す（Mutable）
 * readonly 修飾子を取り除く型を作ってください。
 * ============================================================ */
export type Mutable<T> = unknown; // TODO

export type _t4 = Expect<Equal<Mutable<ReadonlyUser>, { id: number; name: string }>>;

/* ============================================================
 * 演習 11-4: Pick を自作する
 * 第2引数のキーだけを残す型を作ってください。
 * 存在しないキーを渡したらコンパイルエラーになること。
 * ============================================================ */
export type MyPick<T, K> = unknown; // TODO: K に制約をつけること

export type _t5 = Expect<Equal<MyPick<User, 'id'>, { id: number }>>;

/* ============================================================
 * 演習 11-5: 厳密な Omit
 * 組み込みの Omit は存在しないキーを渡してもエラーになりません。
 * keyof T のキーしか渡せない StrictOmit を作ってください。
 * ============================================================ */
export type StrictOmit<T, K extends keyof T> = unknown; // TODO

export type _t6 = Expect<Equal<StrictOmit<User, 'email'>, { id: number; name: string }>>;

/* ============================================================
 * 演習 11-6: キー名を変換する（key remapping）
 * 各プロパティに対する getter を持つ型を作ってください。
 *   { name: string } -> { getName: () => string }
 * ============================================================ */
export type Getters<T> = unknown; // TODO

export type _t7 = Expect<
  Equal<Getters<{ name: string; age: number }>, { getName: () => string; getAge: () => number }>
>;

/* ============================================================
 * 演習 11-7: 値の型でキーを絞る
 * 値が関数であるプロパティだけを残す型を作ってください。
 * ============================================================ */
export type FunctionKeysOnly<T> = unknown; // TODO

export type _t8 = Expect<
  Equal<
    FunctionKeysOnly<{ id: number; save: () => void; load: (n: number) => string }>,
    { save: () => void; load: (n: number) => string }
  >
>;

/* ============================================================
 * 演習 11-8: 再帰的な DeepReadonly
 * ネストしたオブジェクトも含めてすべて readonly にする型を作ってください。
 * 配列や関数のことはひとまず考えなくて構いません。
 * ============================================================ */
export type DeepReadonly<T> = unknown; // TODO

export type _t9 = Expect<
  Equal<
    DeepReadonly<{ a: number; b: { c: string } }>,
    { readonly a: number; readonly b: { readonly c: string } }
  >
>;

/* ============================================================
 * 演習 11-9: 実用 — フォームのエラー型
 * 各フィールドに対する省略可能なエラーメッセージの型を作り、
 * バリデーション関数を実装してください。
 *   - name が空なら '名前は必須です'
 *   - age が 0 未満なら '年齢が不正です'
 *   - 問題なければそのフィールドのキーは含めない
 * ============================================================ */
export type FormErrors<T> = unknown; // TODO

export type Profile = { name: string; age: number };

export function validate(profile: Profile): FormErrors<Profile> {
  throw new Error('not implemented');
}

export type _t10 = Expect<Equal<FormErrors<Profile>, { name?: string; age?: string }>>;
