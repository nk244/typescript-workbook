# 外伝 第5章 開発体験を上げる小技集

派手さはないけれど、知っていると毎日の作業が軽くなるものを集めました。

---

## 1. Prettify — ツールチップを読める形にする

交差型やユーティリティ型を重ねると、ホバー表示がこうなります。

```ts
type Props = Omit<User, 'id'> & { onSave: () => void };
// ホバー: Omit<User, "id"> & { onSave: () => void }   ← 中身が見えない
```

これを展開して見せる型があります。

```ts
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type Props = Prettify<Omit<User, 'id'> & { onSave: () => void }>;
// ホバー: { name: string; email: string; onSave: () => void }   ← 読める！
```

`{ [K in keyof T]: T[K] }` は**中身は同じだが「展開済み」の新しい型**を作ります。
末尾の `& {}` は展開を確実にするためのおまじないです（TypeScript の実装都合）。

**公開する型（ライブラリの props など）には付けておくと親切**です。
ただし大きな型に使うとコンパイルが重くなるので、乱用は避けてください。

## 2. filter の絞り込み（TS 5.5 以降）

昔はこう書く必要がありました。

```ts
const values: (string | null)[] = ['a', null];
const filtered = values.filter((v): v is string => v !== null);   // 型述語を手で書く
```

**TypeScript 5.5 からは、単純な形なら型述語が自動で推論されます。**

```ts
const filtered = values.filter((v) => v !== null);   // string[] になる
```

条件が複雑だったり、途中で変数に代入していると推論されません。
その場合だけ、今まで通り型述語を書きます。**まず書いてみて、効かなければ手で書く。**

## 3. Object.keys / entries は嘘をつく

```ts
const user = { id: 1, name: 'ken' };
Object.keys(user);      // string[]   ← ('id' | 'name')[] ではない
Object.entries(user);   // [string, any][]
```

**わざとこうなっています。** 構造的部分型では、`user` に他のプロパティが入っていても
型としては正しいからです（余分なキーを持つオブジェクトが代入されうる）。

「自分が作ったオブジェクトだから大丈夫」と分かっているときは、ラッパーを作ります。

```ts
function objectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}
```

**`as` を使いますが、これは「1 か所に閉じ込めた意図的な嘘」**です。
危険性を理解した上で、その理由をコメントに書いておくのが作法です。

## 4. 型でエラーメッセージを出す

制約に合わないときに、**ホバーで理由が読める**ようにできます。

```ts
type RequireKeys<T, K extends keyof T> = ...;

type Invalid<Message extends string> = { __error: Message };

type CheckId<T> = 'id' extends keyof T ? T : Invalid<'id プロパティが必要です'>;

declare function save<T>(entity: CheckId<T>): void;

save({ name: 'x' });
// エラーに「Invalid<'id プロパティが必要です'>」が出るので理由が分かる
```

ライブラリの型が親切なエラーを出してくれることがありますが、その多くはこの手法です。

## 5. using — 後始末を型と構文で守る（TS 5.2）

`Symbol.dispose` を実装したオブジェクトは、`using` 宣言でスコープを抜けるときに
**自動的に後始末されます**（`try/finally` の構文版）。

```ts
class FileHandle implements Disposable {
  [Symbol.dispose]() {
    this.close();
  }
}

function read() {
  using handle = open('a.txt');
  return handle.read();
  // ここで自動的に [Symbol.dispose]() が呼ばれる
}
```

非同期版は `await using` と `Symbol.asyncDispose`（`AsyncDisposable`）です。
DB 接続、ロック、一時ファイル、計測スパンなど**「必ず閉じたいもの」**に効きます。

利用には `lib` に `ESNext.Disposable` が必要です（このリポジトリでは設定済み）。

## 6. 型のパフォーマンス

型が原因でエディタが重くなることがあります。効く対策の順:

1. **`interface extends` を使う**（交差型 `&` より速い。継承関係をキャッシュできるため）
2. **深い再帰型を避ける**（テンプレートリテラルでの文字列パースは特に重い）
3. **大きなユニオンの組み合わせを作らない**（`` `${A}-${B}` `` は掛け算で増える）
4. **関数の戻り値型を明示する**（推論のために全体を辿らなくて済む）
5. `skipLibCheck: true`（既定で入れておく）

調べるときは `tsc --extendedDiagnostics` や `--generateTrace` が使えます。

## 7. 日々のエディタ技

| 操作 | 効果 |
| --- | --- |
| 型名にホバー | 展開結果を見る。**まずこれ** |
| Go to Type Definition | 型の定義元へ（`.d.ts` に飛べる） |
| `const x: SomeType = ...` を一時的に書く | 「実際は何型か」をエラーメッセージで吐かせる |
| `type Debug = typeof value;` を置く | 推論結果に名前を付けて確認する |

3 番目は覚えておくと便利です。**わざと間違った型注釈を書くと、
コンパイラが「実際の型」を教えてくれます。**

---

## 演習

```bash
npm run check ex05
```
