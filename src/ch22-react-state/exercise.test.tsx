// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { api, describeAsync, toError, UserName, type User } from './exercise';
import type { Equal, Expect } from '../lib/type-test';

describe('22-2 describeAsync', () => {
  it('4 つの状態', () => {
    expect(describeAsync({ status: 'idle' } as never)).toBe('未実行');
    expect(describeAsync({ status: 'loading' } as never)).toBe('読み込み中');
    expect(describeAsync({ status: 'success', data: 'ken' } as never)).toBe('完了: ken');
    expect(describeAsync({ status: 'error', error: new Error('だめ') } as never)).toBe('失敗: だめ');
  });
});

describe('22-3 toError', () => {
  it('Error はそのまま', () => {
    const e = new Error('x');
    expect(toError(e)).toBe(e);
  });
  it('それ以外は包む', () => {
    expect(toError('文字列').message).toBe('文字列');
    expect(toError(404).message).toBe('404');
  });
});

describe('22-4/22-5 useAsync と UserName', () => {
  it('成功したら名前を出す', async () => {
    render(<UserName fetchName={async () => 'ken'} />);
    expect(screen.getByText('loading')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('ken')).toBeTruthy());
  });

  it('失敗したらエラーを出す', async () => {
    render(
      <UserName
        fetchName={async () => {
          throw new Error('取得失敗');
        }}
      />,
    );
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('取得失敗'));
  });
});

describe('22-6 api', () => {
  it('パスに応じた型と値が返る', async () => {
    const fetcher = async (path: string): Promise<unknown> =>
      path === '/users' ? [{ id: 1, name: 'ken' }] : { theme: 'dark' };

    const users = await api(fetcher, '/users');
    // 型も導けていること（未実装のうちはここもエラーになる）
    type _check = Expect<Equal<typeof users, User[]>>;
    expect(users).toEqual([{ id: 1, name: 'ken' }]);

    const settings = await api(fetcher, '/settings');
    expect(settings).toEqual({ theme: 'dark' });
  });
});
