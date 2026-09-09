// 型定義のない、昔ながらの JavaScript ライブラリという設定のファイル。
// このファイルは編集しないこと。型は legacy-lib.d.ts 側に書く。

export function formatCurrency(amount, currency) {
  const symbols = { JPY: '¥', USD: '$', EUR: '€' };
  const symbol = symbols[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function parseQuery(queryString) {
  const result = {};
  for (const part of queryString.replace(/^\?/, '').split('&')) {
    if (part === '') continue;
    const [key, value = ''] = part.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return result;
}

export class EventBus {
  #handlers = new Map();

  on(event, handler) {
    const list = this.#handlers.get(event) ?? [];
    list.push(handler);
    this.#handlers.set(event, list);
    return () => {
      this.#handlers.set(
        event,
        (this.#handlers.get(event) ?? []).filter((h) => h !== handler),
      );
    };
  }

  emit(event, payload) {
    for (const handler of this.#handlers.get(event) ?? []) handler(payload);
  }
}

export const VERSION = '2.1.0';
