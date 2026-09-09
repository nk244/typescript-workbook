import { describe, expect, it } from 'vitest';
import { createAction, LABELS, okA, okB } from './exercise';

describe('ex02-5 XOR', () => {
  it('どちらか一方だけを持てる', () => {
    expect(okA).toEqual({ href: '/' });
    expect(Object.keys(okB)).toEqual(['onClick']);
  });
});

describe('ex02-6 createAction', () => {
  it('payload を展開したアクションを作る', () => {
    expect(createAction('add', { text: 'a' } as never)).toEqual({ type: 'add', text: 'a' });
    expect(createAction('remove', { id: 1 } as never)).toEqual({ type: 'remove', id: 1 });
  });
});

describe('ex02-7 LABELS', () => {
  it('3 つ揃っている', () => {
    expect(LABELS).toEqual({ idle: '待機', loading: '読込', done: '完了' });
  });
});
