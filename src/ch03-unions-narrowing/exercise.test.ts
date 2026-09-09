import { describe, expect, it } from 'vitest';
import { canCancel, formatLater, speak, sum, toMessage, toNumber } from './exercise';

describe('3-1 toNumber', () => {
  it('数値はそのまま', () => expect(toNumber(42)).toBe(42));
  it('数字文字列は変換', () => expect(toNumber('42')).toBe(42));
  it('変換できないものは 0', () => expect(toNumber('abc')).toBe(0));
});

describe('3-2 canCancel', () => {
  it('pending と shipped はキャンセル可', () => {
    expect(canCancel('pending')).toBe(true);
    expect(canCancel('shipped')).toBe(true);
  });
  it('それ以外は不可', () => {
    expect(canCancel('delivered')).toBe(false);
    expect(canCancel('cancelled')).toBe(false);
  });
});

describe('3-3 sum', () => {
  it('null は 0', () => expect(sum(null)).toBe(0));
  it('空配列は 0', () => expect(sum([])).toBe(0));
  it('合計を返す', () => expect(sum([1, 2, 3])).toBe(6));
});

describe('3-4 speak', () => {
  it('犬', () => expect(speak({ name: 'ポチ', bark: () => 'ワン' })).toBe('ワン'));
  it('猫', () => expect(speak({ name: 'タマ', meow: () => 'ニャー' })).toBe('ニャー'));
});

describe('3-5 formatLater', () => {
  it('名前があれば大文字', () => expect(formatLater({ name: 'ken' })()).toBe('KEN'));
  it('null なら ANONYMOUS', () => expect(formatLater({ name: null })()).toBe('ANONYMOUS'));
});

describe('3-6 toMessage', () => {
  it('Error', () => expect(toMessage(new Error('壊れた'))).toBe('壊れた'));
  it('string', () => expect(toMessage('文字列エラー')).toBe('文字列エラー'));
  it('その他', () => expect(toMessage({ code: 500 })).toBe('不明なエラー'));
});
