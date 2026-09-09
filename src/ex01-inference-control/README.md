# 外伝 第1章 推論を操る — NoInfer と const 型引数

> **外伝について**
> ここから先は「知らなくても書けるが、知っていると一段うまく書ける」テクニック集です。
> 本編（第1〜24章）を終えてから読んでください。順番はどこからでも構いません。

---

TypeScript は賢く推論してくれますが、**推論に任せると困る場面**があります。
そこを制御できると、「使う側が間違えられない API」が作れるようになります。

## 1. 型引数はどこから推論されるか

型引数 `T` は、**`T` が現れるすべての引数位置**から推論されます。複数あると合成されます。

```ts
declare function f<T>(a: T, b: T): T;

f(1, 2);        // T = number
f(1, 'a');      // T = 1 | "a"  ← 和集合に広がる（エラーにならない！）
```

これが問題になる典型例:

```ts
declare function createLight<C extends string>(colors: C[], defaultColor: C): void;

createLight(['red', 'green'], 'blue');
//                            ^^^^^^ 通ってしまう。C が 'red' | 'green' | 'blue' に広がるから
```

`colors` に含まれない色を既定値にできてしまいます。**推論元が 2 か所あるのが原因**です。

## 2. NoInfer\<T\> — 推論に使わせない（TS 5.4）

```ts
declare function createLight<C extends string>(colors: C[], defaultColor: NoInfer<C>): void;

createLight(['red', 'green'], 'blue');
//                            ~~~~~~ エラー: 'blue' は 'red' | 'green' ではない
```

`NoInfer<T>` は「**この位置は推論に使わず、決まった T に対して検査だけしろ**」という指示です。
**推論元を 1 か所に固定する**ための道具、と覚えてください。

実務でよく効く形:

```ts
function withDefault<T>(value: T | undefined, fallback: NoInfer<T>): T {
  return value ?? fallback;
}

const a = withDefault<'asc' | 'desc'>(input, 'asc');   // fallback は 'asc' | 'desc' しか許されない
```

`NoInfer` がなかった時代は `& {}` や余計な型引数で似たことをしていました。
古いライブラリの型にそういう記述を見かけたら、これが目的です。

## 3. const 型引数 — 呼び出し側の as const を不要にする（TS 5.0）

```ts
declare function defineRoutes<T extends readonly string[]>(routes: T): T[number];

defineRoutes(['/a', '/b']);            // string ... 惜しい
defineRoutes(['/a', '/b'] as const);   // '/a' | '/b'  ← 使う側に as const を強いる
```

型引数に `const` を付けると、**呼び出し側が `as const` を書かなくても**リテラル型で推論されます。

```ts
declare function defineRoutes<const T extends readonly string[]>(routes: T): T[number];

defineRoutes(['/a', '/b']);   // '/a' | '/b'
```

**ライブラリを書くときの定番**です。使う側の記述量を減らしつつ、型の精度を上げられます。

注意点:

- 効くのは**リテラルを直接渡したとき**だけ。変数に入れて渡すと元の型のままです
- `T extends readonly unknown[]` のように **readonly を許す制約**にしないと、
  `const` で `readonly` が付いた瞬間に制約を満たさなくなります

## 4. 推論を「引き算」する場所

覚えておくと得をする組み合わせ:

| 目的 | 書き方 |
| --- | --- |
| この引数は推論に使わせたくない | `NoInfer<T>` |
| リテラル型のまま受け取りたい | `<const T>` |
| 明示指定を必須にしたい | 型引数のデフォルトを使わず、推論元を作らない |
| 部分的に型引数を指定したい | 関数を 2 段にする（カリー化） |

最後の「部分適用」は、`f<A>()(b)` のように関数を分けるテクニックです。
TypeScript は**型引数を一部だけ指定することができない**（全部書くか全部推論か）ので、
どうしても片方だけ指定したいときはこうします。

```ts
const parse = <T,>() => (input: unknown): T => input as T;
const user = parse<User>()(raw);   // T だけ指定して、input は推論に任せる
```

## 5. 推論の広がり（widening）をもう一度

```ts
const a = 'x';              // 'x'（リテラル型のまま）
let b = 'x';                // string に広がる
const c = { k: 'x' };       // { k: string } ← プロパティは広がる
const d = { k: 'x' } as const;  // { readonly k: 'x' }
```

**「変更されうる場所は広がる」**が原則です。`const` の変数自体は変わらないので狭いまま、
オブジェクトのプロパティは書き換えられるので広がります。

---

## 演習

```bash
npm run check ex01
```
