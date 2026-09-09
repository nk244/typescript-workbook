import type { Equal, Expect } from '../lib/type-test';

export type ActionMap = {
  add: { text: string };
  remove: { id: number };
  clear: object;
};

/* ============================================================
 * 演習 ex02-1: 対応表から判別可能なユニオンを作る
 * ============================================================ */
export type ActionFrom<M> = unknown; // TODO

export type Action = ActionFrom<ActionMap>;

export type _t1 = Expect<
  Equal<
    Action,
    | ({ type: 'add' } & { text: string })
    | ({ type: 'remove' } & { id: number })
    | ({ type: 'clear' } & object)
  >
>;

/* ============================================================
 * 演習 ex02-2: ユニオンから 1 つ取り出す
 * type が K のアクションの、type を除いた部分（payload）を取り出す型。
 * ============================================================ */
export type PayloadOf<K> = unknown; // TODO

export type _t2 = Expect<Equal<PayloadOf<'add'>, { text: string }>>;
export type _t3 = Expect<Equal<PayloadOf<'remove'>, { id: number }>>;

/* ============================================================
 * 演習 ex02-3: Omit が分配されないことを確認し、直す
 * ============================================================ */
type Shape = { kind: 'circle'; radius: number } | { kind: 'rect'; width: number };

// まず、素の Omit の結果を答えてください（共通キーしか残らない）
// ヒント: Omit<T, K> の中身は Pick<T, Exclude<keyof T, K>>
export type PlainOmitResult = unknown; // TODO

export type _t4 = Expect<Equal<Omit<Shape, 'kind'>, PlainOmitResult>>;

// 次に、分配される Omit を作ってください
export type DistributiveOmit<T, K extends PropertyKey> = unknown; // TODO

export type _t5 = Expect<
  Equal<DistributiveOmit<Shape, 'kind'>, { radius: number } | { width: number }>
>;

/* ============================================================
 * 演習 ex02-4: UnionToIntersection
 * ユニオンを交差型に変換する型を作ってください。
 * ヒント: 関数の引数は反変（第14章）。
 * ============================================================ */
export type UnionToIntersection<U> = unknown; // TODO

export type _t6 = Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>;
export type _t7 = Expect<Equal<UnionToIntersection<string | number>, never>>;

/* ============================================================
 * 演習 ex02-5: 排他的な props
 * href と onClick の「どちらか一方だけ」を許す型を作ってください。
 * ============================================================ */
export type Without<T, U> = unknown; // TODO
export type XOR<T, U> = unknown; // TODO

export type LinkOrButton = XOR<{ href: string }, { onClick: () => void }>;

// どちらか一方なら代入できる
export const okA: LinkOrButton = { href: '/' };
export const okB: LinkOrButton = { onClick: () => {} };
// 両方を渡すとエラーになること（コメントを外して確認したら戻す）
// export const ng: LinkOrButton = { href: '/', onClick: () => {} };

/* ============================================================
 * 演習 ex02-6: 実用 — 型安全な action creator
 * type と payload を受け取り、対応するアクションを作る関数を実装してください。
 *   createAction('add', { text: 'a' })  -> { type: 'add', text: 'a' }
 * 間違った組み合わせはコンパイルエラーになること。
 * ============================================================ */
export function createAction(type: unknown, payload: unknown): unknown {
  // TODO: シグネチャをジェネリックにする
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex02-7: 網羅を値でも保証する
 * Status のラベル表を、リテラル型を保ったまま網羅チェックしてください。
 * （型注釈ではなく satisfies を使うこと）
 * ============================================================ */
export type Status = 'idle' | 'loading' | 'done';

// ヒント: satisfies だけだと値は string に広がる。リテラルを保つには？
export const LABELS = {
  idle: '待機',
  loading: '読込',
  done: '完了',
}; // TODO

export type _t8 = Expect<Equal<(typeof LABELS)['idle'], '待機'>>;
