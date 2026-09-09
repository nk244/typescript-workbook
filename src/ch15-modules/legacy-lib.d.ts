/**
 * 演習 15-1: legacy-lib.js に型を付ける
 *
 * legacy-lib.js を読んで、次の 4 つに型を付けてください。
 *   - formatCurrency(amount, currency): 金額と通貨コードを受け取って文字列を返す
 *       currency は 'JPY' | 'USD' | 'EUR' のいずれか
 *   - parseQuery(queryString): クエリ文字列を { [key: string]: string } にする
 *   - EventBus クラス
 *       on(event, handler): 購読を解除する関数を返す
 *       emit(event, payload): 通知する
 *       ※ イベント名と payload の型の対応を、ジェネリクスで表現すること
 *   - VERSION: バージョン文字列（リテラル型でなく string でよい）
 *
 * .d.ts の中では実装を書けません。declare で「型だけ」を宣言します。
 */

// TODO: ここに型宣言を書く
export declare const VERSION: string;
