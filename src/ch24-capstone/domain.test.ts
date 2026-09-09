import { describe, expect, it } from 'vitest';
import {
  asTaskId,
  initialState,
  sortByPriority,
  taskReducer,
  visibleTasks,
  type Task,
  type TaskState,
} from './domain';

const at = (n: number) => new Date(2024, 0, n);

const task = (id: string, priority: Task['priority'], done = false): Task => ({
  id: asTaskId(id),
  title: `task-${id}`,
  priority,
  done,
  createdAt: at(1),
});

describe('taskReducer', () => {
  it('add でタスクが増え、id は連番になる', () => {
    const s1 = taskReducer(initialState, { type: 'add', title: '買い物', priority: 'high' } as never);
    expect(s1.tasks).toHaveLength(1);
    expect(s1.tasks[0]?.title).toBe('買い物');
    expect(s1.tasks[0]?.priority).toBe('high');
    expect(s1.tasks[0]?.done).toBe(false);
    expect(s1.tasks[0]?.id).toBe('1');
    expect(s1.nextId).toBe(2);

    const s2 = taskReducer(s1, { type: 'add', title: '掃除', priority: 'low' } as never);
    expect(s2.tasks[1]?.id).toBe('2');
  });

  it('toggle で done が反転する', () => {
    const s1 = taskReducer(initialState, { type: 'add', title: 'a', priority: 'normal' } as never);
    const s2 = taskReducer(s1, { type: 'toggle', id: asTaskId('1') } as never);
    expect(s2.tasks[0]?.done).toBe(true);
    // 元の state を壊していない
    expect(s1.tasks[0]?.done).toBe(false);
  });

  it('remove で消える', () => {
    const s1 = taskReducer(initialState, { type: 'add', title: 'a', priority: 'normal' } as never);
    const s2 = taskReducer(s1, { type: 'remove', id: asTaskId('1') } as never);
    expect(s2.tasks).toEqual([]);
  });

  it('setFilter で filter が変わる', () => {
    const s = taskReducer(initialState, { type: 'setFilter', filter: 'done' } as never);
    expect(s.filter).toBe('done');
  });

  it('clearDone で完了済みだけ消える', () => {
    let s: TaskState = { ...initialState, tasks: [task('1', 'low', true), task('2', 'low')] };
    s = taskReducer(s, { type: 'clearDone' } as never);
    expect(s.tasks.map((t) => t.id)).toEqual(['2']);
  });
});

describe('visibleTasks', () => {
  const tasks = [task('1', 'low', true), task('2', 'low', false)];

  it('all', () => {
    expect(visibleTasks({ ...initialState, tasks, filter: 'all' })).toHaveLength(2);
  });
  it('active', () => {
    expect(visibleTasks({ ...initialState, tasks, filter: 'active' }).map((t) => t.id)).toEqual(['2']);
  });
  it('done', () => {
    expect(visibleTasks({ ...initialState, tasks, filter: 'done' }).map((t) => t.id)).toEqual(['1']);
  });
});

describe('sortByPriority', () => {
  it('high -> normal -> low の順', () => {
    const tasks = [task('1', 'low'), task('2', 'high'), task('3', 'normal')];
    expect(sortByPriority(tasks).map((t) => t.id)).toEqual(['2', '3', '1']);
  });

  it('同じ優先度なら元の順序を保つ（安定ソート）', () => {
    const tasks = [task('1', 'high'), task('2', 'high'), task('3', 'low')];
    expect(sortByPriority(tasks).map((t) => t.id)).toEqual(['1', '2', '3']);
  });

  it('元の配列を壊さない', () => {
    const tasks = [task('1', 'low'), task('2', 'high')];
    sortByPriority(tasks);
    expect(tasks.map((t) => t.id)).toEqual(['1', '2']);
  });
});
