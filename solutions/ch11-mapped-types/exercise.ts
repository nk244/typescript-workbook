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
// as 句で「除きたいキーなら never」にすると、そのキーは結果から消える
export type StrictOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export type _t6 = Expect<Equal<StrictOmit<User, 'email'>, { id: number; name: string }>>;

// 11-6
// keyof T は string | number | symbol になりうるので、
// Capitalize に渡す前に string & K で string に絞る
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

export type _t7 = Expect<
  Equal<Getters<{ name: string; age: number }>, { getName: () => string; getAge: () => number }>
>;

// 11-7
export type FunctionKeysOnly<T> = {
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? K : never]: T[K];
};

export type _t8 = Expect<
  Equal<
    FunctionKeysOnly<{ id: number; save: () => void; load: (n: number) => string }>,
    { save: () => void; load: (n: number) => string }
  >
>;

// 11-8
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
