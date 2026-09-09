# TypeScript 文法 早見表

演習中に「あの書き方どうだっけ」となったとき用。詳しい説明は各章の README にあります。

---

## 基本

```ts
const s: string = 'a';
let n: number | null = null;
const t: [string, number] = ['a', 1];       // タプル
const arr: readonly string[] = ['a'];        // readonly 配列
const o: { a: number; b?: string } = { a: 1 };
```

## 型の定義

```ts
type A = { x: number };
interface B { x: number }                    // 宣言のマージができる
type C = A & { y: string };                  // 交差
type D = A | { z: boolean };                 // ユニオン
type E = 'a' | 'b';                          // リテラルのユニオン
```

## 絞り込み（第3・9章）

```ts
typeof x === 'string'
x instanceof Error
'key' in obj
Array.isArray(x)
x === 'literal'
if (x) { }                                   // null/undefined 除去
function isUser(v: unknown): v is User {}    // 型述語
function assertIsUser(v: unknown): asserts v is User {}
```

## ジェネリクス（第8章）

```ts
function f<T>(x: T): T
function g<T extends { length: number }>(x: T)
function h<T, K extends keyof T>(obj: T, key: K): T[K]
type Box<T = string> = { value: T }          // デフォルト型引数
```

## 演算子いろいろ

```ts
keyof T                    // キーのユニオン
T[K]                       // インデックスアクセス型
typeof value               // 値 -> 型
(typeof ARR)[number]       // 配列の要素型
value as T                 // アサーション（検査しない）
value satisfies T          // 制約だけかけて推論は保つ
value!                     // null/undefined でないと断言（避ける）
value?.prop                // オプショナルチェーン
value ?? fallback          // null/undefined のときだけ既定値
[...tuple] as const        // リテラル型に固定
```

## Mapped Types（第11章）

```ts
{ [K in keyof T]: T[K] }              // そのまま
{ [K in keyof T]?: T[K] }             // 全部オプショナル
{ readonly [K in keyof T]: T[K] }     // 全部 readonly
{ -readonly [K in keyof T]-?: T[K] }  // readonly と ? を外す
{ [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }   // キー変換
{ [K in keyof T as T[K] extends Fn ? K : never]: T[K] }            // キー除外
```

## Conditional Types（第12章）

```ts
T extends U ? X : Y                   // 条件
[T] extends [U] ? X : Y               // 分配を止める
T extends (infer E)[] ? E : never     // 取り出す
T extends [infer H, ...infer R] ? ... // タプルを再帰処理
```

## 組み込みユーティリティ型（第10章）

| 型 | 効果 |
| --- | --- |
| `Partial<T>` / `Required<T>` | 全部 `?` にする / 外す |
| `Readonly<T>` | 全部 readonly |
| `Pick<T, K>` / `Omit<T, K>` | 選ぶ / 除く |
| `Record<K, V>` | キー K の辞書 |
| `Exclude<T, U>` / `Extract<T, U>` | ユニオンから除く / 残す |
| `NonNullable<T>` | null と undefined を除く |
| `ReturnType<F>` / `Parameters<F>` | 戻り値 / 引数タプル |
| `Awaited<T>` | Promise を剥がす |
| `InstanceType<C>` / `ConstructorParameters<C>` | クラスから |
| `Uppercase` / `Capitalize` など | 文字列変換 |

## React（第19〜22章）

```tsx
type Props = { title: string; children?: React.ReactNode };
function C({ title, children }: Props) { }

React.ComponentProps<'button'>            // button の props 全部
React.ComponentProps<typeof MyComponent>  // 既存コンポーネントの props
React.MouseEventHandler<HTMLButtonElement>
React.Dispatch<React.SetStateAction<T>>
React.ElementType                         // as prop 用

const [v, setV] = useState<T | null>(null);
const [state, dispatch] = useReducer(reducer, init);
const ref = useRef<HTMLInputElement>(null);
return [value, toggle] as const;           // カスタムフックのタプル返し
```

## よく使う型のイディオム

```ts
// 定数から型を作る
const ROLES = ['admin', 'user'] as const;
type Role = (typeof ROLES)[number];

// オブジェクト定数から値のユニオン
const Level = { A: 'a', B: 'b' } as const;
type Level = (typeof Level)[keyof typeof Level];

// ブランド型
type UserId = string & { readonly __brand: 'UserId' };

// Result 型
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// 非同期状態
type Async<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// 網羅性チェック
function assertNever(x: never): never { throw new Error(String(x)); }
```

---

## 外伝で扱う技（ex01〜ex06）

```ts
// 推論の制御
function f<T>(a: T, b: NoInfer<T>): T          // b を推論に使わせない
function g<const T extends readonly string[]>(x: T)  // 呼び出し側の as const が不要

// ユニオン操作
type ActionFrom<M> = { [K in keyof M]: { type: K } & M[K] }[keyof M];
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type UnionToIntersection<U> =
  (U extends unknown ? (a: U) => void : never) extends (a: infer I) => void ? I : never;
const X = { a: 1 } as const satisfies Record<string, number>;   // 値は固定・形は検査

// 可変長タプル
type Last<T> = T extends readonly [...unknown[], infer L] ? L : never;
type AwaitAll<T extends readonly unknown[]> = { [K in keyof T]: Awaited<T[K]> };  // タプルを保つ
function wrap<F extends (...a: never[]) => unknown>(fn: F):
  (...args: Parameters<F>) => ReturnType<F>

// 型で状態を持つ
type Conn<S extends 'open' | 'closed'> = { state: S };          // ファントム型
build(this: 'table' extends Set ? Builder<Set> : never): string // 条件付き this
where(cond: string): this                                       // polymorphic this
assertLoaded(): asserts this is { value: T }
declare const brand: unique symbol;
type Meters = number & { readonly [brand]: true };

// 開発体験
type Prettify<T> = { [K in keyof T]: T[K] } & {};
type Invalid<M extends string> = { readonly __error: M };
using span = new Span();          // スコープを抜けると Symbol.dispose が呼ばれる

// 記法
interface Producer<out T> { get(): T }
type DataAttrs = { [K in `data-${string}`]: string };
type ToNumber<S> = S extends `${infer N extends number}` ? N : never;
type AbstractCtor<T> = abstract new (...args: never[]) => T;
const makeNumberBox = makeBox<number>;   // インスタンス化式
```
