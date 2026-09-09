// 15-1 解答例

export declare function formatCurrency(amount: number, currency: 'JPY' | 'USD' | 'EUR'): string;

export declare function parseQuery(queryString: string): Record<string, string>;

/**
 * イベント名と payload の対応表を型引数で受け取る。
 * これで emit('login', ...) の payload が型チェックされる。
 */
export declare class EventBus<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
}

export declare const VERSION: string;
