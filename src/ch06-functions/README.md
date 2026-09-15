# 第6章 関数の型

## この章のゴール

- 関数型の書き方（引数・戻り値・オプショナル・レスト）を一通り書ける
- コールバックの型がなぜ「少ない引数でも渡せる」のかを説明できる
- オーバーロードを書けて、かつ「使わないほうがよい場面」も分かる

---

## 1. 関数の型注釈

```ts
// 関数宣言
function add(a: number, b: number): number {
  return a + b;
}

// 関数型（型として書く）
type Add = (a: number, b: number) => number;

// 関数式に型をつける
const add2: Add = (a, b) => a + b;   // 引数の型は文脈から推論される（contextual typing）
```

`add2` のように **型が先に決まっていれば引数に注釈は不要**です。これを文脈的型付けと言い、
コールバックを書くときに毎回効いてきます。

```ts
[1, 2, 3].map((n) => n * 2);   // n は number と推論される
```

## 2. オプショナル引数・デフォルト値・レスト引数

```ts
function f(a: number, b?: number) {}            // b: number | undefined
function g(a: number, b: number = 10) {}        // b: number（呼ぶ側は省略可）
function h(...args: number[]) {}                // レスト
function i(first: string, ...rest: string[]) {}
```

注意: **オプショナル引数は必須引数より後ろにしか置けません。**
「途中を省略したい」ときは、引数をオブジェクトにまとめるのが定石です。

```ts
function createUser(options: { name: string; age?: number; admin?: boolean }) {}
createUser({ name: 'ken', admin: true });   // 順番を気にしなくてよい
```

## 3. 関数の代入互換性 — 「引数は少なくてよい」

ここは直感に反するので、理屈まで押さえてください。

```ts
type Handler = (event: string, index: number) => void;

const h1: Handler = (event, index) => {};   // OK
const h2: Handler = (event) => {};          // OK！ 引数が少なくても代入できる
const h3: Handler = (event, index, extra) => {};  // エラー: 多いのはダメ
```

なぜ少ないのが許されるか。**呼び出し側は 2 個渡すが、受け取る側は無視してよい**からです。
JS で `arr.forEach(x => ...)` と書けるのはこの規則のおかげ（実際は 3 引数渡ってくる）。

戻り値については逆に、**`void` を期待する場所には何を返す関数でも渡せます。**

```ts
const nums: number[] = [];
[1, 2].forEach((n) => nums.push(n));   // push は number を返すが forEach は void 期待。OK
```

## 4. 関数のオーバーロード

引数の形によって戻り値の型が変わる関数を表現できます。

```ts
function parse(input: string): string[];
function parse(input: number): number[];
function parse(input: string | number): string[] | number[] {
  // ↑ 実装シグネチャ。呼び出し側からは見えない
  return typeof input === 'string' ? [input] : [input];
}

const a = parse('x');   // string[]
const b = parse(1);     // number[]
```

**注意点:**

- 実装シグネチャは外から呼べません（オーバーロードの一覧だけが公開 API）。
- 実装の中では引数が union なので、絞り込みが必要です。
- **多くの場合、オーバーロードよりジェネリクス（第8章）やユニオンのほうが素直**です。
  オーバーロードは「引数の組み合わせが本当に離散的なとき」だけにしましょう。

## 5. 関数を受け取る関数（高階関数）

`<T>` は**ジェネリクス**（型の引数）です。体系的には第8章で扱いますが、ここでは
「呼び出しごとに決まる型のプレースホルダ」とだけ思っておけば読めます。

```ts
function retry<T>(fn: () => T, times: number): T {
  let lastError: unknown;
  for (let i = 0; i < times; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
```

コールバックの型をきちんと書くと、呼び出し側では**何も書かなくても**型が流れます。
これが TypeScript の一番気持ちのいいところです。

## 6. this の型

コールバック内の `this` にも型をつけられます（第 1 引数の位置に特別に書く）。

```ts
function handler(this: HTMLButtonElement, event: Event) {
  this.disabled = true;
}
```

この `this` は**実行時の引数ではありません**（コンパイル時だけの宣言）。
アロー関数には `this` がないので、この記法は使えません。

---

## 演習

```bash
npm run check 06
```
