import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 4-1: オブジェクト型を定義する
 * 次の条件を満たす Book 型を定義してください。
 *   - id: number（変更不可）
 *   - title: string
 *   - author: string
 *   - publishedAt: Date（省略可能）
 *   - tags: string の配列
 * ============================================================ */
export type Book = {
  readonly id: number;
  title: string;
  author: string;
  publishedAt?: Date;
  tags: string[];
};

// 型が正しければエラーが消える
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

/* ============================================================
 * 演習 4-2: オプショナルなプロパティを安全に読む
 * publishedAt があれば 'YYYY年' 形式（例: '2024年'）を、
 * なければ '未刊' を返してください。
 * ============================================================ */
export function publishedYear(book: Book): string {
  return book.publishedAt ? `${book.publishedAt.getFullYear()}年` : '未刊';
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 4-3: 交差型を作る
 * Timestamps（createdAt / updatedAt はどちらも Date）を定義し、
 * Book と組み合わせた StoredBook を交差型で定義してください。
 * ============================================================ */
export type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type StoredBook = Book & Timestamps; // TODO: Book と Timestamps の交差型に

export type _t2 = Expect<Equal<StoredBook, Book & Timestamps>>;

/* ============================================================
 * 演習 4-4: 過剰プロパティチェックを体験する
 * 下の 2 行のうち、片方だけがエラーになります。
 * エラーになるほうを特定し、EXCESS_LINE に 'a' か 'b' を入れてください。
 * （実際にコメントを外して確かめること。確かめたら戻す）
 *
 *   // a:
 *   const p1: { x: number } = { x: 1, y: 2 };
 *   // b:
 *   const tmp = { x: 1, y: 2 };
 *   const p2: { x: number } = tmp;
 * ============================================================ */
export const EXCESS_LINE: 'a' | 'b' = 'a'; // TODO: 正しいほうに直す

/* ============================================================
 * 演習 4-5: インデックスシグネチャと noUncheckedIndexedAccess
 * scores から科目のスコアを取り出し、
 * 存在しなければ 0 を返してください。
 * ※ このリポジトリは noUncheckedIndexedAccess が有効なので、
 *   scores[subject] は number | undefined です。as は使わないこと。
 * ============================================================ */
export type Scores = { [subject: string]: number };

export function getScore(scores: Scores, subject: string): number {
  return scores[subject] ?? 0;
  // throw new Error('not implemented');
}

/* ============================================================
 * 演習 4-6: 再帰的な型で JSON を表す
 * Json 型を定義し、深さを数える関数を実装してください。
 *   - プリミティブ（string/number/boolean/null）の深さは 0
 *   - 配列・オブジェクトは「中身の最大の深さ + 1」
 *   - 空の配列・空のオブジェクトは 1
 * ============================================================ */
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export function jsonDepth(value: Json): number {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) {
    return 0;
  } else if (Array.isArray(value)) {
    return Math.max(0, ...value.map(jsonDepth)) + 1;
  } else {
    return Math.max(0, ...Object.values(value).map(jsonDepth)) + 1;
  }
  // throw new Error('not implemented');
}
