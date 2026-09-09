/* ============================================================
 * 総合演習 (1/3): ドメイン
 * README.md の仕様を読んでから埋めてください。
 * ============================================================ */

/** TODO: ただの string と取り違えられないブランド型にする */
export type TaskId = string;

/** TODO: 文字列から TaskId を作る（ここだけ as を使ってよい） */
export function asTaskId(raw: string): TaskId {
  throw new Error('not implemented');
}

export type Priority = 'low' | 'normal' | 'high';

export type Task = {
  id: TaskId;
  title: string;
  priority: Priority;
  done: boolean;
  createdAt: Date;
};

export type Filter = 'all' | 'active' | 'done';

/** TODO: 判別可能なユニオンで定義する（判別子は type） */
export type TaskAction = unknown;

export type TaskState = {
  tasks: Task[];
  filter: Filter;
  nextId: number;
};

export const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  nextId: 1,
};

export function assertNever(value: never): never {
  throw new Error(`未対応のアクション: ${JSON.stringify(value)}`);
}

/** TODO: 純粋関数として実装する。網羅性チェックを入れること */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  throw new Error('not implemented');
}

/** TODO: filter を適用した配列を返す */
export function visibleTasks(state: TaskState): Task[] {
  throw new Error('not implemented');
}

/** TODO: high -> normal -> low の安定ソートで、新しい配列を返す */
export function sortByPriority(tasks: readonly Task[]): Task[] {
  throw new Error('not implemented');
}
