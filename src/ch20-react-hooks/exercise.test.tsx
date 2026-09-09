// @vitest-environment jsdom
import { fireEvent, render, renderHook, screen, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ThemeContext,
  ThemeLabel,
  TodoApp,
  todoReducer,
  useToggle,
  type TodoState,
} from './exercise';

describe('20-1 useToggle', () => {
  it('反転できる', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});

describe('20-2 todoReducer', () => {
  const initial: TodoState = { todos: [], nextId: 1 };

  it('add', () => {
    const next = todoReducer(initial, { type: 'add', text: '買い物' } as never);
    expect(next.todos).toEqual([{ id: 1, text: '買い物', done: false }]);
    expect(next.nextId).toBe(2);
  });

  it('toggle', () => {
    const added = todoReducer(initial, { type: 'add', text: 'a' } as never);
    const toggled = todoReducer(added, { type: 'toggle', id: 1 } as never);
    expect(toggled.todos[0]?.done).toBe(true);
  });

  it('remove', () => {
    const added = todoReducer(initial, { type: 'add', text: 'a' } as never);
    const removed = todoReducer(added, { type: 'remove', id: 1 } as never);
    expect(removed.todos).toEqual([]);
  });

  it('clear', () => {
    let state = todoReducer(initial, { type: 'add', text: 'a' } as never);
    state = todoReducer(state, { type: 'add', text: 'b' } as never);
    state = todoReducer(state, { type: 'toggle', id: 1 } as never);
    const cleared = todoReducer(state, { type: 'clear' } as never);
    expect(cleared.todos.map((t) => t.text)).toEqual(['b']);
  });

  it('元の state を破壊しない', () => {
    const added = todoReducer(initial, { type: 'add', text: 'a' } as never);
    todoReducer(added, { type: 'toggle', id: 1 } as never);
    expect(added.todos[0]?.done).toBe(false);
  });
});

describe('20-3 TodoApp', () => {
  it('追加して切り替えられる', () => {
    render(<TodoApp />);
    fireEvent.change(screen.getByLabelText('new-todo'), { target: { value: '掃除' } });
    fireEvent.click(screen.getByRole('button', { name: '追加' }));
    const item = screen.getByText('掃除');
    expect(item).toBeTruthy();
    fireEvent.click(item);
    expect(screen.getByText('掃除').closest('li')?.dataset.done).toBe('true');
  });
});

describe('20-4 useTheme', () => {
  it('Provider の中では値が取れる', () => {
    render(
      <ThemeContext.Provider value={{ color: 'red', mode: 'dark' }}>
        <ThemeLabel />
      </ThemeContext.Provider>,
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark:red');
  });

  it('Provider の外では投げる', () => {
    expect(() => render(<ThemeLabel />)).toThrow();
  });
});
