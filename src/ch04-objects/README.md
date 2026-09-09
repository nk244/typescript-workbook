# 第4章 オブジェクト型 / interface と type

## この章のゴール

- オブジェクト型の書き方（optional, readonly, index signature）を一通り使える
- `interface` と `type` を根拠をもって選べる
- 過剰プロパティチェックという「一見おかしな挙動」の理由を説明できる

---

## 1. オブジェクト型の基本

```ts
type User = {
  id: number;
  name: string;
  email?: string;        // オプショナル: string | undefined
  readonly createdAt: Date;  // 再代入禁止
};
```

- `?` は「あってもなくてもよい」。型は `string | undefined` になります。
- `readonly` は**コンパイル時だけ**の制約です。実行時には普通に書き換えられます（型は消えるので）。

## 2. interface と type — 何が違うのか

書けることはほぼ同じです。違いは次の 3 点。

| | `interface` | `type` |
| --- | --- | --- |
| 拡張 | `extends` | 交差型 `&` |
| 同名再宣言（宣言のマージ） | **できる** | できない（エラー） |
| オブジェクト以外を表せるか | できない | できる（ユニオン、タプル、関数、条件型…） |

```ts
interface Animal { name: string }
interface Animal { age: number }   // マージされて { name; age } になる

type A = { name: string };
type A = { age: number };          // エラー: 重複定義
```

### 選び方の指針

- **迷ったら `type`。** 表現力が広く、ユニオンに育てられます。
- **ライブラリの型を外から拡張したい**ときは `interface`（宣言のマージが使える）。第15章。
- チーム規約があるならそれに従う。ここは宗教戦争になりやすいので、**一貫していることのほうが重要**です。

## 3. 交差型（&）

```ts
type WithId = { id: number };
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type Entity = WithId & WithTimestamps;   // 3 つのプロパティを全部持つ
```

`&` は「両方の条件を満たす」＝集合の**積**です。ユニオン `|` が和であることと対になります。
プロパティが衝突すると `never` になることがあるので注意。

## 4. 過剰プロパティチェック（Excess Property Check）

これは初学者が必ずつまずくところです。

```ts
type Point = { x: number; y: number };

const p: Point = { x: 1, y: 2, z: 3 };
//                             ~~~~ エラー: z は Point に存在しない

const tmp = { x: 1, y: 2, z: 3 };
const q: Point = tmp;   // ← こっちはエラーにならない！
```

なぜか。TypeScript の型互換性は**構造的部分型**なので、「必要なものを持っていれば OK」が原則です。
`tmp` は `Point` の要求を満たしているので代入できます。

一方、**オブジェクトリテラルを直接代入するときだけ**、特別に厳しいチェックが入ります。
リテラルを直接書いているなら、余計なプロパティはほぼ確実にタイプミスか勘違いだからです。
つまりこれは型理論ではなく、**親切心で入っている実用的な例外**です。

## 5. インデックスシグネチャ

キーが決まっていないオブジェクトを表します。

```ts
type Scores = { [subject: string]: number };
const s: Scores = { math: 80, english: 90 };
s.history;   // 型は number ... でも実行時は undefined!
```

危険なのがこれ。**存在しないキーも `number` として通ってしまいます。**
このリポジトリでは `noUncheckedIndexedAccess: true` を有効にしているので、
`number | undefined` になり、使う前にチェックを強制されます。**強くおすすめの設定です。**

キーの候補が決まっているなら `Record` を使うほうが安全です（第10章）。

```ts
type Scores = Record<'math' | 'english', number>;   // この 2 キーだけ
```

## 6. ネストと再帰

型は再帰的に定義できます。JSON のような構造も表現できます。

```ts
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
```

---

## 演習

```bash
npm run check 04
```
