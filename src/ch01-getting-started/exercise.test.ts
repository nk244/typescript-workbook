import { describe, expect, it } from 'vitest';
import { greet, REASON_1, REASON_2, withTax } from './exercise';

describe('1-1 withTax', () => {
  it('税込価格を切り捨てで返す', () => {
    expect(withTax(100)).toBe(110);
    expect(withTax(105)).toBe(115); // 115.5 -> 115
    expect(withTax(0)).toBe(0);
  });
});

describe('1-2 greet', () => {
  it('あいさつ文を返す', () => {
    expect(greet('西尾')).toBe('西尾さん、こんにちは');
  });
});

describe('1-4 エラーの説明', () => {
  it('自分の言葉で説明が書かれている', () => {
    expect(REASON_1.length).toBeGreaterThan(0);
    expect(REASON_2.length).toBeGreaterThan(0);
  });
});
