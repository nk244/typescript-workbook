# 第11章 keyof と Mapped Types

ここからが「型プログラミング」の入口です。第10章のユーティリティ型を**自分で作れる**ようになります。

---

## 1. keyof と インデックスアクセス型

```ts
type User = { id: number; name: string };

type Keys = keyof User;        // 'id' | 'name'
type IdType = User['id'];      // number
type Values = User[keyof User];// number | string
```

- `keyof T`: キーのユニオン
- `T[K]`: K に対応する値の型（**インデックスアクセス型**）

配列にも使えます。

```ts
type Names = string[];
type Name = Names[number];     // string
const TUPLE = ['a', 'b'] as const;
type Item = (typeof TUPLE)[number];   // 'a' | 'b'   ← 第5章で使ったやつ
```

## 2. Mapped Types の基本形

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

読み方: 「T のキー K それぞれについて、`T[K]` 型のオプショナルなプロパティを作る」。
`for...in` の型版だと思ってください。

これだけで `Partial` / `Required` / `Readonly` / `Pick` / `Record` は全部自作できます。

```ts
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```

## 3. 修飾子を足す / 外す

`readonly` と `?` は `+` / `-` で操作できます。

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // readonly を外す
type Concrete<T> = { [K in keyof T]-?: T[K] };          // ? を外す（= Required）
```

`-?` は「オプショナルを外す」。地味ですが、`Required` の実装そのものです。

## 4. キーを作り変える — `as` 句（key remapping）

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

`as` でキー名を変換できます。ここに**テンプレートリテラル型**（第13章）が絡むと非常に強力です。

### キーを除外する

`as` の結果を `never` にすると、そのキーは消えます。

`T[K] extends V ? never : K` の `? :` は「条件型」です（体系的には第12章）。
ここでは「`T[K]` が `V` に代入できるならそのキーを消す（`never`）、そうでなければ
キー名をそのまま残す」とだけ読めれば十分です。

```ts
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

type User = { id: number; name: string; deleted: boolean };
type WithoutBooleans = OmitByValue<User, boolean>;   // { id: number; name: string }
```

**「never になったキーは消える」** は Mapped Types の重要な性質です。

## 5. 使いどころの実例

### (a) フォームの状態

```ts
type FormErrors<T> = {
  [K in keyof T]?: string;
};

type LoginForm = { email: string; password: string };
type LoginErrors = FormErrors<LoginForm>;   // { email?: string; password?: string }
```

フィールドが増えたら、エラーの型も自動で追随します。

### (b) イベントハンドラの一覧

```ts
type Handlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]?: (value: T[K]) => void;
};
// { onEmailChange?: (value: string) => void; onPasswordChange?: ... }
```

### (c) API レスポンスを readonly に固定

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

ここでも `extends ? :`（条件型、第12章）を使っています。「`T[K]` がオブジェクトなら
再帰的に `DeepReadonly` をかけ、そうでなければそのまま」という意味です。
再帰も書けます（演習でやります）。

## 6. 注意: 分配と情報の消失

Mapped Type をユニオンに適用すると、**ユニオンのまま各メンバーに適用される**（同型のとき）か、
**1 つのオブジェクト型に潰れる**か、書き方で変わります。

```ts
type A = { kind: 'a'; x: number } | { kind: 'b'; y: string };
type P1 = Partial<A>;                     // ユニオンのまま各要素に適用される
type P2 = { [K in keyof A]?: A[K] };      // keyof A は 'kind' だけ（共通キーのみ）→ 情報が落ちる
```

**判別可能なユニオンに Mapped Type をかけるときは、結果を必ず確認してください。**

---

## 演習

```bash
npm run check 11
```
