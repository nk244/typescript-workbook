import type { Equal, Expect } from '../lib/type-test';

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

// 10-1
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserInput = Partial<CreateUserInput>;

export type _t1 = Expect<Equal<CreateUserInput, { name: string; email: string }>>;
export type _t2 = Expect<Equal<UpdateUserInput, { name?: string; email?: string }>>;

// 10-2
export type UserSummary = Pick<User, 'id' | 'name'>;

export type _t3 = Expect<Equal<UserSummary, { id: number; name: string }>>;

// 10-3
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Record<Status, string> にしておくと、Status が増えたときにここがエラーになる
export const STATUS_LABELS: Record<Status, string> = {
  idle: '待機中',
  loading: '読み込み中',
  success: '完了',
  error: '失敗',
};

// 10-4
export type ActiveStatus = Exclude<Status, 'idle'>;

export type _t4 = Expect<Equal<ActiveStatus, 'loading' | 'success' | 'error'>>;

// 10-5
export function buildConfig(host: string, port: number) {
  return { host, port, url: `http://${host}:${port}` };
}

export type Config = ReturnType<typeof buildConfig>;
export type ConfigArgs = Parameters<typeof buildConfig>;

export type _t5 = Expect<Equal<Config, { host: string; port: number; url: string }>>;
export type _t6 = Expect<Equal<ConfigArgs, [host: string, port: number]>>;

// 10-6
export async function fetchUser(id: number): Promise<User> {
  void id;
  throw new Error('not implemented');
}

export type FetchedUser = Awaited<ReturnType<typeof fetchUser>>;

export type _t7 = Expect<Equal<FetchedUser, User>>;

// 10-7
export function createUser(input: CreateUserInput, nextId: number, now: Date): User {
  return { id: nextId, createdAt: now, ...input };
}

// 10-8
export type MaybeUser = User | null | undefined;
export type DefiniteUser = NonNullable<MaybeUser>;

export type _t8 = Expect<Equal<DefiniteUser, User>>;
