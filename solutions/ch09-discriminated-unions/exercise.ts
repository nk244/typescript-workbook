import type { Equal, Expect } from '../lib/type-test';

// 9-1 / 9-7（square まで対応した版）
export type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }
  | { kind: 'square'; size: number };

// 9-2
export function assertNever(value: never): never {
  throw new Error(`未対応のケース: ${JSON.stringify(value)}`);
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rect':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    case 'square':
      return shape.size ** 2;
    default:
      // ここに到達する型が never でなければコンパイルエラーになる＝書き忘れ検出
      return assertNever(shape);
  }
}

// 9-3
export type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };

export type _t1 = Expect<
  Equal<
    RequestState,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: string[] }
    | { status: 'error'; message: string }
  >
>;

// 9-4
export function renderState(state: RequestState): string {
  switch (state.status) {
    case 'idle':
      return '待機中';
    case 'loading':
      return '読み込み中...';
    case 'success':
      // success のときだけ data が存在する。null チェックが要らない
      return `${state.data.length} 件`;
    case 'error':
      return `エラー: ${state.message}`;
    default:
      return assertNever(state);
  }
}

// 9-5
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

// 9-6
export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('値が存在しません');
  }
}

// 9-7
export const EXHAUSTIVE_CONFIRMED = true;
