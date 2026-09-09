import type { Equal, Expect } from '../lib/type-test';

// ex06-1
// T が出力にしか現れない -> 共変（out）
export interface Producer<out T> {
  get(): T;
}

// T が入力にしか現れない -> 反変（in）
export interface Consumer<in T> {
  set(value: T): void;
}

// 入出力の両方に現れる -> 不変（in out）
export interface Store<in out T> {
  get(): T;
  set(value: T): void;
}

export type _t1 = Expect<Equal<Producer<'a'> extends Producer<string> ? true : false, true>>;
export type _t2 = Expect<Equal<Consumer<string> extends Consumer<'a'> ? true : false, true>>;
export type _t3 = Expect<Equal<Store<'a'> extends Store<string> ? true : false, false>>;

// ex06-2
export type DataAttrs = { [K in `data-${string}`]: string };

export const attrs: DataAttrs = { 'data-id': '1', 'data-role': 'row' };

// @ts-expect-error data- で始まらないキーは許されない
export const badAttrs: DataAttrs = { id: '1' };

// ex06-3
export class Temperature {
  #celsius = 0;

  // 出すときは狭く、入れるときは広く
  get celsius(): number {
    return this.#celsius;
  }

  set celsius(value: number | string) {
    this.#celsius = Number(value);
  }
}

// ex06-4
// infer に extends を付けると、推論結果をその型として扱える
export type ToNumber<S> = S extends `${infer N extends number}` ? N : never;

export type _t4 = Expect<Equal<ToNumber<'42'>, 42>>;
export type _t5 = Expect<Equal<ToNumber<'abc'>, never>>;

// ex06-5
export type Ctor<T> = new (...args: never[]) => T;
// abstract を付けると抽象クラスも受け取れる（new はできないが instanceof には使える）
export type AbstractCtor<T> = abstract new (...args: never[]) => T;

export function create<T>(C: Ctor<T>): T {
  return new C();
}

export function isInstance<T>(C: AbstractCtor<T>, value: unknown): value is T {
  return value instanceof (C as Ctor<T>);
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

// ex06-6
export function makeBox<T>(value: T): { value: T } {
  return { value };
}

// インスタンス化式: 呼び出さずに型引数だけを固定する
export const makeNumberBox = makeBox<number>;

export type _t6 = Expect<Equal<ReturnType<typeof makeNumberBox>, { value: number }>>;
