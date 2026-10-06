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

**仕組み（一言で）:** `keyof` は型から「キーの一覧」を取り出し、`T[K]` は「そのキーに対応する値の型」を取り出す。
**目的・用途:** 次の節の Mapped Types は、この 2 つを部品にして「キーを 1 つずつ回して、値の型を引く」型を作る。

配列にも使えます。

```ts
type Names = string[];
type Name = Names[number];     // string
const TUPLE = ['a', 'b'] as const;
type Item = (typeof TUPLE)[number];   // 'a' | 'b'   ← 第5章で使ったやつ
```

## 2. Mapped Types の基本形

**仕組み（一言で）:** 型を受け取り、そのキーを 1 つずつ取り出して、キーごとにプロパティを作り直し、**新しい型**を返す。
型の世界の「繰り返し（`for...in`）」と「関数」を合わせたものです。

**目的・用途:** 既存の型を元に、「全部オプショナルにした型」「全部 readonly にした型」のような**派生した型**を、
書き写さずに作る。元の型を変えると、派生した型も自動で追随します。

**`Partial<T>` とは:** `T` の全プロパティを「オプショナル（`?`）にした型」を作る型です（第10章）。
キーも値の型もそのままで、全部に `?` が付きます。更新用の入力（「変えたい項目だけ書けばよい」）に使います。

```ts
type User = { id: number; name: string };
type R = Partial<User>;   // { id?: number; name?: string }
```

この節の `MyPartial` は、この `Partial` を自分で作ったものです。

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

読み方: 「T のキー K それぞれについて、`T[K]` 型のオプショナルなプロパティを作る」。
`for...in` の型版だと思ってください。

### 具体例: `MyPartial<User>` は何になるか

上の定義に、次の型を渡します。

```ts
type User = { id: number; name: string };
type R = MyPartial<User>;
```

定義の中身 `[K in keyof T]?: T[K]` に出てくる文字を、順に置き換えていくと `R` が分かります。

**① `T` を `User` に置き換える**

```ts
{ [K in keyof User]?: User[K] }
```

**② `keyof User` を `'id' | 'name'` に置き換える**

```ts
{ [K in 'id' | 'name']?: User[K] }
```

**③ `K` に `'id'` と `'name'` を 1 つずつ入れて、プロパティを 1 行ずつ作る**

`[K in ...]` が「繰り返し」です。`K` が `'id'` のときの 1 行と、`'name'` のときの 1 行ができます。

```ts
{
  id?:   User['id'];     // K = 'id'  のとき
  name?: User['name'];   // K = 'name' のとき
}
```

**④ `User['id']` は `number`、`User['name']` は `string` なので**

```ts
{ id?: number; name?: string }     // これが R
```

定義にあった `?`（オプショナル）は、③でも④でも、各プロパティに付いたままです。

### `MyPartial` は「型の関数」

```ts
function double(x) { return x * 2; }   // 関数の定義
const y = double(5);                   // 5 を渡して、10 という新しい値を得る
```

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };   // 型の「関数」の定義
type R = MyPartial<User>;                        // User を渡して、新しい型を得る
```

`R` は `User` を元に作られた**別の新しい型**で、`User` 自体は変わりません。
`R` は値（連想配列）ではなく、`{ id?: number; name?: string }` という**形を表す型**です。

### 出発点は「そのままコピー」

`?` も `readonly` も付けずに書くと、元と同じ内容の型ができます。

```ts
type Same<T> = { [K in keyof T]: T[K] };
type R2 = Same<User>;     // { id: number; name: string }   ← User と中身が同じ
```

| 定義 | 結果 |
|---|---|
| `[K in keyof T]: T[K]` | 元と同じ（コピー） |
| `[K in keyof T]?: T[K]` | 全部に `?` が付く（`MyPartial`） |
| `readonly [K in keyof T]: T[K]` | 全部に `readonly` が付く（`MyReadonly`） |

自分で作る Mapped Types は、この「コピー」を出発点にして、変えたい部分だけを書き換えるものです。

これだけで `Partial` / `Required` / `Readonly` / `Pick` / `Record` は全部自作できます。

```ts
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```

それぞれ、`MyPartial` と同じ置き換えで結果が分かります。

**`MyReadonly<User>`**（`User` は上と同じ）

```ts
{ readonly [K in keyof T]: T[K] }                 // 定義
{ readonly [K in keyof User]: User[K] }           // ① T を User に
{ readonly [K in 'id' | 'name']: User[K] }        // ② keyof User を展開
{ readonly id: User['id']; readonly name: User['name'] }   // ③ K を 1 つずつ入れる
{ readonly id: number; readonly name: string }    // ④ User['id'] などを具体的な型に
```

**`MyPick<User, 'id'>`**

```ts
{ [P in K]: T[P] }                  // 定義
{ [P in 'id']: User[P] }            // ① T を User に、K を 'id' に
{ id: User['id'] }                  // ② P に 'id' を入れる（繰り返しは 1 回だけ）
{ id: number }                      // ③ User['id'] を number に
```

**`MyRecord<'a' | 'b', number>`**

```ts
{ [P in K]: V }                     // 定義
{ [P in 'a' | 'b']: number }        // ① K を 'a' | 'b' に、V を number に
{ a: number; b: number }            // ② P に 'a'、'b' を 1 つずつ入れる
```

`MyPick` と `MyRecord` は `[P in keyof T]` ではなく `[P in K]` と書いています。
「元の型のキー全部」ではなく「**渡したキーだけ**」を繰り返すので、結果が変わります。

### 回すキーを絞る・除く（Exclude）

`[P in ...]` の `...` には、**キーのユニオンなら何でも**書けます。`keyof T` でも、`'id'` でも、
「`keyof T` から一部を除いたもの」でも構いません。除くには、第10章の `Exclude` を使います。

**`Exclude<A, B>` とは:** ユニオン `A` から、`B` に当てはまるメンバーを取り除いたユニオンを作る型です。

```ts
type R1 = Exclude<'a' | 'b' | 'c', 'a'>;         // 'b' | 'c'
type R2 = Exclude<'id' | 'name' | 'email', 'id'>; // 'name' | 'email'
```

**使い方の例:** 「`id` を除いた型」を作る `WithoutId` です。

```ts
type WithoutId<T> = { [P in Exclude<keyof T, 'id'>]: T[P] };

type User = { id: number; name: string; email: string };
type R = WithoutId<User>;
```

これまでと同じように、置き換えて読みます。

```ts
{ [P in Exclude<keyof T, 'id'>]: T[P] }                    // 定義
{ [P in Exclude<keyof User, 'id'>]: User[P] }              // ① T を User に
{ [P in Exclude<'id' | 'name' | 'email', 'id'>]: User[P] } // ② keyof User を展開
{ [P in 'name' | 'email']: User[P] }                       // ③ Exclude で 'id' を取り除く
{ name: User['name']; email: User['email'] }               // ④ P に 'name'、'email' を 1 つずつ入れる
{ name: string; email: string }                            // ⑤ これが R
```

`MyPick` と違って「除くキー（ここでは `'id'`）」を渡す形です。`'id'` を型引数 `K` に変えれば、
どのキーでも除ける汎用の型になります。

## 3. 修飾子を足す / 外す

`readonly` と `?` は `+` / `-` で操作できます。

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // readonly を外す
type Concrete<T> = { [K in keyof T]-?: T[K] };          // ? を外す（= Required）
```

`-?` は「オプショナルを外す」。地味ですが、`Required` の実装そのものです。

§2 と同じ置き換えで、結果を求めてみます。

**`Mutable<Locked>`**

```ts
type Locked = { readonly id: number; readonly name: string };
type A = Mutable<Locked>;
```

```ts
{ -readonly [K in keyof T]: T[K] }                    // 定義
{ -readonly [K in keyof Locked]: Locked[K] }          // ① T を Locked に
{ -readonly [K in 'id' | 'name']: Locked[K] }         // ② keyof Locked を展開
{ -readonly id: Locked['id']; -readonly name: Locked['name'] }   // ③ K を 1 つずつ入れる
{ id: number; name: string }                          // ④ 型を具体的にして、-readonly で readonly を外す
```

`keyof T` で繰り返すと、元の `readonly` は引き継がれます。`-readonly` は、それを打ち消す指定です。

**`Concrete<Loose>`**

```ts
type Loose = { id?: number; name?: string };
type B = Concrete<Loose>;
```

```ts
{ [K in keyof T]-?: T[K] }                            // 定義
{ [K in keyof Loose]-?: Loose[K] }                    // ① T を Loose に
{ [K in 'id' | 'name']-?: Loose[K] }                  // ② keyof Loose を展開
{ id-?: Loose['id']; name-?: Loose['name'] }          // ③ K を 1 つずつ入れる（-? は「? を外す」指定）
{ id: number; name: string }                          // ④ 型を具体的にして、? を外す
```

`Loose['id']` は本来 `number | undefined` ですが、`-?` を付けると `undefined` も取り除かれて `number` になります。

どちらも、`T[K]` の部分はそのままで、`readonly` や `?` という「飾り」だけが変わります。

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

**目的・用途:** 元の型からキー名を作り変えた型を作る（getter の一覧、イベントハンドラの一覧など）。

`Getters<User>` を、§2 と同じ置き換えで読みます。

```ts
{ [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }                // 定義
{ [K in keyof User as `get${Capitalize<string & K>}`]: () => User[K] }          // ① T を User に
{ [K in 'name' | 'age' as `get${Capitalize<string & K>}`]: () => User[K] }      // ② keyof User を展開

// ③ K に 'name' と 'age' を 1 つずつ入れる（キー名は as の式で作り変わる）
{
  getName: () => User['name'];   // K = 'name'：`get${Capitalize<'name'>}` = 'getName'
  getAge:  () => User['age'];    // K = 'age' ：`get${Capitalize<'age'>}`  = 'getAge'
}

{ getName: () => string; getAge: () => number }                                  // ④ User['name'] などを具体的な型に
```

`` `get${Capitalize<string & K>}` `` は、3 つの部品でできています。

| 部品 | 意味 | 例 |
|---|---|---|
| `` `get${...}` `` | 文字列を組み立てる型（テンプレートリテラル型）。`${...}` の中が入る | `` `get${'Name'}` `` は `'getName'` |
| `Capitalize<...>` | 文字列の先頭を大文字にする組み込みの型（第10章） | `Capitalize<'name'>` は `'Name'` |
| `string & K` | `K` を「文字列」として扱うための書き方 | `string & 'name'` は `'name'` |

`string & K` が必要な理由は、`K` が `keyof T` から来るので、型としては `string | number | symbol` のどれかの
可能性があるためです。`Capitalize` は文字列しか受け取れません。`string & K` は「文字列でもあり、`K` でもある」
という型で、`K` が文字列ならそのまま `K`、数値や symbol なら `never`（消える）になります。

`K = 'name'` のとき、内側から順に置き換えると次のとおりです。

```ts
`get${Capitalize<string & K>}`
`get${Capitalize<string & 'name'>}`   // K を 'name' に
`get${Capitalize<'name'>}`            // string & 'name' = 'name'
`get${'Name'}`                        // Capitalize<'name'> = 'Name'
'getName'                             // 文字列を組み立てる
```

`Capitalize`（先頭だけ大文字）の代わりに、`Uppercase`（全部大文字）も使えます。`Uppercase<'name'>` は `'NAME'` です。

### 条件型の最小限 — `A extends B ? X : Y`

次の「キーを除外する」で使う `? :` は、**条件型**です（体系的には第12章）。ここでは書き方だけ押さえます。

```ts
A extends B ? X : Y
```

「`A` が `B` に代入できるなら `X`、できなければ `Y`」という意味です。値の世界の `if` の型版です。

```ts
type R1 = 42 extends number ? 'はい' : 'いいえ';      // 'はい'   （42 は number に代入できる）
type R2 = 'a' extends number ? 'はい' : 'いいえ';     // 'いいえ' （'a' は number に代入できない）
type R3 = number extends number ? 'はい' : 'いいえ';  // 'はい'
```

### キーを除外する

`as` の結果を `never` にすると、そのキーは消えます。

`T[K] extends V ? never : K` は、上の条件型です。「`T[K]` が `V` に代入できるなら `never`（そのキーを消す）、
そうでなければ `K`（キー名をそのまま残す）」と読みます。

```ts
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

type User = { id: number; name: string; deleted: boolean };
type WithoutBooleans = OmitByValue<User, boolean>;   // { id: number; name: string }
```

`OmitByValue<User, boolean>` を置き換えて読むと、どのキーが消えるかが分かります。

```ts
{ [K in keyof T as T[K] extends V ? never : K]: T[K] }          // 定義
// T = User、V = boolean、keyof User = 'id' | 'name' | 'deleted'

// K に 1 つずつ入れて、as の中の条件を決める
// K = 'id'      : User['id']      = number  → number  extends boolean? いいえ → キーは 'id' のまま残る
// K = 'name'    : User['name']    = string  → string  extends boolean? いいえ → キーは 'name' のまま残る
// K = 'deleted' : User['deleted'] = boolean → boolean extends boolean? はい   → キーが never になって消える

{ id: number; name: string }                                    // 結果
```

**「never になったキーは消える」** は Mapped Types の重要な性質です。

条件の「はい」側と「いいえ」側を入れ替えると、逆の型になります（残るキーと消えるキーが入れ替わる）。
この逆の型は、演習 11-7 で自分で書きます。

## 5. 使いどころの実例

### (a) フォームの状態

「各フィールドの表示名」を持つ型です。

```ts
type Labels<T> = {
  [K in keyof T]: string;
};

type LoginForm = { email: string; password: string };
type LoginLabels = Labels<LoginForm>;   // { email: string; password: string }
```

フィールドが増えたら、表示名の型も自動で追随します。値の型は元の `T[K]` ではなく、常に `string` です。

```ts
{ [K in keyof T]: string }                                    // 定義
{ [K in 'email' | 'password']: string }                       // T = LoginForm、keyof LoginForm を展開
{ email: string; password: string }                           // K を 1 つずつ入れる
```

演習 11-9 の「エラーメッセージの型」は、この `Labels` を少し変えたものです（「あるものだけ書けばよい」にする）。

### (b) イベントハンドラの一覧

```ts
type Handlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]?: (value: T[K]) => void;
};
// { onEmailChange?: (value: string) => void; onPasswordChange?: ... }
```

`Handlers<LoginForm>` を置き換えて読みます。

```ts
{ [K in keyof T as `on${Capitalize<string & K>}Change`]?: (value: T[K]) => void }   // 定義
// T = LoginForm、keyof LoginForm = 'email' | 'password'
{
  onEmailChange?:    (value: LoginForm['email'])    => void;   // K = 'email'   → キー名は 'onEmailChange'
  onPasswordChange?: (value: LoginForm['password']) => void;   // K = 'password' → キー名は 'onPasswordChange'
}
{ onEmailChange?: (value: string) => void; onPasswordChange?: (value: string) => void }   // 具体的な型に
```

### (c) 入れ子の中まで「省略可能」にする（再帰）

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

`T[K] extends object ? ... : ...` は、§4 で説明した条件型です。「`T[K]` がオブジェクトなら、中身にも
`DeepPartial` をかけ（自分自身を呼ぶ＝再帰）、そうでなければそのまま」という意味です。
普通の `Partial<T>` は、入れ子の中までは `?` を付けません。

§2 と同じ置き換えで、結果を求めてみます。

```ts
type Config = { host: string; db: { port: number; user: string } };
type R = DeepPartial<Config>;
```

**① `T` を `Config` に置き換える**

```ts
{
  [K in keyof Config]?:
    Config[K] extends object ? DeepPartial<Config[K]> : Config[K]
}
```

**② `keyof Config` を `'host' | 'db'` に置き換える**

```ts
{
  [K in 'host' | 'db']?:
    Config[K] extends object ? DeepPartial<Config[K]> : Config[K]
}
```

**③ `K` に `'host'` と `'db'` を 1 つずつ入れて、プロパティを 1 行ずつ作る**

```ts
{
  host?: Config['host'] extends object ? DeepPartial<Config['host']> : Config['host'];
  db?:   Config['db']   extends object ? DeepPartial<Config['db']>   : Config['db'];
}
```

**④ `Config['host']` は `string`、`Config['db']` は `{ port: number; user: string }` なので、`? :` を決める**

- `string extends object` は成り立たないので、`host` は `Config['host']` のまま、つまり `string`
- `{ port: number; user: string } extends object` は成り立つので、`db` は `DeepPartial<{ port: number; user: string }>`

```ts
{
  host?: string;
  db?: DeepPartial<{ port: number; user: string }>;
}
```

**⑤ `db` の中の `DeepPartial<...>` にも、①〜④と同じ置き換えをする**

```ts
{
  host?: string;
  db?: { port?: number; user?: string };   // これが R
}
```

演習 11-8 の「入れ子の中まで readonly にする型」は、この `DeepPartial` の `?` を別のものに変えたものです。

## 6. 注意: 分配と情報の消失

Mapped Type をユニオンに適用すると、**ユニオンのまま各メンバーに適用される**（同型のとき）か、
**1 つのオブジェクト型に潰れる**か、書き方で変わります。

```ts
type A = { kind: 'a'; x: number } | { kind: 'b'; y: string };
type P1 = Partial<A>;                     // ユニオンのまま各要素に適用される
type P2 = { [K in keyof A]?: A[K] };      // keyof A は 'kind' だけ（共通キーのみ）→ 情報が落ちる
```

それぞれの結果は次のとおりです。

```ts
type P1 = Partial<A>;
// 型引数 T に渡されたユニオンは、各メンバーに分けて適用される
// { kind?: 'a'; x?: number } | { kind?: 'b'; y?: string }

type P2 = { [K in keyof A]?: A[K] };
// keyof A は、ユニオンの共通キーの 'kind' だけ。A['kind'] は 'a' | 'b'
// { kind?: 'a' | 'b' }          ← x と y が消えた
```

`P1` は型引数 `T` を介して適用しているので、ユニオンが分けて渡されます。`P2` は `A` を直接使っているので、分かれません。

**判別可能なユニオンに Mapped Type をかけるときは、結果を必ず確認してください。**

---

## 演習

```bash
npm run check 11
```
