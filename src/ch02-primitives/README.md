# 第2章 基本型と特殊な型（any / unknown / never / void）

## この章のゴール

- プリミティブ型と、それに対応する「値の集合」というメンタルモデルを持つ
- `any` と `unknown` を使い分けられる
- `never` が何を意味するのかを説明できる

---

## 1. 型は「値の集合」である

TypeScript を理解する最短のメンタルモデルは **型 = 値の集合** です。

| 型 | 集合として見ると |
| --- | --- |
| `number` | すべての数値の集合 |
| `42` | 42 だけを含む集合（リテラル型） |
| `boolean` | true と false の 2 要素 |
| `never` | 空集合（要素なし） |
| `unknown` | 全体集合（あらゆる値） |

そして「A を B に代入できる」は「**A ⊆ B**」を意味します。`42` は `number` の部分集合なので代入できる。
逆はできない。これだけで代入エラーの 9 割は説明がつきます。

```ts
let n: number = 42;   // OK  {42} ⊆ number
let l: 42 = n;        // NG  number ⊄ {42}
```

## 2. プリミティブ型

```ts
const s: string = 'hello';
const n: number = 3.14;       // 整数と小数の区別はない（JS と同じ）
const b: boolean = true;
const bi: bigint = 10n;
const sym: symbol = Symbol('key');
const u: undefined = undefined;
const nl: null = null;
```

注意点を 2 つ。

- **`String` / `Number`（大文字）は使わない。** ラッパーオブジェクト型であって別物です。常に小文字。
- **`strictNullChecks`（`strict` に含まれる）がオンだと null / undefined は他の型に混ざらない。**
  `string` に null は入りません。入れたければ `string | null` と書く。これが TypeScript の
  もっとも価値のある機能です。

## 3. any — 型チェックを止めるスイッチ

`any` は「何でも入る型」ではなく、**その値に関する型チェックを丸ごと放棄する指示**です。

```ts
const data: any = JSON.parse('{}');
data.foo.bar.baz();     // エラーにならない。実行時に落ちる
const n: number = data; // これも通ってしまう
```

`any` は伝染します。`any` の値を使った式は `any` になり、そこから先の安全性がすべて失われます。
**`any` を書いた瞬間、その周辺は JavaScript に戻ります。** 使ってよいのは一時的な逃げ道としてだけです。

## 4. unknown — 安全な any

`unknown` は「何でも入るが、**何もできない**」型です。

```ts
const data: unknown = JSON.parse('{}');
data.foo;                 // エラー: unknown に対する操作は許されない
if (typeof data === 'string') {
  data.toUpperCase();     // OK: 絞り込めば使える
}
```

外部から来る値（`JSON.parse`、`fetch` の結果、ライブラリの戻り、`catch (e)`）は
**まず unknown で受け、検査してから使う** のが定石です。第17章で本格的に扱います。

## 5. void と never

- **`void`**: 「戻り値を使わない」ことを表す。undefined を返す関数の戻り値型。
- **`never`**: 「**値が存在しない**」ことを表す。関数が **正常に返らない** ときの戻り値型。

```ts
function log(msg: string): void {
  console.log(msg);
}

function fail(msg: string): never {
  throw new Error(msg);   // 決して返らない
}
```

`never` は「ありえない」の印です。空集合なので **never にはどんな値も代入できない**。
この性質を使って「起こりえないケースをコンパイラに検出させる」のが**網羅性チェック**で、
第9章の主役になります。

## 6. null と undefined の扱い

実務では次の使い分けが多いです。

- `undefined`: 「まだない / 指定されていない」（JS が自然に生む値）
- `null`: 「意図的に空」（API や DB から来る値）

どちらか一方に寄せるとコードは単純になります。判定は `x == null` が両方を一度に拾えて便利です
（`==` が許される数少ない場面）。

## 7. オプショナルチェーンと Nullish 合体

```ts
const len = user?.profile?.name.length;   // 途中が null/undefined なら undefined
const name = input ?? '名無し';            // null/undefined のときだけ既定値
```

`??` と `||` は違います。`||` は 0 や空文字も falsy として弾きますが、`??` は
null / undefined だけを見ます。**「値がないときの既定値」には `??`、「空も弾きたい」ときは `||`** と
使い分けます。

---

## 演習

```bash
npm run check 02
```
