import { describe, expect, it } from 'vitest';
import { EXCESS_LINE, getScore, jsonDepth, publishedYear, type Book } from './exercise';

const book: Book = {
  id: 1,
  title: '型システム入門',
  author: 'Pierce',
  publishedAt: new Date('2024-05-01'),
  tags: ['cs'],
};

describe('4-2 publishedYear', () => {
  it('日付があれば年', () => expect(publishedYear(book)).toBe('2024年'));
  it('なければ未刊', () => {
    const { publishedAt, ...rest } = book;
    expect(publishedYear(rest)).toBe('未刊');
  });
});

describe('4-4 過剰プロパティチェック', () => {
  it('リテラル直代入のほうがエラーになる', () => expect(EXCESS_LINE).toBe('a'));
});

describe('4-5 getScore', () => {
  it('あれば値', () => expect(getScore({ math: 80 }, 'math')).toBe(80));
  it('なければ 0', () => expect(getScore({ math: 80 }, 'history')).toBe(0));
});

describe('4-6 jsonDepth', () => {
  it('プリミティブは 0', () => {
    expect(jsonDepth(1)).toBe(0);
    expect(jsonDepth('a')).toBe(0);
    expect(jsonDepth(null)).toBe(0);
  });
  it('空の配列/オブジェクトは 1', () => {
    expect(jsonDepth([])).toBe(1);
    expect(jsonDepth({})).toBe(1);
  });
  it('ネストを数える', () => {
    expect(jsonDepth([1, 2])).toBe(1);
    expect(jsonDepth({ a: { b: 1 } })).toBe(2);
    expect(jsonDepth({ a: [1, { b: [2] }] })).toBe(4);
  });
});
