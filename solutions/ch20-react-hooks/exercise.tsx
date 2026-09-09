import { createContext, useContext, useReducer, useState } from 'react';
import type { Equal, Expect } from '../lib/type-test';

// 20-1
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  // as const がないと (boolean | (() => void))[] に潰れる
  return [on, () => setOn((v) => !v)] as const;
}

export type _t1 = Expect<Equal<ReturnType<typeof useToggle>, readonly [boolean, () => void]>>;

// 20-2
export type Todo = { id: number; text: string; done: boolean };

export type TodoState = {
  todos: Todo[];
  nextId: number;
};

export type TodoAction =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' };

export function assertNever(value: never): never {
  throw new Error(`未対応のアクション: ${JSON.stringify(value)}`);
}

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'add':
      return {
        todos: [...state.todos, { id: state.nextId, text: action.text, done: false }],
        nextId: state.nextId + 1,
      };
    case 'toggle':
      return {
        ...state,
        // 元の配列やオブジェクトを書き換えず、新しいものを作る
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      };
    case 'remove':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case 'clear':
      return { ...state, todos: state.todos.filter((t) => !t.done) };
    default:
      return assertNever(action);
  }
}

// 20-3
export function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, { todos: [], nextId: 1 });
  const [text, setText] = useState('');

  return (
    <div>
      <input aria-label="new-todo" value={text} onChange={(e) => setText(e.target.value)} />
      <button
        onClick={() => {
          if (text === '') return;
          dispatch({ type: 'add', text });
          setText('');
        }}
      >
        追加
      </button>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id} data-done={todo.done}>
            <span onClick={() => dispatch({ type: 'toggle', id: todo.id })}>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 20-4
export type Theme = { color: string; mode: 'light' | 'dark' };

export const ThemeContext = createContext<Theme | undefined>(undefined);

export function useTheme(): Theme {
  const value = useContext(ThemeContext);
  // ここで undefined を潰すので、使う側は毎回チェックしなくてよい
  if (value === undefined) {
    throw new Error('useTheme は ThemeContext.Provider の中で使ってください');
  }
  return value;
}

export function ThemeLabel() {
  const theme = useTheme();
  return (
    <span data-testid="theme">
      {theme.mode}:{theme.color}
    </span>
  );
}
