# 第14章 構造的部分型・変性・satisfies

「なぜこれが代入できて、あれができないのか」を最後まで説明できるようにする章です。

---

## 1. 構造的部分型（Structural Typing）

TypeScript は**名前ではなく形**で型の互換性を判定します。

```ts
type Point = { x: number; y: number };
type Vector = { x: number; y: number };

const p: Point = { x: 1, y: 2 };
const v: Vector = p;   // OK: 名前が違っても形が同じ
```

Java / C# の**名前的部分型（nominal typing）**とは正反対です。
「アヒルのように歩き、アヒルのように鳴くならアヒル」。

### 名前的にしたいとき — ブランド型

「ユーザー ID と 商品 ID を取り違えたくない」ときは、実体のないタグを混ぜます。

```ts
type UserId = string & { readonly __brand: 'UserId' };
type PostId = string & { readonly __brand: 'PostId' };

function asUserId(raw: string): UserId {
  return raw as UserId;   // 変換は 1 か所に閉じ込める
}

function getUser(id: UserId) {}
getUser(asUserId('u1'));      // OK
getUser('u1');                // エラー: ただの string は渡せない
```

`__brand` は実行時には存在しません（型の上だけの目印）。
**ID・メールアドレス・検証済みの文字列**などに効きます。

## 2. 変性（Variance）

`Dog extends Animal` のとき、`Dog[]` と `Animal[]` の関係はどうなるか、という話です。

| 用語 | 意味 | 例 |
| --- | --- | --- |
| 共変（covariant） | `Dog` → `Animal` と同じ向き | `Dog[]` は `Animal[]` に代入できる |
| 反変（contravariant） | 逆向き | `(a: Animal) => void` は `(d: Dog) => void` に代入できる |
| 不変（invariant） | どちらも不可 | 可変な参照など |

### 関数の引数は反変

```ts
type AnimalHandler = (a: Animal) => void;
type DogHandler = (d: Dog) => void;

const handleAnimal: AnimalHandler = (a) => {};
const h: DogHandler = handleAnimal;   // OK: Animal を扱えるなら Dog も扱える
const h2: AnimalHandler = ((d: Dog) => {}) as DogHandler;  // エラー（strictFunctionTypes）
```

直感的には「**受け取る側は、より広いものを受け取れるほうが安全**」。
Dog しか扱えない関数に Animal が渡ってくると壊れるからです。

### 配列は共変（＝実は穴がある）

```ts
const dogs: Dog[] = [new Dog()];
const animals: Animal[] = dogs;   // OK
animals.push(new Cat());          // 型は通るが、dogs に Cat が入ってしまう！
```

TypeScript は利便性のためにこれを許しています（Java も同じ穴を持っています）。
**`readonly` 配列を使えばこの穴は塞げます。** 引数はできるだけ `readonly T[]` に。

### メソッドは双変（bivariant）

```ts
interface Handler {
  handle(value: Dog): void;      // メソッド記法 → 双変（緩い）
  handle2: (value: Dog) => void; // プロパティ記法 → 反変（厳密）
}
```

歴史的経緯で、**メソッド記法だけ緩いまま**です（`strictFunctionTypes` の対象外）。
厳密にしたければプロパティ記法で書いてください。

## 3. satisfies 演算子

TypeScript 4.9 で入った、**型注釈と型推論の「いいとこ取り」**をする演算子です。

問題: 型注釈をつけると、推論された細かい情報が失われます。

```ts
const config: Record<string, string> = { host: 'localhost', port: '8080' };
config.hots;   // エラーにならない（string キーなら何でも OK）
```

かといって注釈をやめると、今度は制約がかかりません。

```ts
const config = { host: 'localhost', port: 8080 };   // port が number でも気づけない
```

`satisfies` は「**この型を満たすことは検査するが、推論結果は保ったまま**」という指示です。

```ts
const config = {
  host: 'localhost',
  port: '8080',
} satisfies Record<string, string>;

config.host;   // string（リテラル型 'localhost' として推論される）
config.hots;   // エラー: そんなキーはない
```

### 実務での定番

```ts
const ROUTES = {
  home: '/',
  user: '/users/:id',
} satisfies Record<string, `/${string}`>;

type RouteName = keyof typeof ROUTES;   // 'home' | 'user' ← キーが具体的に取れる
```

**「値の一覧を書いて、そこから型を導く」パターンと相性が最高です。**
`as const satisfies X` と組み合わせるとさらに強力です。

## 4. as と satisfies と 型注釈 の使い分け

| 書き方 | 検査 | 推論への影響 | いつ使う |
| --- | --- | --- | --- |
| `const x: T = ...` | する | T に広がる | 型を固定したいとき |
| `... satisfies T` | する | 保たれる | 制約はかけたいが具体的な型も欲しいとき |
| `... as T` | **しない** | T になる | コンパイラより自分が正しいと確信できるとき |

**迷ったら `satisfies`。`as` は最後の手段。**

---

## 演習

```bash
npm run check 14
```
