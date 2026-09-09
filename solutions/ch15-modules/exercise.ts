import { EventBus, formatCurrency, parseQuery, VERSION } from './legacy-lib';
import type { Equal, Expect } from '../lib/type-test';

// 15-2
export function priceLabel(amount: number): string {
  return formatCurrency(amount, 'JPY');
}

export function queryValue(queryString: string, key: string): string | undefined {
  return parseQuery(queryString)[key];
}

// 15-3
export type AppEvents = {
  login: { userId: string };
  logout: undefined;
};

export function setupBus(): {
  bus: EventBus<AppEvents>;
  loginNames: string[];
} {
  const bus = new EventBus<AppEvents>();
  const loginNames: string[] = [];
  // payload の型は AppEvents['login'] と分かっているので注釈が要らない
  bus.on('login', (payload) => {
    loginNames.push(payload.userId);
  });
  return { bus, loginNames };
}

// 15-4
export type _t1 = Expect<Equal<ReturnType<typeof formatCurrency>, string>>;
export type _t2 = Expect<Equal<Parameters<typeof formatCurrency>[1], 'JPY' | 'USD' | 'EUR'>>;
export type _t3 = Expect<Equal<ReturnType<typeof parseQuery>, Record<string, string>>>;
export type _t4 = Expect<Equal<typeof VERSION, string>>;

// 15-5
export const GLOBAL_DECLARED = true;
