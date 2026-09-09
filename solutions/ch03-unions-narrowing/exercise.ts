import type { Equal, Expect } from '../lib/type-test';

// 3-1
export function toNumber(input: string | number): number {
  if (typeof input === 'number') return input;
  const parsed = Number(input);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// 3-2
export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export function canCancel(status: OrderStatus): boolean {
  return status === 'pending' || status === 'shipped';
}

export type _t1 = Expect<Equal<OrderStatus, 'pending' | 'shipped' | 'delivered' | 'cancelled'>>;

// 3-3
export function sum(items: number[] | null): number {
  if (items === null) return 0; // 早期 return でこの下は number[] に確定する
  return items.reduce((acc, n) => acc + n, 0);
}

// 3-4
export type Dog = { name: string; bark: () => string };
export type Cat = { name: string; meow: () => string };

export function speak(animal: Dog | Cat): string {
  // 'bark' in animal で Dog 側に絞り込まれる
  return 'bark' in animal ? animal.bark() : animal.meow();
}

// 3-5
export function formatLater(user: { name: string | null }): () => string {
  // 絞り込みの結果はコールバックの中まで持ち越せない（間に再代入が起きるかも
  // しれないとコンパイラは考える）。ローカル定数に取り出せば、その定数は
  // 二度と変わらないので narrowing が維持される。
  const name = user.name;
  if (name !== null) {
    return () => name.toUpperCase();
  }
  return () => 'ANONYMOUS';
}

// 3-6
export function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '不明なエラー';
}
