# 外伝 第4章 型で状態機械を作る — ファントム型とビルダー

「**間違った順番で呼べない API**」を型で作ります。
ドキュメントに「必ず connect してから send してください」と書く代わりに、
**コンパイラに守らせる**という発想です。

---

## 1. ファントム型（Phantom Type）

実行時には存在しない情報を、型引数だけに持たせる技法です。

```ts
type State = 'open' | 'closed';

type Connection<S extends State> = {
  readonly id: string;
  readonly state: S;
};

declare function connect(): Connection<'open'>;
declare function send(conn: Connection<'open'>, message: string): void;
declare function close(conn: Connection<'open'>): Connection<'closed'>;

const c1 = connect();
send(c1, 'hi');            // OK
const c2 = close(c1);
send(c2, 'hi');            // エラー: Connection<'closed'> は渡せない
```

**状態遷移が型で表現されている**ので、閉じた接続に送る、というバグが書けません。
`S` は実行時には使われていない（＝ファントム）けれど、型検査には効いています。

### `this` パラメータでメソッドに条件を付ける

クラスなら `this` の型を指定して同じことができます。

```ts
class Connection<S extends State = 'closed'> {
  send(this: Connection<'open'>, message: string): void {}
  open(this: Connection<'closed'>): Connection<'open'> {}
}
```

`this` パラメータは**コンパイル時だけの宣言**で、実行時の引数ではありません（第6章）。

## 2. ビルダー — 設定済みのキーを型に溜める

```ts
type Keys = 'table' | 'where' | 'limit';

class QueryBuilder<Set extends Keys = never> {
  set<K extends Keys>(key: K, value: string): QueryBuilder<Set | K> { /* ... */ }

  // 'table' が Set に含まれていなければ this が never になり、呼び出せない
  build(this: 'table' extends Set ? QueryBuilder<Set> : never): string { /* ... */ }
}

new QueryBuilder().set('table', 'users').build();   // OK
new QueryBuilder().set('limit', '10').build();      // エラー
```

**ポイントは `this` を条件型にすること。** 条件を満たさないと `this` が `never` になり、
「そのメソッドは存在するが呼べない」状態を作れます。

「必須項目が全部埋まったときだけ `build()` を許す」を型で表現できる、というのが
このパターンの価値です。フォームビルダー、SQL ビルダー、DI コンテナでよく見ます。

## 3. polymorphic this — 継承してもチェーンが切れない

```ts
class Query {
  where(cond: string): this {   // ← this 型
    return this;
  }
}

class AdminQuery extends Query {
  onlyAdmins(): this { return this; }
}

new AdminQuery().where('x').onlyAdmins();   // OK。where が this を返すので型が保たれる
```

戻り値を `Query` にすると、`where()` のあとに `onlyAdmins()` が呼べなくなります。
**`this` 型は「実際に呼ばれたクラス」を指す**ので、継承してもチェーンが壊れません。

## 4. アサーションメソッド（asserts this is）

```ts
class Box<T> {
  value: T | undefined;

  assertLoaded(): asserts this is { value: T } {
    if (this.value === undefined) throw new Error('未ロード');
  }
}

const box: Box<string> = new Box();
box.assertLoaded();
box.value.toUpperCase();   // ここから下では value が string に確定
```

**注意（有名な落とし穴）:** アサーション関数を呼ぶ変数は、
**明示的な型注釈が必要**です。`const box = new Box<string>()` のように推論に任せると
「アサーションは明示的に型付けされた識別子にしか使えない」というエラーになります。

## 5. unique symbol でブランドを付ける

第14章のブランド型は文字列プロパティを使いましたが、`unique symbol` を使うとより堅牢です。

```ts
declare const meters: unique symbol;
type Meters = number & { readonly [meters]: true };

const distance = 100 as Meters;
const bad: Meters = 100;   // エラー
```

利点:

- **プロパティ名が衝突しない**（`__brand` を別のライブラリも使っているかもしれない）
- 補完候補に現れない（symbol なので）

`declare const x: unique symbol` は「実行時には存在しないが、唯一の symbol 型として扱う」宣言です。

## 6. どこまでやるか

これらは**「使う人が多い API」ほど価値が上がる**技法です。

- チーム全員が使う社内ライブラリ → やる価値が高い
- 自分しか使わないユーティリティ → たいてい過剰

型が複雑になるほどエラーメッセージは読みにくくなります。
**「間違えたときに出るエラーが親切か」を必ず確かめてから採用してください。**

---

## 演習

```bash
npm run check ex04
```
