import { useEffect, useState } from 'react';
import type { Equal, Expect } from '../lib/type-test';

// 22-1
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

export type _t1 = Expect<
  Equal<
    AsyncState<number>,
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: number }
    | { status: 'error'; error: Error }
  >
>;

// 22-2
export function assertNever(value: never): never {
  throw new Error(`未対応: ${JSON.stringify(value)}`);
}

export function describeAsync(state: AsyncState<string>): string {
  switch (state.status) {
    case 'idle':
      return '未実行';
    case 'loading':
      return '読み込み中';
    case 'success':
      return `完了: ${state.data}`;
    case 'error':
      return `失敗: ${state.error.message}`;
    default:
      return assertNever(state);
  }
}

// 22-3
export function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

// 22-4
export function useAsync<T>(fetcher: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  useEffect(() => {
    // アンマウント後や依存変更後に古い結果で setState しないための番人。
    // 型では守れない種類の正しさなので、必ず自分で書く
    let cancelled = false;
    setState({ status: 'loading' });
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: 'error', error: toError(e) });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

// 22-5
export function UserName({ fetchName }: { fetchName: () => Promise<string> }) {
  const state = useAsync(fetchName, []);

  switch (state.status) {
    case 'loading':
      return <p>loading</p>;
    case 'success':
      // success のときだけ data が存在するので ! も ?. も要らない
      return <p>{state.data}</p>;
    case 'error':
      return <p role="alert">{state.error.message}</p>;
    case 'idle':
      return null;
    default:
      return assertNever(state);
  }
}

// 22-6
export type User = { id: number; name: string };
export type Settings = { theme: 'light' | 'dark' };

export type Endpoints = {
  '/users': User[];
  '/settings': Settings;
};

export async function api<P extends keyof Endpoints>(
  fetcher: (path: string) => Promise<unknown>,
  path: P,
): Promise<Endpoints[P]> {
  // 実行時は素通し。型だけがパスとレスポンスの対応を知っている。
  // 実際には第17章のバリデータでここを検証するのが理想
  return (await fetcher(path)) as Endpoints[P];
}
