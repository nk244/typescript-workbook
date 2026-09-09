import type { Equal, Expect } from '../lib/type-test';

// 13-1
type Color = 'red' | 'blue';
type Size = 'sm' | 'lg';

// ユニオンを埋め込むと全組み合わせに展開される
export type ButtonClass = `btn-${Color}-${Size}`;

export type _t1 = Expect<
  Equal<ButtonClass, 'btn-red-sm' | 'btn-red-lg' | 'btn-blue-sm' | 'btn-blue-lg'>
>;

// 13-2
type DomEvent = 'click' | 'focus' | 'blur';

export type HandlerName = `on${Capitalize<DomEvent>}`;

export type _t2 = Expect<Equal<HandlerName, 'onClick' | 'onFocus' | 'onBlur'>>;

// 13-3
export type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export type _t3 = Expect<
  Equal<
    Setters<{ name: string; age: number }>,
    { setName: (value: string) => void; setAge: (value: number) => void }
  >
>;

// 13-4
export type Split<S extends string, Sep extends string> = S extends `${infer Head}${Sep}${infer Tail}`
  ? [Head, ...Split<Tail, Sep>]
  : [S];

export type _t4 = Expect<Equal<Split<'a.b.c', '.'>, ['a', 'b', 'c']>>;
export type _t5 = Expect<Equal<Split<'abc', '.'>, ['abc']>>;

// 13-5
export type EventNameOf<T> = T extends `on${infer Rest}` ? Uncapitalize<Rest> : never;

export type _t6 = Expect<Equal<EventNameOf<'onClick'>, 'click'>>;
export type _t7 = Expect<Equal<EventNameOf<'click'>, never>>;

// 13-6
// ':param/残り' の形なら param を取り出しつつ残りを再帰。
// 末尾の ':param' は 2 番目の条件で拾う
export type PathParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | PathParams<`/${Rest}`>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;

export type _t8 = Expect<Equal<PathParams<'/users/:userId'>, 'userId'>>;
export type _t9 = Expect<Equal<PathParams<'/users/:userId/posts/:postId'>, 'userId' | 'postId'>>;
export type _t10 = Expect<Equal<PathParams<'/health'>, never>>;

// 13-7
export function buildPath<P extends string>(
  path: P,
  params: Record<PathParams<P> & string, string>,
): string {
  // 実行時はただの文字列置換。型のほうが「必要なキーが揃っているか」を保証してくれる
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = (params as Record<string, string>)[key];
    if (value === undefined) throw new Error(`パラメータが足りません: ${key}`);
    return value;
  });
}
