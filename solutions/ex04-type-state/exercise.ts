import type { Equal, Expect } from '../lib/type-test';

// ex04-1
export type ConnState = 'open' | 'closed';

export type Connection<S extends ConnState> = {
  readonly state: S;
  readonly sent: string[];
};

export function connect(): Connection<'open'> {
  return { state: 'open', sent: [] };
}

// 引数の型引数を 'open' に固定するだけで、状態遷移が型で守られる
export function send(conn: Connection<'open'>, message: string): string[] {
  conn.sent.push(message);
  return conn.sent;
}

export function close(conn: Connection<'open'>): Connection<'closed'> {
  return { state: 'closed', sent: conn.sent };
}

export type _t1 = Expect<Equal<Parameters<typeof send>[0], Connection<'open'>>>;
export type _t2 = Expect<Equal<ReturnType<typeof close>, Connection<'closed'>>>;

// @ts-expect-error 閉じた接続には送れない
send(close(connect()), 'hi');

// ex04-2
export type QueryKey = 'table' | 'where' | 'limit';

export class QueryBuilder<Set extends QueryKey = never> {
  #parts = new Map<QueryKey, string>();

  // 設定したキー K を型引数に足して返す
  set<K extends QueryKey>(key: K, value: string): QueryBuilder<Set | K> {
    this.#parts.set(key, value);
    return this as QueryBuilder<Set | K>;
  }

  // 'table' が Set に含まれなければ this が never になり、呼び出せなくなる
  build(this: 'table' extends Set ? QueryBuilder<Set> : never): string {
    const self = this as QueryBuilder<Set>;
    return [...self.entries()].map(([key, value]) => `${key}=${value}`).join(' ');
  }

  entries(): IterableIterator<[QueryKey, string]> {
    return this.#parts.entries();
  }
}

// ex04-3
export class Query {
  readonly conditions: string[] = [];

  // this 型にすると「実際に呼ばれたクラス」が返る
  where(cond: string): this {
    this.conditions.push(cond);
    return this;
  }
}

export class AdminQuery extends Query {
  onlyAdmins(): this {
    this.conditions.push('role=admin');
    return this;
  }
}

// ex04-4
export class Box<T> {
  value: T | undefined;

  assertLoaded(): asserts this is { value: T } {
    if (this.value === undefined) throw new Error('未ロード');
  }
}

export function useBox(): string {
  // アサーションメソッドは「明示的に型注釈された識別子」にしか使えない
  const box: Box<string> = new Box();
  box.value = 'hello';
  box.assertLoaded();
  return box.value.toUpperCase();
}

// ex04-5
declare const metersBrand: unique symbol;

// symbol をキーにすると、他のライブラリのブランドと衝突しない
export type Meters = number & { readonly [metersBrand]: true };

export function meters(value: number): Meters {
  return value as Meters;
}

export function addDistance(a: Meters, b: Meters): Meters {
  return meters(a + b);
}

export type _t3 = Expect<Equal<number extends Meters ? true : false, false>>;

// @ts-expect-error ただの number は Meters として渡せない
addDistance(1, 2);

export type _unused = typeof metersBrand;
