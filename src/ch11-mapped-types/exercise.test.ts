import { describe, expect, it } from 'vitest';
import { validate } from './exercise';

describe('11-9 validate', () => {
  it('問題なければ空', () => {
    expect(validate({ name: 'ken', age: 30 })).toEqual({});
  });
  it('名前が空', () => {
    expect(validate({ name: '', age: 30 })).toEqual({ name: '名前は必須です' });
  });
  it('年齢が不正', () => {
    expect(validate({ name: 'ken', age: -1 })).toEqual({ age: '年齢が不正です' });
  });
  it('両方', () => {
    expect(validate({ name: '', age: -1 })).toEqual({
      name: '名前は必須です',
      age: '年齢が不正です',
    });
  });
});
