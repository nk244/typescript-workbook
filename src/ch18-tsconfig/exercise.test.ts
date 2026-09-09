import { describe, expect, it } from 'vitest';
import { CONFIRMED_INDEXED_ACCESS, firstChar, Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8 } from './exercise';

describe('18 コンパイラオプションのクイズ', () => {
  it('null の混入', () => expect(Q1).toBe('strictNullChecks'));
  it('暗黙の any', () => expect(Q2).toBe('noImplicitAny'));
  it('配列の範囲外', () => expect(Q3).toBe('noUncheckedIndexedAccess'));
  it('catch の型', () => expect(Q4).toBe('useUnknownInCatchVariables'));
  it('override の綴り', () => expect(Q5).toBe('noImplicitOverride'));
  it('switch の break 忘れ', () => expect(Q6).toBe('noFallthroughCasesInSwitch'));
  it('初期化漏れ', () => expect(Q7).toBe('strictPropertyInitialization'));
  it('型 import の消し忘れ', () => expect(Q8).toBe('verbatimModuleSyntax'));
});

describe('18-9 設定を触ってみる', () => {
  it('動く', () => expect(firstChar(['abc'])).toBe('abc'));
  it('自分で確かめた', () => expect(CONFIRMED_INDEXED_ACCESS).toBe(true));
});
