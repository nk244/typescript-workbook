// 総合演習 解答例 (3/3): UI
import { useReducer, useState } from 'react';
import {
  initialState,
  taskReducer,
  visibleTasks,
  type Filter,
  type Priority,
} from './domain';

const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'done', label: '完了' },
];

export function TaskBoard() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');

  // 状態として持たず、そのつど導出する。持つ状態が少ないほど不整合が起きない
  const remaining = state.tasks.filter((t) => !t.done).length;

  return (
    <div>
      <input aria-label="new-task" value={title} onChange={(e) => setTitle(e.target.value)} />
      <select
        aria-label="priority"
        value={priority}
        // select の value は string なので、ここで Priority に絞り込む
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">低</option>
        <option value="normal">中</option>
        <option value="high">高</option>
      </select>
      <button
        onClick={() => {
          if (title === '') return;
          dispatch({ type: 'add', title, priority });
          setTitle('');
        }}
      >
        追加
      </button>

      <div>
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => dispatch({ type: 'setFilter', filter: f.value })}>
            {f.label}
          </button>
        ))}
      </div>

      <ul>
        {visibleTasks(state).map((task) => (
          <li key={task.id} data-done={task.done} data-priority={task.priority}>
            <span onClick={() => dispatch({ type: 'toggle', id: task.id })}>{task.title}</span>
          </li>
        ))}
      </ul>

      <p data-testid="summary">残り {remaining} 件</p>
    </div>
  );
}
