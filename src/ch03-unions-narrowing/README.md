# 第3章 ユニオン型・リテラル型・型の絞り込み

## この章のゴール

- ユニオン型を「値の集合の和」として読める
- リテラル型で「取りうる値」をコードに閉じ込められる
- 絞り込み（narrowing）でコンパイラを味方につけられる

---

## 1. ユニオン型 = 集合の和

```ts
type Id = string | number;   // string の集合 ∪ number の集合
```

重要なのは、**ユニオン型の値に対しては「全メンバーに共通する操作」しかできない**ことです。

```ts
function f(id: string | number) {
  id.toUpperCase();  // エラー: number には toUpperCase がない
  id.toString();     // OK: 両方にある
}
```

これは制限ではなく安全装置です。「どちらか分からないうちは、どちらでも安全なことしかさせない」。

## 2. 絞り込み（Narrowing）

条件分岐を書くと、そのブロックの中で型が自動的に狭まります。これが TypeScript の心臓部です。

```ts
function f(id: string | number) {
  if (typeof id === 'string') {
    id.toUpperCase();  // ここでは id: string
  } else {
    id.toFixed(2);     // ここでは id: number
  }
}
```

コンパイラは制御フローを追いかけています（**control flow analysis**）。使える絞り込みの手段は主に次の通り。

| 手段 | 使える相手 | 例 |
| --- | --- | --- |
| `typeof` | プリミティブ | `typeof x === 'string'` |
| `instanceof` | クラスのインスタンス | `e instanceof Error` |
| `in` | オブジェクトのプロパティ有無 | `'radius' in shape` |
| 等値比較 | リテラル型 | `x === 'circle'` |
| truthy 判定 | null/undefined 除去 | `if (x)` |
| `Array.isArray` | 配列 | `Array.isArray(x)` |
| 型述語（第9章） | 自作の検査関数 | `isUser(x)` |

## 3. 早期 return と絞り込み

絞り込みは早期 return とよく噛み合います。

```ts
function greet(name: string | null) {
  if (name === null) return 'ゲスト';
  // ここから下では name: string（null は消えた）
  return `${name}さん`;
}
```

**ネストを深くするより、ありえない場合を先に返す。** 型もコードも同時にきれいになります。

## 4. リテラル型とユニオンの組み合わせ

これが TypeScript でいちばん費用対効果の高い型の書き方です。

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';

function render(status: Status) { /* ... */ }

render('loading');   // OK
render('Loading');   // エラー: タイプミスがコンパイル時に見つかる
```

`string` にしていたら実行するまで気づけないミスが、書いた瞬間に見つかります。
**「取りうる値が有限なら、リテラルのユニオンにする」** と覚えてください。

## 5. 絞り込みが効かなくなる場面

### (a) 変数に入れ直すと追跡できる、が…

```ts
const isString = typeof x === 'string';
if (isString) {
  x.toUpperCase();   // TS 4.4 以降なら OK（const に限る）
}
```
`let` にすると効きません。**絞り込み用の判定は `const` で。**

### (b) コールバックをまたぐと消える

```ts
if (user.name !== null) {
  setTimeout(() => {
    user.name.length;  // エラー: 間に何が起きるか分からない
  });
}
```
対策はローカル定数に取り出すこと。

```ts
const name = user.name;
if (name !== null) {
  setTimeout(() => name.length);  // OK
}
```

## 6. 型の絞り込みと `as`（型アサーション）

`as` は「コンパイラより自分のほうが知っている」という宣言です。**検査ではありません。**

```ts
const el = document.getElementById('app') as HTMLCanvasElement;  // 嘘でも通る
```

`as` は最後の手段です。この章の演習では一度も使わずに解けます。使いたくなったら、
たいてい絞り込みで解けないか考え直すサインです。

---

## 演習

```bash
npm run check 03
```
