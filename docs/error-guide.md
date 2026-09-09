# よく出るエラーメッセージの読み方

TypeScript のエラーは長いですが、パターンは限られています。
**エラー番号（TS2345 など）で検索する**と、たいてい同じ状況の説明が見つかります。

---

## TS2322 / TS2345 — 代入できない

```
Type 'string' is not assignable to type 'number'.
     ^^^^^^ 実際                        ^^^^^^ 期待
```

**読み方: 「左が実際に持っているもの、右が求められているもの」。**
`is not assignable to` の前後を見れば、たいていそれで分かります。

よくある原因:

- リテラル型に広い型を入れようとした（`number` を `42` の場所に）
- `null` / `undefined` を潰していない → `?? 既定値` か早期 return
- オブジェクトのプロパティが 1 つ足りない → 下に「Property 'x' is missing」と続きます

## TS2339 — そのプロパティは存在しない

```
Property 'length' does not exist on type 'string | number'.
  Property 'length' does not exist on type 'number'.
```

**ユニオン型のまま操作しようとしています。** 絞り込みが必要です（第3章）。
2 行目が「どのメンバーで失敗したか」を教えてくれます。

## TS18047 / TS18048 — null または undefined かもしれない

```
'user.name' is possibly 'null'.
```

- 値なら `if (x === null) return;` で早期 return
- プロパティなら**ローカル定数に取り出してから**判定（第3章のコールバック問題）
- 配列の要素なら `?? 既定値` か `for...of`（`noUncheckedIndexedAccess`）

`!` を付けて黙らせるのは最後の手段です。**「なぜ null になりうるのか」を先に考えてください。**

## TS2739 / TS2353 — オブジェクトの形が違う

```
Object literal may only specify known properties, and 'z' does not exist in type 'Point'.
```

**過剰プロパティチェック**です（第4章）。タイプミスか、型の定義漏れか、
そもそも別の型を使うべきか。一度変数に入れると通ってしまいますが、それは回避ではなく先送りです。

## TS2589 — 型の展開が深すぎる

```
Type instantiation is excessively deep and possibly infinite.
```

再帰的な型が深くなりすぎています（第12・13章）。
再帰の終了条件を見直すか、そもそも型で解こうとするのをやめるサインです。

## TS2344 — 型テストが落ちている

```
Type 'false' does not satisfy the constraint 'true'.
```

この教材の型レベル演習で出るものです。**`Expect<Equal<A, B>>` の A と B が違う**ということ。
エディタで `Equal<...>` にホバーすると、実際に推論された型が見えます。

## TS7006 — 暗黙の any

```
Parameter 'x' implicitly has an 'any' type.
```

引数に型を書いていません。コールバックでこれが出るときは、
**渡し先の関数の型が付いていない**（`any` を返している）ことが原因のこともあります。

## React でよく出るもの

```
Type '{ name: string; }' is not assignable to type 'IntrinsicAttributes & Props'.
  Property 'age' is missing
```

props が足りない、または多い。`&  IntrinsicAttributes` は React が足す型なので無視してよいです。

```
'Component' cannot be used as a JSX component.
  Its return type 'Element[]' is not a valid JSX element.
```

配列をそのまま返しています。`<>...</>`（フラグメント）で包んでください。

---

## エラーが読めないときの手順

1. **いちばん上のエラーだけを見る。** 後続はたいてい巻き添えです
2. エラーの起きた式を、**変数に分解する**（どこで型が壊れたかが特定できる）
3. その変数にホバーして、実際の型を見る
4. 期待と違えば、そこが原因。同じなら 1 つ上流へ
5. それでも分からなければ、型注釈を一時的に書いて「どこで嘘をついているか」を探す

**エラーメッセージは敵ではなく、型の不一致を教えてくれる唯一の手掛かりです。**
読み飛ばして `as any` を入れると、同じ問題が実行時に、もっと分かりにくい形で出てきます。
