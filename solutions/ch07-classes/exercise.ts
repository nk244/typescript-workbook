import type { Equal, Expect } from '../lib/type-test';

// 7-1
export class BankAccount {
  // # を使うと実行時にも本当に隠れる。private でも可
  #balance: number;

  constructor(initial: number = 0) {
    this.#balance = initial;
  }

  get balance(): number {
    return this.#balance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('入金額は正の数である必要があります');
    this.#balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error('出金額は正の数である必要があります');
    if (amount > this.#balance) throw new Error('残高が不足しています');
    this.#balance -= amount;
  }
}

// 7-2
export interface Serializable {
  serialize(): string;
}

export class UserProfile implements Serializable {
  constructor(
    public readonly name: string,
    public readonly age: number,
  ) {}

  serialize(): string {
    return JSON.stringify({ name: this.name, age: this.age });
  }

  static fromJSON(json: string): UserProfile {
    // 本来ここは unknown で受けて検証すべき（第17章）。今は素直に読む
    const data = JSON.parse(json) as { name: string; age: number };
    return new UserProfile(data.name, data.age);
  }
}

// 7-3
export abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `${this.constructor.name}: ${this.area().toFixed(2)}`;
  }
}

export class Rectangle extends Shape {
  constructor(
    private readonly width: number,
    private readonly height: number,
  ) {
    super();
  }

  override area(): number {
    return this.width * this.height;
  }
}

export class Circle extends Shape {
  constructor(private readonly radius: number) {
    super();
  }

  override area(): number {
    return Math.PI * this.radius ** 2;
  }
}

// 7-4
// public なプロパティだけのクラスは、形さえ合えば代入できる（構造的部分型）
export const P_ASSIGNABLE: boolean = true;
// private / protected を持つクラスは「そのクラス由来であること」まで要求されるので不可
export const Q_ASSIGNABLE: boolean = false;

// 7-5
export function totalArea(shapes: readonly Shape[]): number {
  return shapes.reduce((acc, s) => acc + s.area(), 0);
}

export type _t1 = Expect<Equal<Parameters<typeof totalArea>[0], readonly Shape[]>>;
