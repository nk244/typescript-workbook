# 完走した後に

24 章を終えたら、次はこの 3 つを並行して進めるのが効きます。

---

## 1. 読むもの

| 資料 | 内容 |
| --- | --- |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | 公式。この教材の内容と対応させながら読むと速い |
| [type-challenges](https://github.com/type-challenges/type-challenges) | 型レベルパズル。第11〜13章の続き |
| [Total TypeScript](https://www.totaltypescript.com/) | 実務寄りの有料/無料教材 |
| `node_modules/typescript/lib/lib.es5.d.ts` | **標準ライブラリの型定義そのもの。** 第12章のあとなら読める |
| [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) | React 固有のパターン集 |

**いちばん学びが濃いのは `lib.es5.d.ts` と、自分が使っているライブラリの `.d.ts` です。**
「こう書けばこう表現できるのか」が一次情報として入っています。

## 2. 作るもの

第24章の続きとして、次のどれかを自分で作ってみてください。

1. **第24章のアプリに機能を足す** — 締切、タグ、並び替え、localStorage 保存。
   足すたびに「型を先に直す → コンパイラが直す場所を教えてくれる」流れを体験できます
2. **既存の JS プロジェクトを TypeScript に移す** — `allowJs` + `checkJs` から始め、
   ファイル単位で `.ts` にしていく。**実務でいちばん必要になる技能**です
3. **小さなライブラリを作って npm に公開する** — `declaration: true` で `.d.ts` を出し、
   型テストを書く。第15章と第23章の総仕上げになります

## 3. 触るもの

| 分野 | ツール |
| --- | --- |
| バリデーション | [zod](https://zod.dev/) — 第17章で自作したものの完成形 |
| サーバ状態 | TanStack Query — 第22章の `useAsync` の完成形 |
| フォーム | react-hook-form — 第21章のフィールド型付けの完成形 |
| ルーティング | TanStack Router — 第13章のパス型の完成形 |
| API 型共有 | tRPC / OpenAPI generator — 第22章の API クライアントの完成形 |
| ビルド | Vite / tsup / esbuild |

**この表は偶然ではありません。** この教材で自作したものは、すべて実在するライブラリの縮小版です。
原理を知っていれば、ライブラリの型エラーが出たときに中を読んで直せます。

---

## 到達度チェック

次の質問に自分の言葉で答えられれば、独学の段階は終わりです。

1. `any` と `unknown` の違いを、実際に困る例を挙げて説明できるか
2. `interface` と `type` をどう使い分けるか、根拠を言えるか
3. 「不正な状態を表現できなくする」を、自分のコードの例で説明できるか
4. `as` を使いたくなったとき、代わりの手段を 3 つ挙げられるか
5. 型エラーが出たとき、**上流に遡って**原因を特定できるか
6. `strict` の各オプションが、どんなバグを防ぐか説明できるか
7. 外部データを扱うコードで、どこに検証を置くか判断できるか

答えに詰まる項目があれば、対応する章に戻ってください。
