import type { Equal, Expect } from '../lib/type-test';

// 4-1
export type Book = {
  readonly id: number;
  title: string;
  author: string;
  publishedAt?: Date;
  tags: string[];
};

export type _t1 = Expect<
  Equal<
    Book,
    {
      readonly id: number;
      title: string;
      author: string;
      publishedAt?: Date;
      tags: string[];
    }
  >
>;

// 4-2
export function publishedYear(book: Book): string {
  // book.publishedAt は Date | undefined。undefined を先に弾く
  if (book.publishedAt === undefined) return '未刊';
  return `${book.publishedAt.getFullYear()}年`;
}

// 4-3
export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type StoredBook = Book & Timestamps;

export type _t2 = Expect<Equal<StoredBook, Book & Timestamps>>;

// 4-4
// オブジェクトリテラルを直接代入する a だけが過剰プロパティチェックに引っかかる。
// b は一度変数に入れているので、構造的部分型の原則どおり代入できてしまう。
export const EXCESS_LINE: 'a' | 'b' = 'a';

// 4-5
export type Scores = { [subject: string]: number };

export function getScore(scores: Scores, subject: string): number {
  // noUncheckedIndexedAccess により number | undefined なので ?? で既定値を与える
  return scores[subject] ?? 0;
}

// 4-6
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export function jsonDepth(value: Json): number {
  if (Array.isArray(value)) {
    return 1 + Math.max(0, ...value.map(jsonDepth));
  }
  if (typeof value === 'object' && value !== null) {
    return 1 + Math.max(0, ...Object.values(value).map(jsonDepth));
  }
  return 0;
}
