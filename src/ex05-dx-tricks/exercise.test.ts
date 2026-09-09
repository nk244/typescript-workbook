import { describe, expect, it } from 'vitest';
import { compact, objectEntries, objectKeys, runWithSpan } from './exercise';

describe('ex05-2 compact', () => {
  it('null と undefined を除く', () => {
    expect(compact([1, null, 2, undefined])).toEqual([1, 2]);
  });
  it('0 や空文字は残す', () => {
    expect(compact([0, '', null])).toEqual([0, '']);
  });
});

describe('ex05-3 objectKeys / objectEntries', () => {
  it('キーが取れる', () => {
    expect(objectKeys({ a: 1, b: 2 } as never)).toEqual(['a', 'b']);
  });
  it('エントリが取れる', () => {
    expect(objectEntries({ a: 1 } as never)).toEqual([['a', 1]]);
  });
});

describe('ex05-5 using', () => {
  it('スコープを抜けると自動で終了処理が走る', () => {
    const log: string[] = [];
    runWithSpan(log);
    expect(log).toEqual(['start:work', 'work', 'end:work']);
  });
});
