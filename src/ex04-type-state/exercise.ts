import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 ex04-1: ファントム型で状態遷移を表す
 * 「閉じた接続には送れない」を型で表現してください。
 *   connect() -> Connection<'open'>
 *   send(open な接続, message) -> 送ったメッセージの配列
 *   close(open な接続) -> Connection<'closed'>
 * ============================================================ */
export type ConnState = 'open' | 'closed';

export type Connection<S extends ConnState> = {
  readonly state: S;
  readonly sent: string[];
};

export function connect(): Connection<'open'> {
  throw new Error('not implemented');
}

// TODO: 引数を「open な接続だけ」に絞る
export function send(conn: Connection<ConnState>, message: string): string[] {
  throw new Error('not implemented');
}

// TODO: 引数を「open な接続だけ」に絞り、closed な接続を返す
export function close(conn: Connection<ConnState>): Connection<ConnState> {
  throw new Error('not implemented');
}

export type _t1 = Expect<Equal<Parameters<typeof send>[0], Connection<'open'>>>;
export type _t2 = Expect<Equal<ReturnType<typeof close>, Connection<'closed'>>>;

// 型が正しければ、次の行は「エラーになるはず」の宣言が有効になる
// （型がゆるいままだと @ts-expect-error 自体がエラーになります）
// @ts-expect-error 閉じた接続には送れない
send(close(connect()), 'hi');

/* ============================================================
 * 演習 ex04-2: ビルダーに「必須項目」を型で強制する
 * table を set していなければ build() を呼べないようにしてください。
 * ============================================================ */
export type QueryKey = 'table' | 'where' | 'limit';

export class QueryBuilder<Set extends QueryKey = never> {
  #parts = new Map<QueryKey, string>();

  // TODO: 設定したキーを型に溜める
  set(key: QueryKey, value: string): QueryBuilder<Set> {
    this.#parts.set(key, value);
    return this;
  }

  // TODO: this の型を条件型にして、table 必須にする
  // 出力は `table=users where=x` のように 'キー=値' を半角スペースで連結したもの
  build(): string {
    throw new Error('not implemented');
  }
}

/* ============================================================
 * 演習 ex04-3: polymorphic this
 * 継承してもチェーンが切れないようにしてください。
 * ============================================================ */
export class Query {
  readonly conditions: string[] = [];

  // TODO: 戻り値の型を直す
  where(cond: string): Query {
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

/* ============================================================
 * 演習 ex04-4: アサーションメソッド
 * assertLoaded を呼んだ後は value が T に確定するようにしてください。
 * ============================================================ */
export class Box<T> {
  value: T | undefined;

  // TODO: 戻り値を asserts 述語にする
  assertLoaded(): void {
    if (this.value === undefined) throw new Error('未ロード');
  }
}

export function useBox(): string {
  // 注意: アサーションメソッドを使うには、明示的な型注釈が必要
  const box: Box<string> = new Box();
  box.value = 'hello';
  box.assertLoaded();
  // TODO: ここで box.value を大文字にして返す（! や as を使わずに）
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 ex04-5: unique symbol でブランドを付ける
 * ただの number と混同できない Meters 型を作ってください。
 * ============================================================ */
declare const metersBrand: unique symbol;

export type Meters = number; // TODO

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
