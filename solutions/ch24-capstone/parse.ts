// 総合演習 解答例 (2/3): 外部データの取り込み
import { asTaskId, type Priority, type Task } from './domain';

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

const PRIORITIES: readonly string[] = ['low', 'normal', 'high'];

function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && PRIORITIES.includes(value);
}

/** unknown のまま形を確かめる。ここを通ったものだけがドメインに入れる */
function toTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  if (!('id' in value) || typeof value.id !== 'string') return null;
  if (!('title' in value) || typeof value.title !== 'string') return null;
  if (!('priority' in value) || !isPriority(value.priority)) return null;
  if (!('done' in value) || typeof value.done !== 'boolean') return null;
  if (!('createdAt' in value) || typeof value.createdAt !== 'string') return null;

  const createdAt = new Date(value.createdAt);
  // new Date('not-a-date') は Invalid Date になる（例外は投げない）ので自分で確かめる
  if (Number.isNaN(createdAt.getTime())) return null;

  return {
    id: asTaskId(value.id),
    title: value.title,
    priority: value.priority,
    done: value.done,
    createdAt,
  };
}

export function parseTasks(input: unknown): Result<Task[], string> {
  if (!Array.isArray(input)) return { ok: false, error: 'expected array' };

  const tasks: Task[] = [];
  for (const [index, element] of input.entries()) {
    const task = toTask(element);
    if (task === null) return { ok: false, error: `invalid task at ${index}` };
    tasks.push(task);
  }
  return { ok: true, value: tasks };
}
