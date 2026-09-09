import { describe, expect, it } from 'vitest';
import {
  BankAccount,
  Circle,
  P_ASSIGNABLE,
  Q_ASSIGNABLE,
  Rectangle,
  totalArea,
  UserProfile,
} from './exercise';

describe('7-1 BankAccount', () => {
  it('初期残高', () => {
    expect(new BankAccount().balance).toBe(0);
    expect(new BankAccount(100).balance).toBe(100);
  });
  it('入金', () => {
    const a = new BankAccount(100);
    a.deposit(50);
    expect(a.balance).toBe(150);
  });
  it('0 以下の入金は拒否', () => {
    expect(() => new BankAccount().deposit(0)).toThrow();
    expect(() => new BankAccount().deposit(-1)).toThrow();
  });
  it('出金', () => {
    const a = new BankAccount(100);
    a.withdraw(30);
    expect(a.balance).toBe(70);
  });
  it('残高不足は拒否', () => {
    expect(() => new BankAccount(10).withdraw(11)).toThrow();
  });
});

describe('7-2 UserProfile', () => {
  it('往復できる', () => {
    const u = new UserProfile('ken', 30);
    const restored = UserProfile.fromJSON(u.serialize());
    expect(restored).toBeInstanceOf(UserProfile);
    expect(restored.name).toBe('ken');
    expect(restored.age).toBe(30);
  });
});

describe('7-3 Shape', () => {
  it('長方形', () => expect(new Rectangle(3, 4).area()).toBe(12));
  it('円', () => expect(new Circle(1).area()).toBeCloseTo(Math.PI));
  it('describe が使える', () => expect(new Rectangle(3, 4).describe()).toBe('Rectangle: 12.00'));
});

describe('7-4 構造的部分型', () => {
  it('public だけなら代入できる', () => expect(P_ASSIGNABLE).toBe(true));
  it('private があると代入できない', () => expect(Q_ASSIGNABLE).toBe(false));
});

describe('7-5 totalArea', () => {
  it('合計', () => expect(totalArea([new Rectangle(2, 3), new Rectangle(1, 4)])).toBe(10));
  it('空なら 0', () => expect(totalArea([])).toBe(0));
});
