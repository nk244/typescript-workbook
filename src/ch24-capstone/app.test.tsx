// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaskBoard } from './app';

function addTask(title: string, priority?: string) {
  fireEvent.change(screen.getByLabelText('new-task'), { target: { value: title } });
  if (priority !== undefined) {
    fireEvent.change(screen.getByLabelText('priority'), { target: { value: priority } });
  }
  fireEvent.click(screen.getByRole('button', { name: '追加' }));
}

describe('TaskBoard', () => {
  it('タスクを追加できる', () => {
    render(<TaskBoard />);
    addTask('買い物');
    expect(screen.getByText('買い物')).toBeTruthy();
    expect(screen.getByTestId('summary').textContent).toBe('残り 1 件');
  });

  it('クリックで完了にできる', () => {
    render(<TaskBoard />);
    addTask('掃除');
    fireEvent.click(screen.getByText('掃除'));
    expect(screen.getByText('掃除').closest('li')?.dataset.done).toBe('true');
    expect(screen.getByTestId('summary').textContent).toBe('残り 0 件');
  });

  it('フィルタで絞り込める', () => {
    render(<TaskBoard />);
    addTask('a');
    addTask('b');
    fireEvent.click(screen.getByText('a'));

    fireEvent.click(screen.getByRole('button', { name: '未完了' }));
    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getByText('b')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '完了' }));
    expect(screen.getByText('a')).toBeTruthy();
    expect(screen.queryByText('b')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'すべて' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('優先度を選んで追加できる', () => {
    render(<TaskBoard />);
    addTask('重要', 'high');
    expect(screen.getByText('重要').closest('li')?.dataset.priority).toBe('high');
  });

  it('空文字は追加されない', () => {
    render(<TaskBoard />);
    addTask('');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
