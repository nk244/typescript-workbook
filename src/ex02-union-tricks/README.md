# 外伝 第2章 ユニオンを自在に操る

判別可能なユニオン（第9章）を「作る・分解する・合成する」ための技集です。
Redux 系のコードや UI ライブラリの型定義は、ほぼこれでできています。

---

## 1. 対応表からユニオンを生成する

アクションを 1 つずつ手で書くのは冗長です。

```ts
type Action =
  | { type: 'add'; text: string }
  | { type: 'remove'; id: number }
  | { type: 'clear' };
```

**「対応表」を書いて、そこからユニオンを作る**ほうが保守しやすい。

```ts
type ActionMap = {
  add: { text: string };
  remove: { id: number };
  clear: object;
};

type ActionFrom<M> = {
  [K in keyof M]: { type: K } & M[K];
}[keyof M];

type Action = ActionFrom<ActionMap>;
// { type: 'add'; text: string } | { type: 'remove'; id: number } | { type: 'clear' }
```

読み方: **Mapped Type でオブジェクトを作り、`[keyof M]` で「全部の値」を取り出す。**
値をユニオンとして取り出すこの `[keyof T]` は、**型を「畳む」定番の手筋**です。

## 2. ユニオンから 1 つ取り出す

```ts
type AddAction = Extract<Action, { type: 'add' }>;   // { type: 'add'; text: string }
type Payload = Omit<AddAction, 'type'>;              // { text: string }
```

`Extract<T, U>` は「U に代入可能なメンバーだけ残す」（第10章）。
**判別子で絞り込む**この使い方が圧倒的に多いです。

これを使うと、型安全な action creator が書けます。

```ts
function createAction<K extends Action['type']>(
  type: K,
  ...args: Omit<Extract<Action, { type: K }>, 'type'> extends Record<string, never>
    ? []
    : [payload: Omit<Extract<Action, { type: K }>, 'type']>
): Extract<Action, { type: K }>;
```

（ここまで凝る必要はありませんが、**ライブラリの型はこう書かれている**と読めることが大事です）

## 3. Omit はユニオンを潰す — DistributiveOmit

これは知らないとハマります。

```ts
type A = { kind: 'a'; x: number } | { kind: 'b'; y: string };
type B = Omit<A, 'kind'>;
// 期待: { x: number } | { y: string }
// 実際: { }  ← ユニオン全体に一度だけ適用され、共通キーしか残らない
```

`Omit` は分配されません（`Exclude` と違い、`Omit` の実装は `Pick<T, Exclude<keyof T, K>>` で、
`keyof (A | B)` は共通キーだけになるため）。

分配させたければ、**条件型を挟んで自分で分配させます**。

```ts
type DistributiveOmit<T, K extends PropertyKey> =
  T extends unknown ? Omit<T, K> : never;

type C = DistributiveOmit<A, 'kind'>;   // { x: number } | { y: string }
```

`T extends unknown ?` は**何も絞り込まないが、分配だけを起こす**イディオムです（第12章）。
`Partial` や `Pick` でも同じ問題が起きます。**ユニオンにユーティリティ型をかけたら結果を確認する。**

## 4. UnionToIntersection — 有名な黒魔術

```ts
type UnionToIntersection<U> =
  (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;

type X = UnionToIntersection<{ a: 1 } | { b: 2 }>;   // { a: 1 } & { b: 2 }
```

仕組み:

1. `U extends unknown ? ... : never` でユニオンを分配し、**関数型のユニオン**を作る
   → `((arg: {a:1}) => void) | ((arg: {b:2}) => void)`
2. そこから `infer I` で引数型を推論させる
3. **関数の引数は反変**（第14章）なので、複数候補があると**交差型**として推論される

「引数は反変」という第14章の知識が、そのままテクニックになっています。
実務で書くことは稀ですが、**ライブラリの型定義に出てきたときに読める**必要があります。

## 5. 排他的な props（XOR）

「a か b のどちらか一方だけ」を型で表す方法です。

```ts
type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type Props = XOR<{ href: string }, { onClick: () => void }>;

const a: Props = { href: '/' };                          // OK
const b: Props = { onClick: () => {} };                  // OK
const c: Props = { href: '/', onClick: () => {} };       // エラー
```

ポイントは **`?: never`**（「あってはいけない」を表す）。
判別子（`kind`）を置けるなら第9章のやり方のほうが読みやすいですが、
**既存 API に判別子を足せないとき**にこれが効きます。

## 6. ユニオンの網羅を「値」でも保証する

```ts
type Status = 'idle' | 'loading' | 'done';

// キーの過不足がコンパイルエラーになる
const LABELS = {
  idle: '待機',
  loading: '読込',
  done: '完了',
} satisfies Record<Status, string>;
```

型注釈（`const LABELS: Record<Status, string>`）にすると、キーの網羅は検査できますが
**`LABELS.idle` の型が `string` になり、キーのタイプミスも検出できなくなります**。
`satisfies` なら「推論結果を保ったまま検査」なので、キーは `'idle' | 'loading' | 'done'` のままです。

ただし**値のリテラル型までは保たれません**。`satisfies` が与える文脈型が `string` なので、
`'待機'` は `string` に広がります。リテラルまで固定したいなら **`as const satisfies`** と重ねます。

```ts
const LABELS = { idle: '待機' /* ... */ } as const satisfies Record<Status, string>;
//    LABELS.idle は '待機'
```

**`as const satisfies` は覚えておく価値のある組み合わせ**です。
「値は固定、形は検査」を一度に書けます。

---

## 演習

```bash
npm run check ex02
```
