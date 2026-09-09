import { describe, expect, it } from 'vitest';
import { createUser, STATUS_LABELS } from './exercise';

describe('10-3 STATUS_LABELS', () => {
  it('4 つのラベルが揃っている', () => {
    expect(STATUS_LABELS).toEqual({
      idle: '待機中',
      loading: '読み込み中',
      success: '完了',
      error: '失敗',
    });
  });
});

describe('10-7 createUser', () => {
  it('User を組み立てる', () => {
    const now = new Date('2024-01-01');
    const user = createUser({ name: 'ken', email: 'k@example.com' } as never, 7, now);
    expect(user).toEqual({ id: 7, name: 'ken', email: 'k@example.com', createdAt: now });
  });
});
