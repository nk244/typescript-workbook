import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 14-1: 代入できるかを予想する
 * true / false を入れてください。
 * ============================================================ */
type Animal = { name: string };
type Dog = { name: string; breed: string };

// Dog を Animal に代入できる？
export const DOG_TO_ANIMAL: boolean = false; // TODO
// Animal を Dog に代入できる？
export const ANIMAL_TO_DOG: boolean = false; // TODO
// Dog[] を Animal[] に代入できる？
export const DOG_ARRAY_TO_ANIMAL_ARRAY: boolean = false; // TODO
// (a: Animal) => void を (d: Dog) => void に代入できる？
export const ANIMAL_FN_TO_DOG_FN: boolean = false; // TODO
// (d: Dog) => void を (a: Animal) => void に代入できる？
export const DOG_FN_TO_ANIMAL_FN: boolean = false; // TODO

export type _unused = [Animal, Dog];

/* ============================================================
 * 演習 14-2: ブランド型を作る
 * UserId と Email を、ただの string と混同できない型にしてください。
 * ヒント: string と「実行時には存在しないタグ」の交差型にします。
 * ============================================================ */
export type UserId = unknown; // TODO
export type Email = unknown; // TODO

// 変換関数（ここだけが as を使ってよい場所）
export function asUserId(raw: string): UserId {
  throw new Error('not implemented');
}

export function asEmail(raw: string): Email {
  // '@' を含まなければ Error を投げること
  throw new Error('not implemented');
}

// ブランドが効いていれば、この 2 つは互いに代入できない
export type _t1 = Expect<Equal<UserId extends Email ? true : false, false>>;
export type _t2 = Expect<Equal<string extends UserId ? true : false, false>>;

/* ============================================================
 * 演習 14-3: readonly で共変の穴を塞ぐ
 * 配列の中身を一切書き換えない関数として、シグネチャを直してください。
 * （呼び出し側が readonly 配列を渡せるようにもなります）
 * ============================================================ */
export function names(animals: Animal[]): string[] {
  return animals.map((a) => a.name);
}

/* ============================================================
 * 演習 14-4: satisfies を使う
 * ROUTES に「値はすべて / で始まる文字列」という制約をかけつつ、
 * キーと値のリテラル型は保ってください。
 * ============================================================ */
export const ROUTES = {
  home: '/',
  users: '/users',
  user: '/users/:id',
}; // TODO: satisfies を足す

export type RouteName = keyof typeof ROUTES;
export type HomePath = (typeof ROUTES)['home'];

export type _t3 = Expect<Equal<RouteName, 'home' | 'users' | 'user'>>;
// satisfies が正しく書けていれば、値もリテラル型のまま
export type _t4 = Expect<Equal<HomePath, '/'>>;

/* ============================================================
 * 演習 14-5: 型注釈 / satisfies / as の違い
 * 3 つの変数を、下のテストが通るように書き分けてください。
 * ============================================================ */
const RAW = { a: 'x' };

export const annotated = RAW; // TODO: Record<string, string> の型注釈をつける
export const satisfied = RAW; // TODO: satisfies Record<string, string> を使う
export const asserted = RAW; // TODO: as Record<string, string> を使う

export type _t5 = Expect<Equal<typeof annotated, Record<string, string>>>;
export type _t6 = Expect<Equal<(typeof satisfied)['a'], string>>;
export type _t7 = Expect<Equal<typeof asserted, Record<string, string>>>;

/* ============================================================
 * 演習 14-6: 実用 — ブランド型でバグを防ぐ
 * sendMail は Email しか受け取らないようにしてください。
 * ============================================================ */
export function sendMail(to: string, body: string): string {
  return `${to} に送信: ${body}`;
}
