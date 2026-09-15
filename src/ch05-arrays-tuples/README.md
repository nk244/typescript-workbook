# 第5章 配列・タプル・as const・enum

## この章のゴール

- 配列とタプルの違いを理解し、使い分けられる
- `as const` が何をしているのかを説明できる
- `enum` を使うべきか避けるべきかを自分で判断できる

---

## 1. 配列

```ts
const nums: number[] = [1, 2, 3];
const nums2: Array<number> = [1, 2, 3];   // 同じ意味
const mixed: (string | number)[] = [1, 'a'];
```

`number[]` と `Array<number>` は完全に同じです。好みで統一してください。

### readonly 配列

```ts
const xs: readonly number[] = [1, 2, 3];
xs.push(4);        // エラー: push は存在しない
const ys = [...xs, 4];   // 新しい配列を作るのは OK
```

**引数は基本 `readonly` にする**と、関数が引数を破壊しないことが型で保証されます。
`ReadonlyArray<number>` とも書けます。

### noUncheckedIndexedAccess

このリポジトリでは有効にしてあります。

```ts
const xs = [1, 2, 3];
const first = xs[0];      // number | undefined
first.toFixed();          // エラー: undefined かもしれない
```

面倒に感じますが、これは正しい。`xs[10]` は実際に `undefined` です。
`at()` や分割代入、`for...of` を使えば自然に書けます。

```ts
for (const x of xs) { x.toFixed(); }   // OK: 要素は必ず存在する
```

`??`（nullish 合体演算子、第2章）と組み合わせると、「`undefined` のときだけ
フォールバック値を使う」という書き方が自然にできます。

```ts
const first = xs[0] ?? -1;   // xs が空なら -1
```

## 2. タプル

**長さと各位置の型が決まった配列**です。

```ts
type Point = [number, number];
type Entry = [key: string, value: number];       // ラベル付き（可読性のためだけ）
type Result = [ok: boolean, ...errors: string[]]; // 可変長部分も書ける
type Optional = [number, number?];                // 省略可能な要素
```

React の `useState` が `[value, setValue]` を返せるのはタプルのおかげです（第20章）。

```ts
const [count, setCount] = useState(0);   // count: number, setCount: (n: number) => void
```

## 3. as const — リテラル型への固定

これは TypeScript でもっとも便利な 2 語です。

```ts
const a = [1, 2, 3];              // number[]
const b = [1, 2, 3] as const;     // readonly [1, 2, 3]

const c = { role: 'admin' };            // { role: string }
const d = { role: 'admin' } as const;   // { readonly role: 'admin' }
```

`as const` は「この値はこれ以上広げず、書き換えもしない」という宣言です。効果は 2 つ。

1. リテラル型に固定される（`string` ではなく `'admin'`）
2. すべて `readonly` になる

### 定番パターン: 定数から型を作る

```ts
export const STATUSES = ['idle', 'loading', 'success'] as const;
export type Status = (typeof STATUSES)[number];
//   => 'idle' | 'loading' | 'success'
```

**値の定義が 1 か所にあり、型はそこから自動で導かれる。** 選択肢が増えたときに
型を直し忘れる事故が起きません。この形は実務で非常によく使います。

`typeof` は「値の世界から型の世界へ」渡す橋です。`[number]` は予約語ではなく、
「配列の要素すべての型を取り出す」ためのインデックスアクセス型という構文です
（体系的には第11章で扱います）。感覚は値の世界の添字アクセスと同じです。

```ts
const arr = ['a', 'b'];
const one = arr[0];        // 値の世界: 要素そのものを取り出す → 'a'

type Arr = typeof arr;
type Elem = Arr[number];   // 型の世界: あり得る要素の型を取り出す → string
```

### 実行時にも使う（型ガード）

`as const` で作った配列は、実行時のチェックにもそのまま使えます。

```ts
function isStatus(value: string): value is Status {
  return STATUSES.includes(value as Status);
}
```

`includes` は `Status` 型の引数しか受け付けないため、`string` 型の `value` を
一時的に `Status` として扱わせる `as`（型アサーション、第3章）が必要です。
戻り値の `value is Status` は「型述語」です（詳しくは第9章）。`true` を返したとき、
呼び出し側で `value` の型が `Status` に絞り込まれます。

## 4. enum を使うべきか

TypeScript には `enum` がありますが、**新規コードでは避けるのが主流**です。

```ts
enum Color { Red, Green }      // 数値 enum
enum Size { S = 's', M = 'm' } // 文字列 enum
```

避ける理由:

- **型を消せない。** enum は実行時にオブジェクトを生成するので、「型は消える」という原則から外れます
  （`isolatedModules` や一部のビルド環境で扱いづらい）。
- **数値 enum は型安全でない。** `Color` に任意の数値が入ってしまう歴史的な穴があります。
- ユニオン型 + `as const` でほぼ同じことが、より単純にできる。

代替:

```ts
export const Color = { Red: 'red', Green: 'green' } as const;
export type Color = (typeof Color)[keyof typeof Color];   // 'red' | 'green'
```

`keyof typeof Color` は「オブジェクトのキーのユニオン型」を取り出す構文です
（`'Red' | 'Green'`。体系的には第11章、第8章でも先出しします）。配列の `[number]` が
「要素の型」を取り出すのに対して、`keyof` は「キーの型」を取り出す、いわば“オブジェクト版”です。
`(typeof Color)[keyof typeof Color]` は「そのキーで引いたときの値の型」＝ユニオン型になります。

既存コードに enum があるなら無理に消す必要はありません。**新しく書くならユニオン型**、が指針です。

---

## 演習

```bash
npm run check 05
```
