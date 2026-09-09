import type { Equal, Expect } from '../lib/type-test';

export type ActionMap = {
  add: { text: string };
  remove: { id: number };
  clear: object;
};

// ex02-1
// Mapped Type で作ったオブジェクトを [keyof M] で「値のユニオン」として取り出す
export type ActionFrom<M> = {
  [K in keyof M]: { type: K } & M[K];
}[keyof M];

export type Action = ActionFrom<ActionMap>;

export type _t1 = Expect<
  Equal<
    Action,
    | ({ type: 'add' } & { text: string })
    | ({ type: 'remove' } & { id: number })
    | ({ type: 'clear' } & object)
  >
>;

// ex02-2
export type PayloadOf<K> = Omit<Extract<Action, { type: K }>, 'type'>;

export type _t2 = Expect<Equal<PayloadOf<'add'>, { text: string }>>;
export type _t3 = Expect<Equal<PayloadOf<'remove'>, { id: number }>>;

// ex02-3
type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; width: number };

// Omit<T, K> の実装は Pick<T, Exclude<keyof T, K>>。
// keyof (A | B) は共通キーだけなので、'kind' を除くと Pick<Shape, never> になる
export type PlainOmitResult = Pick<Shape, never>;

export type _t4 = Expect<Equal<Omit<Shape, 'kind'>, PlainOmitResult>>;

// T extends unknown ? ... : never は「絞り込まないが分配だけ起こす」イディオム
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type _t5 = Expect<
  Equal<DistributiveOmit<Shape, 'kind'>, { radius: number } | { width: number }>
>;

// ex02-4
// 1) 分配して関数型のユニオンを作り
// 2) 引数位置（反変）から infer させると交差型になる
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

export type _t6 = Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>;
// string & number は成立しないので never になる
export type _t7 = Expect<Equal<UnionToIntersection<string | number>, never>>;

// ex02-5
// 「相手にしかないキーは、あってはいけない（?: never）」で排他にする
export type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

export type LinkOrButton = XOR<{ href: string }, { onClick: () => void }>;

export const okA: LinkOrButton = { href: '/' };
export const okB: LinkOrButton = { onClick: () => {} };

// ex02-6
export function createAction<K extends Action['type']>(
  type: K,
  payload: PayloadOf<K>,
): Extract<Action, { type: K }> {
  return { type, ...payload } as Extract<Action, { type: K }>;
}

// ex02-7
export type Status = 'idle' | 'loading' | 'done';

// satisfies だけだと値は string に広がる（文脈型が string だから）。
// リテラル型まで保ちたいときは as const と組み合わせる
export const LABELS = {
  idle: '待機',
  loading: '読込',
  done: '完了',
} as const satisfies Record<Status, string>;

export type _t8 = Expect<Equal<(typeof LABELS)['idle'], '待機'>>;
