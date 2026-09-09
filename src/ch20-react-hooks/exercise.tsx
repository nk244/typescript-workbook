import { createContext, useReducer, useState } from 'react';
import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 20-1: useState の型引数
 * useToggle は真偽値と、それを反転する関数をタプルで返します。
 * as const を忘れないこと。
 * ============================================================ */
export function useToggle(initial = false) {
  // TODO
  throw new Error('not implemented');
}

export type _t1 = Expect<Equal<ReturnType<typeof useToggle>, readonly [boolean, () => void]>>;

/* ============================================================
 * 演習 20-2: reducer を書く（React なしでテストできる純粋関数）
 * Todo アプリの状態遷移を実装してください。
 *   add    : text から新しい Todo を作って末尾に追加（id は nextId を使う）
 *   toggle : id の done を反転
 *   remove : id の Todo を削除
 *   clear  : done が true のものをすべて削除
 * 網羅性チェック（assertNever）を必ず入れること。
 * ============================================================ */
export type Todo = { id: number; text: string; done: boolean };

export type TodoState = {
  todos: Todo[];
  nextId: number;
};

export type TodoAction = unknown; // TODO: 判別可能なユニオンで定義する

export function assertNever(value: never): never {
  throw new Error(`未対応のアクション: ${JSON.stringify(value)}`);
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  throw new Error('not implemented');
}

/* ============================================================
 * 演習 20-3: useReducer をコンポーネントで使う
 * TodoApp は
 *   - aria-label="new-todo" の input
 *   - 「追加」ボタン（押すと input の内容を add）
 *   - 各 Todo を <li> で表示（テキストをクリックすると toggle）
 *   - done の Todo には data-done="true" を付ける
 * を表示します。
 * ============================================================ */
export function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, { todos: [], nextId: 1 });
  const [text, setText] = useState('');
  void state;
  void dispatch;
  void text;
  void setText;
  // TODO
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 20-4: Context を型安全に使う
 * ThemeContext と useTheme を実装してください。
 *   - Provider の外で useTheme を呼んだら Error を投げる
 *   - useTheme の戻り値は Theme（undefined を含まない）
 * ============================================================ */
export type Theme = { color: string; mode: 'light' | 'dark' };

export const ThemeContext = createContext<Theme | undefined>(undefined);

export function useTheme(): Theme {
  throw new Error('not implemented');
}

export function ThemeLabel() {
  const theme = useTheme();
  return (
    <span data-testid="theme">
      {theme.mode}:{theme.color}
    </span>
  );
}
