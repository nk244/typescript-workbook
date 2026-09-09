# 第7章 クラスと型

## この章のゴール

- アクセス修飾子と `#private` の違いを理解する
- `implements` と `extends` の役割の違いを説明できる
- 「クラス名は型でもある」という TypeScript 特有の二重性を扱える

---

## 1. クラスの基本形

```ts
class Counter {
  private count: number = 0;          // プロパティ宣言が必須（JS と違う）

  constructor(private readonly step: number = 1) {}   // 引数プロパティ

  increment(): void {
    this.count += this.step;
  }

  get value(): number {
    return this.count;
  }
}
```

`constructor(private readonly step: number)` は **引数プロパティ**という TypeScript 独自の短縮記法で、
`this.step = step` を自動でやってくれます。便利ですが TypeScript 専用構文なので、
チームによっては避けることもあります。

## 2. アクセス修飾子と #private

| 書き方 | 効き目 | 実行時 |
| --- | --- | --- |
| `public`（既定） | どこからでも | 見える |
| `protected` | 自クラスとサブクラス | 見える |
| `private` | 自クラスのみ | **見える**（型が消えるので） |
| `#field` | 自クラスのみ | **本当に見えない**（JS の機能） |

```ts
class A {
  private a = 1;
  #b = 2;
}
const x = new A();
(x as any).a;   // 1 が取れてしまう
(x as any).b;   // undefined（#b は外から到達不能）
```

`private` は「約束」、`#` は「強制」です。ライブラリを書くなら `#`、
アプリ内部なら `private` で十分、というのが実務的な落としどころです。

## 3. クラスは「値」であり「型」でもある

```ts
class User {
  constructor(public name: string) {}
}

const u: User = new User('ken');   // ← User を「型」として使っている
const C = User;                    // ← User を「値（コンストラクタ）」として使っている
```

TypeScript には **値の名前空間と型の名前空間が別々にあり**、クラス宣言は両方に名前を登録します。
`type` や `interface` は型の名前空間だけ、`const` は値の名前空間だけ、です。

そして重要なのは、**クラスの型も構造的部分型で判定される**ことです。

```ts
class Point { constructor(public x: number, public y: number) {} }
const p: Point = { x: 1, y: 2 };   // OK！ new していないのに代入できる
```

Java や C# の感覚だと驚きますが、TypeScript は「形が合っていればよい」。
ただし `private` / `#` フィールドを持つクラスは例外で、そのクラス由来でないと代入できません。

## 4. implements と extends

```ts
interface Serializable {
  serialize(): string;
}

class Config implements Serializable {   // 「この形を満たすと約束する」
  serialize(): string { return '{}'; }
}

class BaseConfig { protected path = ''; }
class AppConfig extends BaseConfig {}    // 「実装を受け継ぐ」
```

- `implements` は**チェックだけ**。何も継承しません。書かなくても構造的には互換ですが、
  書いておくと「約束を破ったとき、使う側ではなく定義側でエラーになる」ので早期発見できます。
- `extends` は実装の継承。**1 つしか継承できません。** `implements` は複数書けます。

## 5. abstract クラス

```ts
abstract class Shape {
  abstract area(): number;              // 実装は子に任せる

  describe(): string {                  // 共通実装は持てる
    return `面積は ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private r: number) { super(); }
  override area(): number { return Math.PI * this.r ** 2; }
}
```

`new Shape()` はできません。このリポジトリでは `noImplicitOverride: true` なので、
親のメソッドを上書きするときは `override` キーワードが必須です
（打ち間違いで「上書きしたつもりが新しいメソッドを生やしていた」事故を防げます）。

## 6. クラスを使うべきか

TypeScript のアプリコードでは、実は **クラスが要らない場面のほうが多い**です。

- 状態を持たない処理 → ただの関数
- データの入れ物 → `type` + オブジェクトリテラル
- 状態と振る舞いが密に結びつく → クラスが向く（接続の管理、リトライ、キャッシュなど）

React では特にそうで、いまはクラスコンポーネントを新規に書くことはありません（第19章）。
それでも、既存コードを読むために文法は知っておく必要があります。

---

## 演習

```bash
npm run check 07
```
