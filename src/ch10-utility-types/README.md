# 第10章 組み込みユーティリティ型

TypeScript には、既存の型から新しい型を作る道具が標準で入っています。
この章では「よく使うもの」を、**使いどころ付き**で押さえます。

---

## 1. オブジェクトを加工する

```ts
type User = { id: number; name: string; email: string };
```

| 型 | 結果 | 使いどころ |
| --- | --- | --- |
| `Partial<User>` | 全部オプショナル | 更新用の入力（PATCH） |
| `Required<User>` | 全部必須 | 既定値適用後の内部表現 |
| `Readonly<User>` | 全部 readonly | 不変データ |
| `Pick<User, 'id' \| 'name'>` | 選んだキーだけ | 一覧表示用の絞った型 |
| `Omit<User, 'id'>` | 除いた残り | 作成時の入力（id はサーバが振る） |

```ts
type CreateUserInput = Omit<User, 'id'>;
type UpdateUserInput = Partial<Omit<User, 'id'>>;
```

この 2 行は実務で無限に出てきます。**元の型を 1 つ書けば、派生する型は導ける。**
`User` に項目が増えたとき、入力型も自動で追随します。

### Omit の落とし穴

`Omit` はキー名の存在をチェックしません。

```ts
type T = Omit<User, 'emial'>;   // タイプミスだがエラーにならない
```

気になるなら、`Omit<T, K extends keyof T>` の形の厳密版を自作します（第11章の演習で作ります）。

## 2. マップを作る

```ts
type Record<K extends keyof any, T> = { [P in K]: T };

type Config = Record<'host' | 'port', string>;   // { host: string; port: string }
type Cache = Record<string, number>;             // インデックスシグネチャ相当
```

**キーの候補が有限なら `Record<Union, Value>` を使う。** 書き忘れをコンパイラが検出してくれます。

```ts
type Status = 'idle' | 'loading' | 'done';
const LABELS: Record<Status, string> = {
  idle: '待機',
  loading: '読込中',
  // done を書き忘れるとエラー ← これが欲しい
};
```

## 3. ユニオンを操作する

| 型 | 意味 |
| --- | --- |
| `Exclude<T, U>` | T から U に代入可能なメンバーを除く |
| `Extract<T, U>` | T から U に代入可能なメンバーだけ残す |
| `NonNullable<T>` | null と undefined を除く |

```ts
type Status = 'idle' | 'loading' | 'error';
type Active = Exclude<Status, 'idle'>;        // 'loading' | 'error'
type Loose = string | null | undefined;
type Tight = NonNullable<Loose>;              // string
```

## 4. 関数から型を取り出す

| 型 | 意味 |
| --- | --- |
| `ReturnType<F>` | 戻り値の型 |
| `Parameters<F>` | 引数の型のタプル |
| `Awaited<T>` | Promise を剥がした型 |
| `ConstructorParameters<C>` | コンストラクタ引数のタプル |
| `InstanceType<C>` | クラスのインスタンス型 |

```ts
function createUser(name: string, age: number) {
  return { id: 1, name, age };
}

type User = ReturnType<typeof createUser>;        // { id: number; name: string; age: number }
type Args = Parameters<typeof createUser>;        // [name: string, age: number]
type Data = Awaited<Promise<Promise<string>>>;    // string（何重でも剥がす）
```

**`typeof 関数名` + `ReturnType` は非常によく使います。** 実装から型を導けば、二重管理が消えます。

## 5. 文字列を加工する

`Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize` があります（第13章で活躍）。

```ts
type Loud = Uppercase<'hello'>;     // 'HELLO'
type Event = `on${Capitalize<'click'>}`;   // 'onClick'
```

## 6. 使うときの心構え

ユーティリティ型は「型を DRY にする」道具です。ただし**やりすぎると読めなくなります。**

```ts
// これは読めない
type X = Partial<Record<Exclude<keyof T, 'id'>, NonNullable<T[keyof T]>>>;
```

途中に名前を付けましょう。型にも「変数を切る」のと同じリファクタリングが有効です。

```ts
type EditableKey = Exclude<keyof T, 'id'>;
type EditableValue = NonNullable<T[keyof T]>;
type X = Partial<Record<EditableKey, EditableValue>>;
```

---

## 演習

```bash
npm run check 10
```
