import type { Equal, Expect } from '../lib/type-test';

type User = { id: number; name: string; email?: string };
type ReadonlyUser = { readonly id: number; readonly name: string };

// 11-1
export type UserKeys = keyof User;
export type UserValues = User[keyof User];

export type _t1 = Expect<Equal<UserKeys, 'id' | 'name' | 'email'>>;
export type _t2 = Expect<Equal<UserValues, number | string | undefined>>;

// 11-2
export type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

export type _t3 = Expect<Equal<MyPartial<{ a: number; b: string }>, { a?: number; b?: string }>>;

// 11-3
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type _t4 = Expect<Equal<Mutable<ReadonlyUser>, { id: number; name: string }>>;

// 11-4
export type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type _t5 = Expect<Equal<MyPick<User, 'id'>, { id: number }>>;

// 11-5
// 回すキーを「keyof T から K を除いたもの」にする（as 句と条件型でも書けるが、Exclude のほうが素直）
export type StrictOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

export type _t6 = Expect<Equal<StrictOmit<User, 'email'>, { id: number; name: string }>>;

// 11-6
// keyof T は string | number | symbol になりうるので、
// Uppercase に渡す前に string & K で string に絞る
export type UpperKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
};

export type _t7 = Expect<Equal<UpperKeys<{ name: string; age: number }>, { NAME: string; AGE: number }>>;

// 11-7
// OmitByValue の ? : の「はい」側と「いいえ」側を入れ替える
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export type _t8a = Expect<
  Equal<PickByValue<{ id: number; name: string; age: number }, number>, { id: number; age: number }>
>;
export type _t8b = Expect<Equal<PickByValue<{ id: number; name: string }, boolean>, {}>>;

// 11-8
// DeepPartial の ? を readonly に変えたもの
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

export type _t9 = Expect<
  Equal<
    DeepReadonly<{ a: number; b: { c: string } }>,
    { readonly a: number; readonly b: { readonly c: string } }
  >
>;

// 11-9
export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type Profile = { name: string; age: number };

export function validate(profile: Profile): FormErrors<Profile> {
  const errors: FormErrors<Profile> = {};
  if (profile.name === '') errors.name = '名前は必須です';
  if (profile.age < 0) errors.age = '年齢が不正です';
  return errors;
}

export type _t10 = Expect<Equal<FormErrors<Profile>, { name?: string; age?: string }>>;
