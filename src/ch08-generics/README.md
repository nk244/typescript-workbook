# 第8章 ジェネリクス

## この章のゴール

- 型引数を「型を受け取る関数の引数」として理解する
- 制約（`extends`）とデフォルト型引数を書ける
- 「ジェネリクスにすべきか、ユニオンで十分か」を判断できる

---

## 1. なぜジェネリクスが要るのか

配列の先頭を返す関数を書きたい。愚直に書くとこうなります。

```ts
function firstOfNumbers(items: number[]): number | undefined { return items[0]; }
function firstOfStrings(items: string[]): string | undefined { return items[0]; }
```

`any` にすると型が消えます。

```ts
function first(items: any[]): any { return items[0]; }
const x = first([1, 2]);   // any になってしまう
```

ジェネリクスは「**入力の型と出力の型の関係**」を書くための道具です。

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const a = first([1, 2]);       // number | undefined
const b = first(['x']);        // string | undefined
```

`T` は呼び出しごとに決まる**型のプレースホルダ**です。ほとんどの場合、
呼び出し側は何も書かなくても**引数から推論されます**（型引数推論）。

## 2. 制約（constraints）

`T` は何でもよい、では困ることがあります。

```ts
function longest<T>(a: T, b: T): T {
  return a.length > b.length ? a : b;   // エラー: T に length があるとは限らない
}
```

「length を持つ何か」に限定します。

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length > b.length ? a : b;
}

longest('abc', 'de');       // OK
longest([1], [2, 3]);       // OK
longest(1, 2);              // エラー: number に length はない
```

`extends` は「継承」ではなく「**部分型であること**」の要求です。集合で言えば「T ⊆ 制約」。

よく使う制約:

```ts
<T extends object>            // オブジェクトなら何でも
<K extends keyof T>           // T のキーのどれか（後述）
<T extends (...args: any) => any>   // 何らかの関数
```

## 3. keyof との組み合わせ — 定番中の定番

```ts
function prop<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'ken', age: 30 };
prop(user, 'name');   // string
prop(user, 'age');    // number
prop(user, 'xxx');    // エラー: 'xxx' は keyof user ではない
```

`keyof T` は「T のキーのユニオン」（ここでは `'name' | 'age'`）、
`T[K]` は「T の K に対応する値の型」を取り出す**インデックスアクセス型**です。
この 2 つを組み合わせると、**キーと値の対応をコンパイラに追跡させられます。**

## 4. デフォルト型引数

```ts
type ApiResult<T = unknown> = { ok: boolean; data: T };

const r1: ApiResult = { ok: true, data: 'なんでも' };        // T = unknown
const r2: ApiResult<number> = { ok: true, data: 42 };
```

## 5. ジェネリックな型・クラス・インターフェース

```ts
type Box<T> = { value: T };

interface Repository<T, ID = string> {
  find(id: ID): Promise<T | null>;
  save(entity: T): Promise<void>;
}

class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}
```

## 6. 「使いすぎ」を避ける指針

ジェネリクスは強力ですが、**型引数が 1 回しか出てこないなら要りません。**

```ts
// 悪い例: T が引数にしか現れない = ただの any 相当
function log<T>(value: T): void { console.log(value); }
// これでいい
function log(value: unknown): void { console.log(value); }
```

**型引数は「2 か所以上を結びつけるため」にある**、と覚えてください。
引数と戻り値、引数と引数、キーと値。結びつけるものがないなら不要です。

---

## 演習

```bash
npm run check 08
```
