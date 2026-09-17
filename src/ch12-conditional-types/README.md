# 第12章 Conditional Types と infer

型の世界の `if` と、パターンマッチです。ここを越えると、型定義ファイルが読めるようになります。

---

## 1. 条件型の基本

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>;   // true
type B = IsString<42>;        // false
```

`T extends U ? X : Y` は「T が U に代入可能なら X、でなければ Y」。
**`extends` は継承ではなく、部分型判定**でしたね（第8章）。

## 2. 分配される条件型（Distributive Conditional Types）

ここが最重要かつ最大の落とし穴です。

```ts
type ToArray<T> = T extends unknown ? T[] : never;

type R = ToArray<string | number>;
// 期待: (string | number)[]
// 実際: string[] | number[]   ← 各メンバーに分配された！
```

**裸の型引数（naked type parameter）に条件型を適用すると、ユニオンの各メンバーに分配されます。**
`Exclude` はこの性質を使って実装されています。

```ts
type MyExclude<T, U> = T extends U ? never : T;
type X = MyExclude<'a' | 'b' | 'c', 'a'>;
// 'a' extends 'a' ? never : 'a'  -> never
// 'b' extends 'a' ? never : 'b'  -> 'b'
// 'c' extends 'a' ? never : 'c'  -> 'c'
// 結果: 'b' | 'c'
```

### 分配を止める方法

型引数をタプルで包みます。

```ts
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type R2 = ToArrayNonDist<string | number>;   // (string | number)[]
```

第2章で `[A] extends [B]` と書いたのはこのためでした。

### never の罠

分配される条件型に `never` を渡すと、**「メンバーが 0 個のユニオン」として扱われ、結果も `never`** になります。

```ts
type IsNever<T> = T extends never ? true : false;
type X = IsNever<never>;   // never（true ではない！）

// 正しくはこう書く
type IsNever2<T> = [T] extends [never] ? true : false;
type Y = IsNever2<never>;  // true
```

## 3. infer — 型の中から取り出す

`infer` は条件型の中でだけ使える「ここに当てはまる型に名前を付ける」構文です。

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;

type A = ElementOf<string[]>;    // string
type B = ElementOf<number>;      // never
```

正規表現のキャプチャグループのようなものだと思ってください。

### 組み込み型はほぼこれで書かれている

```ts
type MyReturnType<F> = F extends (...args: never[]) => infer R ? R : never;
type MyParameters<F> = F extends (...args: infer P) => unknown ? P : never;
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;   // 再帰で何重でも剥がす
```

`lib.es5.d.ts` を開くと、まさにこう書かれています。**標準ライブラリの型定義を読めるようになる**のが
この章のいちばんの成果です。

### 複数の infer / 制約付き infer

```ts
type FirstArg<F> = F extends (first: infer A, ...rest: never[]) => unknown ? A : never;

// infer に制約をつけられる（TS 4.7+）
type FirstString<T> = T extends [infer S extends string, ...unknown[]] ? S : never;
```

### 引数が 0 個の関数と区別する

`(first: infer A, ...rest: never[]) => unknown` のように直接マッチさせると、
「引数は少なくてよい」（第6章）の規則のせいで、引数 0 個の関数もマッチしてしまい、
`A` が意図しない型に推論されることがあります。**「引数があるかどうか」を確実に区別したい**ときは、
まず引数リストをタプルごと `infer` で取り出してから、タプルの形で分岐します。

```ts
type FirstParamSafe<F> = F extends (...args: infer P) => unknown
  ? P extends [infer A, ...unknown[]]
    ? A       // 1 個以上ある
    : never   // 0 個
  : never;

type X = FirstParamSafe<(name: string) => void>;   // string
type Y = FirstParamSafe<() => void>;                // never
```

`P extends [infer A, ...unknown[]]` は「P というタプルの先頭を A として取り出せるか（＝要素が 1 個以上あるか）」という判定です。

## 4. 再帰的な条件型

タプルの操作は再帰で書きます。

```ts
type Reverse<T extends readonly unknown[]> =
  T extends readonly [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : [];

type R = Reverse<[1, 2, 3]>;   // [3, 2, 1]
```

読み方は関数型言語のパターンマッチと同じ。「先頭と残りに分解して、残りを再帰処理」。

## 5. どこまでやるべきか

型レベルプログラミングは楽しくて沼です。実務での指針:

- **アプリコードでは、この章の道具はほとんど要りません。** 使うのは `ReturnType` くらい。
- **ライブラリや共通基盤を書くときに要ります。** 使う側が何も書かなくて済むようにするために。
- 3 行を超える条件型を書き始めたら、「本当にこれが必要か」を一度疑ってください。
  型を凝るより、**データ構造を単純にしたほうが解決することが多い**です。

ただし**読める**必要は常にあります。ライブラリの型でエラーが出たとき、
定義を読めないと詰むからです。

---

## 演習

```bash
npm run check 12
```
