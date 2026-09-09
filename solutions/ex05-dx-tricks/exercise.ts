import type { Equal, Expect } from '../lib/type-test';

type User = { id: number; name: string; email: string };

// ex05-1
// 中身は同じだが「展開済み」の新しい型を作る。& {} は展開を確実にするための定番
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type _t1 = Expect<
  Equal<
    Prettify<Omit<User, 'id'> & { onSave: () => void }>,
    { name: string; email: string; onSave: () => void }
  >
>;

// ex05-2
export function compact<T>(items: readonly T[]): NonNullable<T>[] {
  // TS 5.5 以降は (item) => item != null でも型述語が推論されるが、
  // 戻り値型を明示しているのでここでは filter の結果を素直に返す
  return items.filter((item): item is NonNullable<T> => item !== null && item !== undefined);
}

// ex05-3
// Object.keys が string[] を返すのは「余分なキーを持つオブジェクトも代入できる」から。
// 自分が作ったリテラルにだけ使う、という前提を置いた上で as で嘘をつく
export function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function objectEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export type _t2 = Expect<Equal<ReturnType<typeof objectKeys<User>>, (keyof User)[]>>;
export type _t3 = Expect<
  Equal<ReturnType<typeof objectEntries<User>>, [keyof User, User[keyof User]][]>
>;

// ex05-4
export type Invalid<Message extends string> = { readonly __error: Message };

export type RequireId<T> = 'id' extends keyof T ? T : Invalid<'id プロパティが必要です'>;

export type _t4 = Expect<Equal<RequireId<{ id: number }>, { id: number }>>;
export type _t5 = Expect<Equal<RequireId<{ name: string }>, Invalid<'id プロパティが必要です'>>>;

// ex05-5
export class Span implements Disposable {
  constructor(
    public readonly name: string,
    private readonly log: string[],
  ) {
    this.log.push(`start:${name}`);
  }

  [Symbol.dispose](): void {
    this.log.push(`end:${this.name}`);
  }
}

export function runWithSpan(log: string[]): void {
  // スコープを抜けるときに自動で [Symbol.dispose]() が呼ばれる
  using span = new Span('work', log);
  log.push(span.name);
}

// ex05-6
export const inferred = { id: 1, tags: ['a', 'b'] } as const;

export type InferredType = { readonly id: 1; readonly tags: readonly ['a', 'b'] };

export type _t6 = Expect<Equal<InferredType, typeof inferred>>;
