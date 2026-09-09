import type { Equal, Expect } from '../lib/type-test';

// ex01-1
declare function pair<T>(a: T, b: T): T[];

export type Pair1 = ReturnType<typeof pair<number>>;
// 2 か所から推論されると和集合に広がる。エラーにはならないのが厄介なところ
export type Pair2 = (1 | 'a')[];

export type _t1 = Expect<Equal<Pair2, ReturnType<typeof pair<1 | 'a'>>>>;

// ex01-2
// NoInfer を付けると defaultColor は推論に使われず、colors から決まった C で検査される
export function createLight<C extends string>(colors: C[], defaultColor: NoInfer<C>): C {
  return colors.includes(defaultColor) ? defaultColor : (colors[0] as C);
}

// ex01-3
export function withDefault<T>(value: T | undefined, fallback: NoInfer<T>): T {
  return value ?? fallback;
}

// ex01-4
// const 型引数。呼び出し側の as const が不要になる
export function defineRoutes<const T extends readonly string[]>(routes: T): T[number] {
  return routes[0] as T[number];
}

export type _t2 = Expect<Equal<ReturnType<typeof defineRoutes<['/a', '/b']>>, '/a' | '/b'>>;

const routes = defineRoutes(['/home', '/about']);
export type _t3 = Expect<Equal<typeof routes, '/home' | '/about'>>;

// ex01-5
export function defineConfig<const T extends Record<string, string>>(config: T): T {
  return config;
}

const config = defineConfig({ env: 'production' });
export type _t4 = Expect<Equal<typeof config, { readonly env: 'production' }>>;

// ex01-6
type User = { id: number };

// TypeScript は型引数を「一部だけ」指定できないので、関数を 2 段にして分ける
export function cast<T>(): (input: unknown) => T {
  return (input) => input as T;
}

export type _t5 = Expect<Equal<ReturnType<ReturnType<typeof cast<User>>>, User>>;
