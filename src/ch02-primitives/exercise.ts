import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 2-1: unknown を安全に使う
 * 受け取った値が string なら大文字にして返し、
 * number なら文字列に変換して返し、
 * それ以外なら '不明' を返してください。
 * 引数の型は unknown のまま変えないこと。
 * ============================================================ */
export function describeValue(value: unknown): string {
  if (typeof (value) === 'string') {
    return value.toUpperCase();
  } else if (typeof (value) === 'number') {
    return value.toString();
  } else {
    return '不明';
  }
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 2-2: null / undefined / 空文字を潰す
 * name が null か undefined か空文字なら '名無し' を、
 * そうでなければ name をそのまま返してください。
 * ?? と || の違いを意識すること。
 * ============================================================ */
export function displayName(name: string | null | undefined): string {
  return name || '名無し';
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 2-3: never を返す関数
 * 必ず例外を投げる関数です。戻り値型に never をつけてください。
 * ============================================================ */
export function assertNever(message: string): never {
  throw new Error(message);
}

/* ============================================================
 * 演習 2-4: 型レベル問題「代入できるか」
 * unknown と書いてある部分を true / false に書き換えてエラーを消すこと。
 * ============================================================ */
// [] で囲む理由は第12章（Conditional Types）で説明します。今は気にしなくて OK。
type Assignable<A, B> = [A] extends [B] ? true : false;

// 42 を number の場所に置けるか？
export type _t1 = Expect<Equal<Assignable<42, number>, true>>;
// number を 42 の場所に置けるか？
export type _t2 = Expect<Equal<Assignable<number, 42>, false>>;
// never を string の場所に置けるか？
export type _t3 = Expect<Equal<Assignable<never, string>, true>>;
// string を unknown の場所に置けるか？
export type _t4 = Expect<Equal<Assignable<string, unknown>, true>>;

/* ============================================================
 * 演習 2-5: any の危険を体験する
 * 下の関数は any のせいで実行時に落ちます。
 * 引数の型を unknown に変え、必要な検査を足して
 * 「配列でなければ 0 を返す」ようにしてください。
 * ============================================================ */
export function countItems(input: unknown): number {
  if (!Array.isArray(input)) {
    return 0;
  }
  return input.length;
}
