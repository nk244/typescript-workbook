import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 7-1: クラスを実装する
 * 残高を管理する BankAccount を実装してください。
 *   - コンストラクタで初期残高（省略時 0）を受け取る
 *   - 残高は外から書き換えられないこと（getter で読むだけ）
 *   - deposit(amount): 加算する。0 以下なら Error を投げる
 *   - withdraw(amount): 減算する。残高不足なら Error を投げる
 * ============================================================ */
export class BankAccount {
  private _balance: number;

  constructor(balance: number = 0) {
    this._balance = balance;
  }

  get balance(): number {
    return this._balance;
  }

  deposit(amount: number): number {
    const ret: number = this.balance + amount;
    if (amount <= 0) throw new Error('0以下');
    this._balance = ret;
    return ret;
  }

  withdraw(amount: number): number {
    const ret: number = this.balance - amount;
    if (this.balance < amount) throw new Error('残高不足');
    this._balance = ret;
    return ret;
  }
}

/* ============================================================
 * 演習 7-2: interface を implements する
 * Serializable を満たす UserProfile を実装してください。
 *   - serialize() は JSON 文字列を返す
 *   - static fromJSON(json) で復元できる
 * ============================================================ */
export interface Serializable {
  serialize(): string;
}

export class UserProfile implements Serializable {
  constructor(
    public readonly name: string,
    public readonly age: number,
  ) { }

  serialize(): string {
    return JSON.stringify({ name: this.name, age: this.age });
    // throw new Error('not implemented');
  }

  static fromJSON(json: string): UserProfile {
    const data = JSON.parse(json) as { name: string; age: number };
    return new UserProfile(data.name, data.age);
    // throw new Error('not implemented');
  }
}

/* ============================================================
 * 演習 7-3: abstract クラス
 * Shape を継承した Rectangle と Circle を実装してください。
 * area() を override すること（override キーワードが必須です）。
 * ============================================================ */
export abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `${this.constructor.name}: ${this.area().toFixed(2)}`;
  }
}

export class Rectangle extends Shape {
  // TODO: constructor(width, height) と area()
  constructor(
    private width: number,
    private height: number,
  ) {
    super();
  }

  area(): number {
    return this.width * this.height;
    // throw new Error('not implemented');
  }
}

export class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  override area(): number {
    return Math.PI * this.radius ** 2;
  }
}

/* ============================================================
 * 演習 7-4: 構造的部分型とクラス
 * 下の 2 つの代入のうち、どちらが通るか予想してください。
 *
 *   class P { constructor(public x: number) {} }
 *   class Q { constructor(private y: number) {} }
 *
 *   const p: P = { x: 1 };        // a
 *   const q: Q = { y: 1 };        // b
 * ============================================================ */
export const P_ASSIGNABLE: boolean = true; // TODO: a は通る？
export const Q_ASSIGNABLE: boolean = false; // TODO: b は通る？

/* ============================================================
 * 演習 7-5: クラス名は型でもある
 * 「Shape のインスタンスの配列」を受け取り、
 * 面積の合計を返す totalArea を実装してください。
 * ============================================================ */
export function totalArea(shapes: readonly Shape[]): number {
  let totalArea: number = 0;
  shapes.map((shape => {
    totalArea = totalArea + shape.area();
  }))
  return totalArea;
  // throw new Error('not implemented');
}

export type _t1 = Expect<Equal<Parameters<typeof totalArea>[0], readonly Shape[]>>;
