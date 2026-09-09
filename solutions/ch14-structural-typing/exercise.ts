import type { Equal, Expect } from '../lib/type-test';

// 14-1
type Animal = { name: string };
type Dog = { name: string; breed: string };

// Dog は Animal の要求（name）を満たしている
export const DOG_TO_ANIMAL: boolean = true;
// Animal には breed がないので Dog にはなれない
export const ANIMAL_TO_DOG: boolean = false;
// 配列は共変（便利さ優先。readonly にすれば安全）
export const DOG_ARRAY_TO_ANIMAL_ARRAY: boolean = true;
// 引数は反変。Animal を扱える関数は Dog も扱える
export const ANIMAL_FN_TO_DOG_FN: boolean = true;
// Dog しか扱えない関数に Animal が来ると壊れる
export const DOG_FN_TO_ANIMAL_FN: boolean = false;

export type _unused = [Animal, Dog];

// 14-2
// 実行時には存在しないタグを混ぜて、名前的部分型を擬似的に作る
export type UserId = string & { readonly __brand: 'UserId' };
export type Email = string & { readonly __brand: 'Email' };

export function asUserId(raw: string): UserId {
  return raw as UserId;
}

export function asEmail(raw: string): Email {
  if (raw.includes('@') === false) throw new Error(`不正なメールアドレス: ${raw}`);
  return raw as Email;
}

export type _t1 = Expect<Equal<UserId extends Email ? true : false, false>>;
export type _t2 = Expect<Equal<string extends UserId ? true : false, false>>;

// 14-3
export function names(animals: readonly Animal[]): string[] {
  return animals.map((a) => a.name);
}

// 14-4
// satisfies なら「値はすべてスラッシュ始まり」を検査しつつ、リテラル型の推論は保たれる
export const ROUTES = {
  home: '/',
  users: '/users',
  user: '/users/:id',
} satisfies Record<string, `/${string}`>;

export type RouteName = keyof typeof ROUTES;
export type HomePath = (typeof ROUTES)['home'];

export type _t3 = Expect<Equal<RouteName, 'home' | 'users' | 'user'>>;
export type _t4 = Expect<Equal<HomePath, '/'>>;

// 14-5
const RAW = { a: 'x' };

// 型注釈: 検査はされるが、型は Record<string, string> に広がる
export const annotated: Record<string, string> = RAW;
// satisfies: 検査はされ、推論結果（{ a: string }）は保たれる
export const satisfied = RAW satisfies Record<string, string>;
// as: 検査されない。コンパイラに黙って型を宣言するだけ
export const asserted = RAW as Record<string, string>;

export type _t5 = Expect<Equal<typeof annotated, Record<string, string>>>;
export type _t6 = Expect<Equal<(typeof satisfied)['a'], string>>;
export type _t7 = Expect<Equal<typeof asserted, Record<string, string>>>;

// 14-6
export function sendMail(to: Email, body: string): string {
  return `${to} に送信: ${body}`;
}
