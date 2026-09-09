# 外伝 第6章 知っていると読める記法カタログ

「見たことはあるが自分では書いたことがない」記法を潰していきます。
**書けるようになること以上に、ライブラリの型定義を読めるようになる**のが目的です。

---

## 1. 変性注釈 `in` / `out`（TS 4.7）

```ts
interface Producer<out T> { get(): T }        // T は共変（出力にしか現れない）
interface Consumer<in T> { set(value: T): void }   // T は反変（入力にしか現れない）
interface Both<in out T> { get(): T; set(value: T): void }   // 不変
```

TypeScript は普段、変性を**構造から自動で判定**します。`in` / `out` は
「**この変性であることを宣言し、違っていたらエラーにする**」ためのものです。

効果は 2 つ。

1. **意図がドキュメントになる**（この型引数は出力専用だ、と読み手に分かる）
2. **型チェックが速くなる**（構造を辿らずに変性を決められる）

大きな型を持つライブラリでよく使われています。アプリコードでは必須ではありません。

## 2. テンプレートリテラルのインデックスシグネチャ

```ts
type DataAttrs = { [K in `data-${string}`]: string };

const attrs: DataAttrs = { 'data-id': '1', 'data-role': 'row' };   // OK
const bad: DataAttrs = { id: '1' };                                 // エラー
```

「特定のパターンのキーだけ許す」が書けます。React の `data-*` / `aria-*`、
CSS-in-JS の `&:hover` のようなキー、i18n のキー空間などで使われます。

symbol をキーにすることもできます。

```ts
type Registry = { [key: symbol]: unknown };
```

## 3. getter と setter で型を変える（TS 4.3）

```ts
class Temperature {
  #celsius = 0;

  get celsius(): number {
    return this.#celsius;
  }

  set celsius(value: number | string) {   // 受け取りは広く、返すのは狭く
    this.#celsius = Number(value);
  }
}
```

「入れるときは緩く、出すときは厳密に」が表現できます。
DOM の型定義（`style.width` に number も string も入る、など）がこの形です。

## 4. `infer X extends T`（TS 4.8）

`infer` に制約を付けられます。文字列を数値リテラル型に変換する、という芸当が可能に。

```ts
type ToNumber<S> = S extends `${infer N extends number}` ? N : never;

type A = ToNumber<'42'>;   // 42（number 型のリテラル！）
type B = ToNumber<'x'>;    // never
```

パスパラメータの型を `string` ではなく `number` にしたい、というときに効きます。

## 5. abstract construct signature

「クラスそのもの」を引数に取る型です。

```ts
type Ctor<T> = new (...args: never[]) => T;
type AbstractCtor<T> = abstract new (...args: never[]) => T;

function create<T>(C: Ctor<T>): T {
  return new C();
}

function isInstance<T>(C: AbstractCtor<T>, value: unknown): value is T {
  return value instanceof (C as never);
}
```

`abstract new` を使うと、**抽象クラスも渡せます**（`new` できないクラスは
通常の construct signature に代入できないため）。`instanceof` チェックの
ヘルパーを書くときはこちらが必要です。

関連: `InstanceType<typeof MyClass>` は「そのクラスのインスタンス型」。

## 6. import / export の細かい記法

```ts
import type { User } from './types';          // 型だけ
import { type User, createUser } from './api';// 混在（インライン type）
import type * as Types from './types';        // 名前空間として型だけ

export type * from './types';                 // 型だけ再エクスポート（TS 5.0）
export { type User } from './types';
```

`verbatimModuleSyntax: true` にすると、値と型の区別が**強制**されます（第18章）。
バンドラを使うプロジェクトでは入れておくとトラブルが減ります。

## 7. その他、見かける記法

```ts
// 関数の this を明示（第6章）
function handler(this: HTMLElement, e: Event): void {}

// タプルのラベル（第3章外伝）
type Args = [name: string, age?: number, ...rest: boolean[]];

// satisfies を式の途中で
const config = { port: 8080 } satisfies { port: number };

// 明示的な型引数の指定（インスタンス化式、TS 4.7）
const numberBox = makeBox<number>;   // 呼び出さずに型引数だけ固定した関数を作る

// クラスの auto accessor（TS 4.9）※ 実行環境がデコレータ相当の変換に対応している必要あり
class C {
  accessor count = 0;   // getter/setter が自動生成される
}
```

**最後の `accessor` は、ビルド設定によっては動きません**（この教材のテスト環境でも
実行時変換に未対応です）。読めれば十分、という位置づけで挙げています。

---

## 演習

```bash
npm run check ex06
```
