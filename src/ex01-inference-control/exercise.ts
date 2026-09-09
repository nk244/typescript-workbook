import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 ex01-1: 推論が広がることを確認する
 * 下の呼び出しで T が何に推論されるか答えてください。
 * ============================================================ */
declare function pair<T>(a: T, b: T): T[];

export type Pair1 = ReturnType<typeof pair<number>>;
// TODO: pair(1, 'a') の戻り値の型を書く（エラーにならないことに注意）
export type Pair2 = unknown;

export type _t1 = Expect<Equal<Pair2, ReturnType<typeof pair<1 | 'a'>>>>;

/* ============================================================
 * 演習 ex01-2: NoInfer で既定値を縛る
 * createLight(['red', 'green'], 'blue') がコンパイルエラーになるように
 * シグネチャを直してください。実装は変えないこと。
 * ============================================================ */
export function createLight<C extends string>(colors: C[], defaultColor: C): C {
  return colors.includes(defaultColor) ? defaultColor : (colors[0] as C);
}

/* ============================================================
 * 演習 ex01-3: NoInfer を実用パターンで使う
 * withDefault は「値が undefined なら fallback を返す」関数です。
 * withDefault<'asc' | 'desc'>(undefined, 'ascc') が
 * エラーになるようにしてください（fallback から T を推論させない）。
 * ============================================================ */
export function withDefault<T>(value: T | undefined, fallback: T): T {
  return value ?? fallback;
}

/* ============================================================
 * 演習 ex01-4: const 型引数
 * defineRoutes(['/a', '/b']) が '/a' | '/b' を返すようにしてください。
 * 呼び出し側に as const を書かせないこと。
 * ============================================================ */
export function defineRoutes<T extends readonly string[]>(routes: T): T[number] {
  return routes[0] as T[number];
}

export type _t2 = Expect<Equal<ReturnType<typeof defineRoutes<['/a', '/b']>>, '/a' | '/b'>>;

// 呼び出しから推論された型もリテラルになること
const routes = defineRoutes(['/home', '/about']);
export type _t3 = Expect<Equal<typeof routes, '/home' | '/about'>>;

/* ============================================================
 * 演習 ex01-5: const 型引数とオブジェクト
 * defineConfig にオブジェクトを渡したとき、
 * キーも値もリテラル型のまま受け取れるようにしてください。
 * ============================================================ */
export function defineConfig<T extends Record<string, string>>(config: T): T {
  return config;
}

const config = defineConfig({ env: 'production' });
export type _t4 = Expect<Equal<typeof config, { readonly env: 'production' }>>;

/* ============================================================
 * ex01-6: 型引数の部分適用
 * 「T だけ明示して、引数は推論させたい」関数を作ってください。
 *   const toUser = cast<User>();
 *   const user = toUser(raw);   // User
 * ============================================================ */
type User = { id: number };

export function cast(): unknown {
  // TODO: <T>() => (input: unknown) => T の形にする
  throw new Error('not implemented');
}

export type _t5 = Expect<Equal<ReturnType<ReturnType<typeof cast<User>>>, User>>;
