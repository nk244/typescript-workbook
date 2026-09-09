import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 ex06-1: 変性注釈を付ける
 * 3 つのインターフェースに正しい変性注釈（in / out / in out）を
 * 付けてください。間違った注釈を書くとコンパイルエラーになります。
 * ============================================================ */
export interface Producer<T> {
  get(): T;
}

export interface Consumer<T> {
  set(value: T): void;
}

export interface Store<T> {
  get(): T;
  set(value: T): void;
}

// 変性が正しければ、次の代入可能性が成り立つ
export type _t1 = Expect<Equal<Producer<'a'> extends Producer<string> ? true : false, true>>;
export type _t2 = Expect<Equal<Consumer<string> extends Consumer<'a'> ? true : false, true>>;
export type _t3 = Expect<Equal<Store<'a'> extends Store<string> ? true : false, false>>;

/* ============================================================
 * 演習 ex06-2: テンプレートリテラルのインデックスシグネチャ
 * 'data-' で始まるキーだけを許す型を作ってください。
 * ============================================================ */
export type DataAttrs = unknown; // TODO

export const attrs: DataAttrs = { 'data-id': '1', 'data-role': 'row' };

// @ts-expect-error data- で始まらないキーは許されない
export const badAttrs: DataAttrs = { id: '1' };

/* ============================================================
 * 演習 ex06-3: getter と setter で型を変える
 * celsius は number を返し、number | string を受け取れるようにしてください。
 * ============================================================ */
export class Temperature {
  #celsius = 0;

  get celsius(): number {
    return this.#celsius;
  }

  // TODO: number | string を受け取れる setter を追加する
}

/* ============================================================
 * 演習 ex06-4: infer ... extends
 * 数字だけの文字列を、数値リテラル型に変換する型を作ってください。
 * ============================================================ */
export type ToNumber<S> = unknown; // TODO

export type _t4 = Expect<Equal<ToNumber<'42'>, 42>>;
export type _t5 = Expect<Equal<ToNumber<'abc'>, never>>;

/* ============================================================
 * 演習 ex06-5: construct signature
 * クラスを受け取ってインスタンスを作る create と、
 * 抽象クラスも渡せる isInstance を実装してください。
 * ============================================================ */
export type Ctor<T> = unknown; // TODO
export type AbstractCtor<T> = unknown; // TODO

export function create(C: unknown): unknown {
  // TODO
  throw new Error('not implemented');
}

export function isInstance(C: unknown, value: unknown): boolean {
  // TODO: 戻り値を型述語にする
  throw new Error('not implemented');
}

export abstract class Shape {
  abstract area(): number;
}

export class Square extends Shape {
  constructor(public size = 2) {
    super();
  }
  override area(): number {
    return this.size ** 2;
  }
}

/* ============================================================
 * 演習 ex06-6: インスタンス化式
 * makeBox の型引数を number に固定した関数を作ってください（呼び出さずに）。
 * ============================================================ */
export function makeBox<T>(value: T): { value: T } {
  return { value };
}

export const makeNumberBox = makeBox; // TODO: number に固定する

export type _t6 = Expect<Equal<ReturnType<typeof makeNumberBox>, { value: number }>>;
