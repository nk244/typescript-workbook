import { EventBus, formatCurrency, parseQuery, VERSION } from './legacy-lib';
import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 15-2: 型を付けた legacy-lib を使う
 * 下の関数を実装してください。型が正しく付いていれば通ります。
 * ============================================================ */
export function priceLabel(amount: number): string {
  // TODO: formatCurrency を使って '¥1,200' のような文字列を返す（通貨は JPY）
  throw new Error('not implemented');
}

export function queryValue(queryString: string, key: string): string | undefined {
  // TODO: parseQuery を使って値を取り出す（なければ undefined）
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 15-3: 型付きイベントバスを使う
 * AppEvents に沿ってイベントを購読・発火する関数を実装してください。
 * ============================================================ */
export type AppEvents = {
  login: { userId: string };
  logout: undefined;
};

export function setupBus(): {
  bus: EventBus<AppEvents>;
  loginNames: string[];
} {
  // TODO: EventBus を作り、login を購読して userId を loginNames に push する
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 15-4: 型が正しく付いているかの確認
 * ============================================================ */
export type _t1 = Expect<Equal<ReturnType<typeof formatCurrency>, string>>;
export type _t2 = Expect<Equal<Parameters<typeof formatCurrency>[1], 'JPY' | 'USD' | 'EUR'>>;
export type _t3 = Expect<Equal<ReturnType<typeof parseQuery>, Record<string, string>>>;
export type _t4 = Expect<Equal<typeof VERSION, string>>;

/* ============================================================
 * 演習 15-5: グローバルに型を足す
 * globals.d.ts を作って、window.__appVersion: string を宣言してください。
 * （このファイルには何も書かなくて構いません。globals.d.ts を新規作成する）
 * 宣言できたら true にしてください。
 * ============================================================ */
export const GLOBAL_DECLARED = false; // TODO
