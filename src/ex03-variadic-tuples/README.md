# 外伝 第3章 可変長タプルと関数型の技

「引数の並びをそのまま型として持ち回る」テクニックです。
デコレータ、ラッパー関数、`pipe`、DI コンテナ — 汎用の道具を書くときに必ず要ります。

---

## 1. 可変長タプル型（Variadic Tuple Types）

タプルの中でスプレッドが書けます。

```ts
type Push<T extends readonly unknown[], V> = [...T, V];
type Unshift<T extends readonly unknown[], V> = [V, ...T];
type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];

type A = Push<[1, 2], 3>;   // [1, 2, 3]
```

分解は `infer` と組み合わせます。

```ts
type Head<T> = T extends readonly [infer H, ...unknown[]] ? H : never;
type Tail<T> = T extends readonly [unknown, ...infer R] ? R : never;
type Last<T> = T extends readonly [...unknown[], infer L] ? L : never;   // 末尾も取れる
```

**`[...unknown[], infer L]` のように「先頭が可変長」でも書ける**のがポイントです。

## 2. 関数の引数をタプルとして扱う

```ts
type Fn = (a: string, b: number) => boolean;
type Args = Parameters<Fn>;          // [a: string, b: number]
type Ret = ReturnType<Fn>;           // boolean
```

これを組み合わせると、**元の関数のシグネチャを保ったままラップする**関数が書けます。

```ts
function withLogging<F extends (...args: never[]) => unknown>(fn: F, name: string) {
  return (...args: Parameters<F>): ReturnType<F> => {
    console.log(`${name} 開始`);
    return fn(...(args as never[])) as ReturnType<F>;
  };
}

const add = (a: number, b: number) => a + b;
const logged = withLogging(add, 'add');
logged(1, 2);      // (a: number, b: number) => number のまま
logged('x');       // エラー
```

**引数の型・名前・省略可否がすべて保たれます。** 手で `(a: number, b: number)` と書き写す必要がない。

### 第 1 引数だけ束縛する

```ts
function bindFirst<A, R, Rest extends unknown[]>(
  fn: (first: A, ...rest: Rest) => R,
  first: A,
): (...rest: Rest) => R {
  return (...rest) => fn(first, ...rest);
}
```

`Rest extends unknown[]` を型引数にして `...rest: Rest` と展開する。
**「残りの引数」を型として持ち回る**のが可変長タプルの主用途です。

## 3. Mapped Type はタプルの形を保つ

これは意外と知られていません。

```ts
type Awaitify<T extends readonly unknown[]> = { [K in keyof T]: Awaited<T[K]> };

type R = Awaitify<[Promise<string>, Promise<number>]>;
// [string, number]   ← 配列ではなくタプルのまま！
```

`keyof` がタプルに対しては「インデックス」を指すため、**長さと順序が保たれます**。
`Promise.all` の型定義がタプルを返せるのは、この仕組みのおかげです。

## 4. pipe を型付けする

関数を左から順に適用する `pipe` は、**型パズルの練習台として定番**です。

```ts
type PipeResult<Fns extends readonly unknown[], In> =
  Fns extends readonly [(arg: In) => infer Out, ...infer Rest]
    ? PipeResult<Rest, Out>
    : In;

type R = PipeResult<[(n: number) => string, (s: string) => boolean], number>;   // boolean
```

「先頭の関数を適用して、残りに再帰」。第12章のタプル再帰そのものです。

実務では、この手の関数は**オーバーロードを 10 個くらい並べて実装する**ことが多いです
（RxJS や lodash の `flow` がそう）。再帰型より型エラーが分かりやすく、
エディタの補完も効きやすいためです。**凝った型が常に正解とは限りません。**

## 5. ラベル付きタプルと引数の可読性

```ts
type Handler = (...args: [event: string, index: number]) => void;
```

ラベルは型チェックに影響しませんが、**エディタの補完に名前が出ます**。
可変長タプルを引数に展開するときは、必ずラベルを付けておくと親切です。

---

## 演習

```bash
npm run check ex03
```
