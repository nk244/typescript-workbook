import { describe, expect, it } from 'vitest';
import {
  ANIMAL_FN_TO_DOG_FN,
  ANIMAL_TO_DOG,
  asEmail,
  asserted,
  asUserId,
  DOG_ARRAY_TO_ANIMAL_ARRAY,
  DOG_FN_TO_ANIMAL_FN,
  DOG_TO_ANIMAL,
  names,
  ROUTES,
  satisfied,
  sendMail,
} from './exercise';

describe('14-1 変性クイズ', () => {
  it('部分型は代入できる', () => expect(DOG_TO_ANIMAL).toBe(true));
  it('逆はできない', () => expect(ANIMAL_TO_DOG).toBe(false));
  it('配列は共変', () => expect(DOG_ARRAY_TO_ANIMAL_ARRAY).toBe(true));
  it('引数は反変', () => expect(ANIMAL_FN_TO_DOG_FN).toBe(true));
  it('その逆はできない', () => expect(DOG_FN_TO_ANIMAL_FN).toBe(false));
});

describe('14-2 ブランド型', () => {
  it('UserId を作れる', () => expect(asUserId('u1')).toBe('u1'));
  it('Email を作れる', () => expect(asEmail('a@example.com')).toBe('a@example.com'));
  it('不正な Email は弾く', () => expect(() => asEmail('not-an-email')).toThrow());
});

describe('14-3 names', () => {
  it('readonly な配列も渡せる', () => {
    const animals = [{ name: 'ポチ' }, { name: 'タマ' }] as const;
    expect(names(animals)).toEqual(['ポチ', 'タマ']);
  });
});

describe('14-4 ROUTES', () => {
  it('値が取れる', () => expect(ROUTES.user).toBe('/users/:id'));
});

describe('14-5 書き分け', () => {
  it('中身は同じ', () => {
    expect(satisfied).toEqual({ a: 'x' });
    expect(asserted).toEqual({ a: 'x' });
  });
});

describe('14-6 sendMail', () => {
  it('送信できる', () => {
    const address = asEmail('a@example.com');
    expect(sendMail(address as never, 'やあ')).toContain('a@example.com');
  });
});
