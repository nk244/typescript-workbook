import { describe, expect, it } from 'vitest';
import { GLOBAL_DECLARED, priceLabel, queryValue, setupBus } from './exercise';

describe('15-2 legacy-lib を使う', () => {
  it('金額を整形', () => expect(priceLabel(1200)).toBe('¥1,200'));
  it('クエリを読む', () => {
    expect(queryValue('?a=1&b=hello', 'a')).toBe('1');
    expect(queryValue('?a=1', 'z')).toBeUndefined();
  });
});

describe('15-3 EventBus', () => {
  it('購読して受け取れる', () => {
    const { bus, loginNames } = setupBus();
    bus.emit('login', { userId: 'u1' });
    bus.emit('login', { userId: 'u2' });
    expect(loginNames).toEqual(['u1', 'u2']);
  });
});

describe('15-5 グローバル宣言', () => {
  it('globals.d.ts を作った', () => expect(GLOBAL_DECLARED).toBe(true));
});
