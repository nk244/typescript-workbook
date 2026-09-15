# 第9章 判別可能なユニオン / 型述語 / 網羅性チェック

この章は **TypeScript でいちばん役に立つ設計パターン**を扱います。ここを身につけると、
「ありえない状態」をコードに書けなくできます。

---

## 1. 判別可能なユニオン（Discriminated Union）

共通のリテラル型プロパティ（**判別子**）を持つオブジェクト型のユニオンです。

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;   // ここでは circle 側に確定している
    case 'rect':
      return shape.width * shape.height;
  }
}
```

`kind` を見るだけでコンパイラが型を絞り込みます。**判別子は必ずリテラル型**にしてください
（`string` にすると絞り込めません）。

## 2. これが効く本当の理由 — 不正な状態を表現できなくする

非同期データの状態をこう書く人は多いです。

```ts
type State = {
  loading: boolean;
  data: User | null;
  error: Error | null;
};
```

この型では `{ loading: true, data: user, error: err }` という**ありえない組み合わせ**が作れてしまいます。
判別可能なユニオンなら:

```ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };
```

- `data` は success のときにしか存在しない → `state.data` の null チェックが不要になる
- ありえない組み合わせは**そもそも作れない**

**「型で不正な状態を排除する（make illegal states unrepresentable）」。**
第22章の React の状態管理まで、この考え方がずっと使われます。

## 3. 網羅性チェック（Exhaustiveness Check）

`never` を使うと、「ケースを追加したのに処理を書き忘れた」をコンパイラに検出させられます。

```ts
function assertNever(value: never): never {
  throw new Error(`未対応のケース: ${JSON.stringify(value)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rect':   return shape.width * shape.height;
    default:
      return assertNever(shape);   // ここに来る型は never のはず
  }
}
```

`Shape` に `{ kind: 'triangle' }` を足すと、`shape` は `default` で `never` にならず、
**`assertNever(shape)` がコンパイルエラーになります。** 直すべき場所が自動的に列挙される。

これは実務で本当に効きます。**ユニオンを switch する場所には、必ずこれを入れてください。**

## 4. 型述語（Type Predicate）

`value is Type` という戻り値型を書くと、自作の関数で絞り込めるようになります。

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function f(x: unknown) {
  if (isString(x)) {
    x.toUpperCase();   // OK
  }
}
```

**注意: 型述語は「嘘をつけます」。** 中身が正しいかはコンパイラが検証しません
（TypeScript 5.5 以降は、単純な形なら推論して検証してくれる場合もあります）。
`as` と同じで、**正しさの責任は書いた人にあります。** だからこそ、型述語は
「1 か所に集めて、そこだけを注意深くテストする」のが定石です。

## 5. assertion 関数

`asserts` を使うと「これ以降は確定」という形にできます。

```ts
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) throw new Error('値がありません');
}

function f(user: User | null) {
  assertIsDefined(user);
  user.name;   // ここから下は User に確定
}
```

`asserts` を使う関数は**必ず明示的な型注釈が必要**です（推論に任せられない）。

`NonNullable<T>` は `T` から `null | undefined` を除いた型を作る、組み込みのユーティリティ型です
（体系的には第10章で扱います）。ここでは「`T` から null/undefined を取り除いた型」とだけ
理解しておけば十分です。

## 6. タグの付け方の実務的な指針

- プロパティ名は `kind` / `type` / `status` あたりが一般的。**プロジェクト内で統一する**こと。
- Redux や React の reducer では慣習的に `type`。
- 判別子は必ず**文字列リテラル**に（数値でも動くが読みにくい）。

---

## 演習

```bash
npm run check 09
```
