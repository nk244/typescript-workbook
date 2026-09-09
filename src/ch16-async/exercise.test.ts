import { describe, expect, it } from 'vitest';
import {
  collectFulfilled,
  fetchName,
  loadAll,
  parseNumber,
  processParallel,
  processSerial,
  runSafely,
  unwrapOr,
  withTimeout,
} from './exercise';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('16-1 fetchName', () => {
  it('名前を返す', async () => expect(await fetchName('1')).toBe('user-1'));
});

describe('16-2 runSafely', () => {
  it('成功', async () => expect(await runSafely(async () => 42)).toBe(42));
  it('Error', async () =>
    expect(
      await runSafely(async () => {
        throw new Error('壊れた');
      }),
    ).toBe('壊れた'));
  it('Error 以外', async () =>
    expect(
      await runSafely(async () => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- Error 以外も throw できることを示す例
        throw 'ただの文字列';
      }),
    ).toBe('ただの文字列'));
});

describe('16-3/16-4 Result', () => {
  it('成功', () => expect(parseNumber('42')).toEqual({ ok: true, value: 42 }));
  it('失敗', () => expect(parseNumber('abc')).toEqual({ ok: false, error: 'invalid-number' }));
  it('unwrapOr', () => {
    expect(unwrapOr(parseNumber('42'), 0)).toBe(42);
    expect(unwrapOr(parseNumber('abc'), -1)).toBe(-1);
  });
});

describe('16-5 loadAll', () => {
  it('タプルで返る', async () => expect(await loadAll()).toEqual(['a', 1, true]));
});

describe('16-6 直列と並行', () => {
  it('直列は順番に実行される', async () => {
    const order: number[] = [];
    const result = await processSerial([3, 1, 2], async (n) => {
      await delay(n * 5);
      order.push(n);
      return n * 2;
    });
    expect(result).toEqual([6, 2, 4]);
    expect(order).toEqual([3, 1, 2]);
  });
  it('並行は早い順に終わる', async () => {
    const order: number[] = [];
    const result = await processParallel([3, 1, 2], async (n) => {
      await delay(n * 5);
      order.push(n);
      return n * 2;
    });
    expect(result).toEqual([6, 2, 4]);
    expect(order).toEqual([1, 2, 3]);
  });
});

describe('16-7 collectFulfilled', () => {
  it('成功したものだけ', async () => {
    const result = await collectFulfilled([
      Promise.resolve(1),
      Promise.reject(new Error('だめ')),
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 3]);
  });
});

describe('16-8 withTimeout', () => {
  it('間に合えば値', async () => {
    expect(await withTimeout(delay(1).then(() => 'ok'), 50)).toBe('ok');
  });
  it('間に合わなければ reject', async () => {
    await expect(withTimeout(delay(50).then(() => 'ok'), 5)).rejects.toThrow('timeout');
  });
});
