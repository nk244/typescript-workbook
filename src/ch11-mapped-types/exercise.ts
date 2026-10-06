import type { Equal, Expect } from '../lib/type-test';

type User = { id: number; name: string; email?: string };
type ReadonlyUser = { readonly id: number; readonly name: string };

/* ============================================================
 * 演習 11-1: keyof と インデックスアクセス型
 * ============================================================ */
export type UserKeys = unknown; // TODO: User のキーのユニオン
export type UserValues = unknown; // TODO: User の値のユニオン（email は省略可能なので undefined も含まれます）

export type _t1 = Expect<Equal<UserKeys, 'id' | 'name' | 'email'>>;
export type _t2 = Expect<Equal<UserValues, number | string | undefined>>;

/* ============================================================
 * 演習 11-2: Partial を自作する
 * 組み込みの Partial を使わずに実装してください。
 *
 * Partial とは: 型 T のプロパティを「全部オプショナル（?）にした型」を作る型です（第10章）。
 *   型を渡すと、同じキーで、値の型はそのまま、全部に ? が付いた新しい型が返ります。
 *     MyPartial<{ a: number; b: string }>  →  { a?: number; b?: string }
 *   元の型を、「あるものだけ書けばよい」更新用の入力などに変えたいときに使います。
 *
 * 作り方: README の第2節「Mapped Types の基本形」で、T のキーを 1 つずつ回して
 *   プロパティを作る書き方を説明しています。その形に、? を付けるだけです。
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
 * 型 T から、キー K を「除いた残り」の型 StrictOmit を作ってください。
 *
 * Omit とは: 型から、指定したキーを除いた残りの型を作る型です（第10章）。Pick の逆です。
 *     Omit<{ id: number; name: string }, 'id'>  →  { name: string }
 *   作成用の入力（id はサーバが振るので、入力には含めない）などに使います。
 *
 * 「厳密」とは: 組み込みの Omit<User, 'emial'>（タイプミス）はエラーになりません。
 *   StrictOmit は K extends keyof T と書いてあるので、存在しないキーを渡すとエラーになります
 *   （この制約は最初から書いてあります）。
 *
 * 作り方: README 第2節の「回すキーを絞る・除く（Exclude）」の WithoutId と同じ形です。
 *   WithoutId は除くキーが 'id' に決まっていました。ここでは、それを型引数 K にします。
 *   [P in ...] の ... に何を入れるかだけを考えてください。値は T[P] のままです。
 *
 * 考え方（T = User、K = 'email' のとき）:
 *   keyof T                 = 'id' | 'name' | 'email'
 *   ここから K を除いたもの = 'id' | 'name'              ← これを [P in ...] の ... に入れる
 *   結果                    = { id: number; name: string }
 *
 * 下のコードの、TODO の隣にある never を、「keyof T から K を除いたキーのユニオン」に書き換えてください。
 * ============================================================ */
export type StrictOmit<T, K extends keyof T> = {
  [P in /* TODO */ never]: T[P];
};
export type _t6 = Expect<Equal<StrictOmit<User, 'email'>, { id: number; name: string }>>;

/* ============================================================
 * 演習 11-6: キー名を変換する（key remapping）
 * 各キーを「全部大文字」に作り変える UpperKeys を作ってください。
 *     UpperKeys<{ name: string; age: number }>  →  { NAME: string; AGE: number }
 *   値の型はそのままです。
 *
 * 作り方: README 第4節の Getters（as 句でキー名を作り変える）と同じ形です。変えるのは 2 か所だけです。
 *     Getters   : キー `get${Capitalize<string & K>}`   値 () => T[K]
 *     UpperKeys : キー Uppercase<string & K>             値 T[K]
 *   Uppercase<'name'> は 'NAME' です（Capitalize の「全部大文字」版。README 第4節）。
 *   string & K の意味も README 第4節にあります。
 * ============================================================ */
export type UpperKeys<T> = unknown; // TODO

export type _t7 = Expect<Equal<UpperKeys<{ name: string; age: number }>, { NAME: string; AGE: number }>>;

/* ============================================================
 * 演習 11-7: 値の型でキーを残す
 * 値が V に代入できるプロパティだけを残す PickByValue を作ってください。
 *     PickByValue<{ id: number; name: string; age: number }, number>  →  { id: number; age: number }
 *
 * 作り方: README 第4節の OmitByValue（値の型でキーを消す）の「逆」です。
 *   OmitByValue は「値が V に代入できるなら never（消す）、そうでなければ K（残す）」でした。
 *   こちらは「値が V に代入できるなら K（残す）、そうでなければ never（消す）」にします。
 *   条件型 A extends B ? X : Y の読み方は、README 第4節「条件型の最小限」にあります。
 *
 * 考え方（T = { id: number; name: string; age: number }、V = number のとき）:
 *   K = 'id'   : number extends number? はい   → 残す
 *   K = 'name' : string extends number? いいえ → 消す
 *   K = 'age'  : number extends number? はい   → 残す
 * ============================================================ */
export type PickByValue<T, V> = unknown; // TODO

export type _t8a = Expect<
  Equal<PickByValue<{ id: number; name: string; age: number }, number>, { id: number; age: number }>
>;
export type _t8b = Expect<Equal<PickByValue<{ id: number; name: string }, boolean>, {}>>;

/* ============================================================
 * 演習 11-8: 入れ子の中まで readonly にする（再帰）
 * ネストしたオブジェクトも含めて、すべて readonly にする DeepReadonly を作ってください。
 * 配列や関数のことはひとまず考えなくて構いません。
 *     DeepReadonly<{ a: number; b: { c: string } }>
 *       →  { readonly a: number; readonly b: { readonly c: string } }
 *
 * 作り方: README 第5節 (c) の DeepPartial と同じ形です。変えるのは 1 か所だけです。
 *     DeepPartial  : [K in keyof T]?: ...    ← ? を付ける
 *     DeepReadonly : ...                      ← ? の代わりに、何を付けますか？（README 第2節の表）
 *   「オブジェクトなら中身にも自分自身をかける」の部分は、そのまま同じです。
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
 *
 * 例:
 *   validate({ name: '', age: -1 })    → { name: '名前は必須です', age: '年齢が不正です' }
 *   validate({ name: 'ken', age: 20 }) → {}
 *   validate({ name: '', age: 20 })    → { name: '名前は必須です' }
 *
 * FormErrors<T> は、T の各キーについて「string 型のエラーメッセージ（省略可能）」を持つ型です。
 *   FormErrors<{ name: string; age: number }>  →  { name?: string; age?: string }
 *
 * 作り方: README 第5節 (a) の Labels と同じ形です。変えるのは 1 か所だけです。
 *   Labels は全フィールドが必須（string）でしたが、エラーは「あるものだけ」書けばよいので、
 *   省略可能にします（README 第2節の MyPartial と同じ印を付けます）。
 * ============================================================ */
export type FormErrors<T> = unknown; // TODO

export type Profile = { name: string; age: number };

export function validate(profile: Profile): FormErrors<Profile> {
  throw new Error('not implemented');
}

export type _t10 = Expect<Equal<FormErrors<Profile>, { name?: string; age?: string }>>;
