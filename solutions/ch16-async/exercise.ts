import type { Equal, Expect } from '../lib/type-test';

// 16-1
export async function fetchName(id: string): Promise<string> {
  return `user-${id}`;
}

export type _t1 = Expect<Equal<ReturnType<typeof fetchName>, Promise<string>>>;

// 16-2
export async function runSafely<T>(fn: () => Promise<T>): Promise<T | string> {
  try {
    return await fn();
  } catch (e) {
    // catch した値は unknown。Error だと決めつけない
    return e instanceof Error ? e.message : String(e);
  }
}

// 16-3
export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function parseNumber(input: string): Result<number, 'invalid-number'> {
  const n = Number(input);
  if (input.trim() === '' || Number.isNaN(n)) return { ok: false, error: 'invalid-number' };
  return { ok: true, value: n };
}

export type _t2 = Expect<
  Equal<
    Result<number, 'invalid-number'>,
    { ok: true; value: number } | { ok: false; error: 'invalid-number' }
  >
>;

// 16-4
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.value : fallback;
}

// 16-5
export async function loadAll() {
  const a = async (): Promise<string> => 'a';
  const b = async (): Promise<number> => 1;
  const c = async (): Promise<boolean> => true;
  // 配列リテラルを直接渡すとタプルとして推論される
  return Promise.all([a(), b(), c()]);
}

export type _t3 = Expect<Equal<Awaited<ReturnType<typeof loadAll>>, [string, number, boolean]>>;

// 16-6
export async function processSerial<T, U>(
  items: readonly T[],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  const out: U[] = [];
  for (const item of items) {
    out.push(await fn(item));
  }
  return out;
}

export async function processParallel<T, U>(
  items: readonly T[],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  // map で Promise の配列を作ってから待つ。結果の順序は入力順のまま保たれる
  return Promise.all(items.map(fn));
}

// 16-7
export async function collectFulfilled<T>(promises: readonly Promise<T>[]): Promise<T[]> {
  const settled = await Promise.allSettled(promises);
  // PromiseSettledResult は status を判別子に持つ判別可能なユニオン
  return settled.filter((r) => r.status === 'fulfilled').map((r) => r.value);
}

// 16-8
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    }),
  ]);
}
