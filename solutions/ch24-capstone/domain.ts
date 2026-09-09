// 総合演習 解答例 (1/3): ドメイン

// ブランド型。実行時には存在しないタグを混ぜて、ただの string と区別する
export type TaskId = string & { readonly __brand: 'TaskId' };

export function asTaskId(raw: string): TaskId {
  return raw as TaskId;
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

export type TaskAction =
  | { type: 'add'; title: string; priority: Priority }
  | { type: 'toggle'; id: TaskId }
  | { type: 'remove'; id: TaskId }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' };

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

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: asTaskId(String(state.nextId)),
            title: action.title,
            priority: action.priority,
            done: false,
            createdAt: new Date(),
          },
        ],
        nextId: state.nextId + 1,
      };
    case 'toggle':
      return {
        ...state,
        // map + スプレッドで新しいオブジェクトを作る。元の state は触らない
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      };
    case 'remove':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'setFilter':
      return { ...state, filter: action.filter };
    case 'clearDone':
      return { ...state, tasks: state.tasks.filter((t) => !t.done) };
    default:
      // アクションを 1 つ足すと、ここがコンパイルエラーになって漏れを教えてくれる
      return assertNever(action);
  }
}

export function visibleTasks(state: TaskState): Task[] {
  switch (state.filter) {
    case 'all':
      return state.tasks;
    case 'active':
      return state.tasks.filter((t) => !t.done);
    case 'done':
      return state.tasks.filter((t) => t.done);
    default:
      return assertNever(state.filter);
  }
}

// Record にしておくと Priority が増えたときにここがコンパイルエラーになる
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

export function sortByPriority(tasks: readonly Task[]): Task[] {
  // sort は破壊的なので必ずコピーしてから。
  // ES2019 以降の sort は安定なので、同順位の並びは保たれる
  return [...tasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
