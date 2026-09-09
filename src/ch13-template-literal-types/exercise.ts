import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 13-1: 組み合わせを作る
 * Color と Size からクラス名のユニオンを作ってください。
 * 例: 'btn-red-sm'
 * ============================================================ */
type Color = 'red' | 'blue';
type Size = 'sm' | 'lg';

export type ButtonClass = unknown; // TODO

export type _t1 = Expect<
  Equal<ButtonClass, 'btn-red-sm' | 'btn-red-lg' | 'btn-blue-sm' | 'btn-blue-lg'>
>;

/* ============================================================
 * 演習 13-2: イベントハンドラ名
 * イベント名から 'onXxx' 形式のユニオンを作ってください。
 * ============================================================ */
type DomEvent = 'click' | 'focus' | 'blur';

export type HandlerName = unknown; // TODO

export type _t2 = Expect<Equal<HandlerName, 'onClick' | 'onFocus' | 'onBlur'>>;

/* ============================================================
 * 演習 13-3: オブジェクトから setter 型を作る
 *   { name: string } -> { setName: (value: string) => void }
 * ============================================================ */
export type Setters<T> = unknown; // TODO

export type _t3 = Expect<
  Equal<
    Setters<{ name: string; age: number }>,
    { setName: (value: string) => void; setAge: (value: number) => void }
  >
>;

/* ============================================================
 * 演習 13-4: 文字列を分解する
 * 区切り文字で分割してタプルにする型を作ってください。
 * ============================================================ */
export type Split<S extends string, Sep extends string> = unknown; // TODO

export type _t4 = Expect<Equal<Split<'a.b.c', '.'>, ['a', 'b', 'c']>>;
export type _t5 = Expect<Equal<Split<'abc', '.'>, ['abc']>>;

/* ============================================================
 * 演習 13-5: 接頭辞を取り除く
 * 'on' で始まるならそれを外して先頭を小文字に、
 * 始まらなければ never を返す型を作ってください。
 * ============================================================ */
export type EventNameOf<T> = unknown; // TODO

export type _t6 = Expect<Equal<EventNameOf<'onClick'>, 'click'>>;
export type _t7 = Expect<Equal<EventNameOf<'click'>, never>>;

/* ============================================================
 * 演習 13-6: URL パスからパラメータを抽出する（実用）
 * ':name' の形の部分を取り出してユニオンにしてください。
 * ============================================================ */
export type PathParams<Path extends string> = unknown; // TODO

export type _t8 = Expect<Equal<PathParams<'/users/:userId'>, 'userId'>>;
export type _t9 = Expect<Equal<PathParams<'/users/:userId/posts/:postId'>, 'userId' | 'postId'>>;
export type _t10 = Expect<Equal<PathParams<'/health'>, never>>;

/* ============================================================
 * 演習 13-7: 型安全な URL ビルダー（実装込み）
 * PathParams で得たキーをすべて要求する buildPath を実装してください。
 *   buildPath('/users/:userId', { userId: '42' }) -> '/users/42'
 * ※ params の型は Record<PathParams<P>, string> にします。
 * ============================================================ */
export function buildPath<P extends string>(path: P, params: Record<PathParams<P> & string, string>): string {
  throw new Error('not implemented');
}
