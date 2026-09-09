import { describe, expect, it } from 'vitest';
import { create, isInstance, makeNumberBox, Shape, Square, Temperature } from './exercise';

describe('ex06-3 Temperature', () => {
  it('数値でも文字列でも入れられる', () => {
    const t = new Temperature();
    t.celsius = 20;
    expect(t.celsius).toBe(20);
    t.celsius = '25';
    expect(t.celsius).toBe(25);
  });
});

describe('ex06-5 construct signature', () => {
  it('インスタンスを作れる', () => {
    const square = create(Square as never) as Square;
    expect(square.area()).toBe(4);
  });
  it('抽象クラスでも instanceof を判定できる', () => {
    expect(isInstance(Shape as never, new Square())).toBe(true);
    expect(isInstance(Shape as never, {})).toBe(false);
  });
});

describe('ex06-6 インスタンス化式', () => {
  it('number に固定された関数', () => {
    expect(makeNumberBox(1)).toEqual({ value: 1 });
  });
});
