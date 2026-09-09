# 第13章 Template Literal Types

型の世界で文字列を組み立て、分解します。テンプレートリテラル（バッククォート）の型版です。

---

## 1. 基本

```ts
type Greeting = `hello ${string}`;

const a: Greeting = 'hello world';   // OK
const b: Greeting = 'hi world';      // エラー
```

ユニオンを埋め込むと、**組み合わせがすべて展開されます**。

```ts
type Color = 'red' | 'blue';
type Size = 'sm' | 'lg';
type Class = `${Color}-${Size}`;
// 'red-sm' | 'red-lg' | 'blue-sm' | 'blue-lg'
```

組み合わせ爆発に注意してください（数千を超えるとコンパイラが止めます）。

## 2. 組み込みの文字列操作型

```ts
type A = Uppercase<'abc'>;      // 'ABC'
type B = Lowercase<'ABC'>;      // 'abc'
type C = Capitalize<'abc'>;     // 'Abc'
type D = Uncapitalize<'Abc'>;   // 'abc'
```

Mapped Type の `as` 句と組み合わせるのが定番です（第11章の Getters）。

```ts
type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};
```

## 3. infer で文字列を分解する

条件型の `infer` は文字列にも使えます。

```ts
type Split<S extends string, Sep extends string> =
  S extends `${infer Head}${Sep}${infer Tail}` ? [Head, ...Split<Tail, Sep>] : [S];

type Parts = Split<'a.b.c', '.'>;   // ['a', 'b', 'c']
```

パターンにマッチさせて、前後をキャプチャする。正規表現のように読めます。

## 4. 実用例

### (a) イベント名の型付け

```ts
type DomEvent = 'click' | 'focus';
type Handler = `on${Capitalize<DomEvent>}`;   // 'onClick' | 'onFocus'
```

### (b) パスパラメータの抽出（ルーティング）

```ts
type Params<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | Params<`/${Rest}`>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type P = Params<'/users/:userId/posts/:postId'>;   // 'userId' | 'postId'
```

Express や React Router の型定義は、まさにこの手法で書かれています。
**URL 文字列を書いた瞬間に、必要なパラメータが型で要求される**わけです。

### (c) 深いパスの型

```ts
type Paths<T> = T extends object
  ? { [K in keyof T]: K extends string ? K | `${K}.${Paths<T[K]>}` : never }[keyof T]
  : never;

type P = Paths<{ user: { name: string } }>;   // 'user' | 'user.name'
```

i18n のキーやフォームライブラリ（react-hook-form など）でよく見る型です。

## 5. 落とし穴

- `${number}` や `${bigint}` はプレースホルダとして使えますが、
  **数値の範囲チェックはできません**（`` `${number}` `` は「数字っぽい文字列」）。
- ユニオンを 2 つ以上埋め込むと組み合わせ爆発します。実務では
  「1 つだけ可変」にとどめるのが安全です。
- **エラーメッセージが極端に読みにくくなります。** 凝った型を書くときは、
  中間の型に名前を付けて、少しずつ確かめながら進めてください。

---

## 演習

```bash
npm run check 13
```
