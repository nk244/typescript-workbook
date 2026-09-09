# 第15章 モジュールと宣言ファイル（.d.ts）

型定義のない JavaScript と付き合う方法、そして自分のライブラリに型を付ける方法を学びます。

---

## 1. モジュールとスクリプト

TypeScript のファイルは 2 種類あります。

- **モジュール**: `import` か `export` を 1 つでも含むファイル。スコープはファイル内に閉じる。
- **スクリプト**: 含まないファイル。**すべての宣言がグローバルに漏れる。**

型定義ファイルで「なぜか他のファイルの型と衝突する」ときは、たいていこれが原因です。
モジュールにしたいのに export がないなら `export {};` を 1 行入れます。

## 2. import / export の書き方

```ts
// 名前付きエクスポート（基本これを使う）
export const VERSION = '1.0';
export function parse(s: string) {}

// デフォルトエクスポート（1 ファイル 1 つ）
export default class Client {}

// 再エクスポート
export * from './parser';
export { parse as parseText } from './parser';
```

**実務では名前付きエクスポートを推奨**します。デフォルトは import 側で好きな名前を付けられてしまい、
grep しづらく、自動 import も効きにくいためです。

### import type

型だけを import するときは `import type` を使います。

```ts
import type { User } from './types';       // 型だけ。コンパイル後は消える
import { type User, createUser } from './api';   // 混在も書ける
```

これは**バンドラやトランスパイラのため**に重要です。値と型を区別しておかないと、
「型しか使っていないのにモジュールが実行時に読み込まれる」ことが起きます。
`verbatimModuleSyntax: true` にすると、この区別を強制できます（第18章）。

## 3. 宣言ファイル（.d.ts）とは

**型だけを書いた、実装のないファイル**です。

```ts
// legacy-lib.d.ts
export declare function formatCurrency(amount: number, currency: string): string;
```

`declare` は「実体はどこか別のところにある。型だけ教える」という意味です。
`.d.ts` の中では実装を書けません（書いてもコンパイルされません）。

TypeScript は `import './legacy-lib'` を解決するとき、
`legacy-lib.ts` → `legacy-lib.d.ts` の順で型を探します。
つまり **JS ファイルの隣に同名の .d.ts を置けば、型が付きます。**

## 4. @types パッケージ

有名なライブラリの型定義は DefinitelyTyped というリポジトリに集約され、
`@types/xxx` として npm で配られています。

```bash
npm i -D @types/node @types/react
```

- ライブラリが型定義を同梱している場合（`package.json` の `types` フィールド）は不要です。
- 最近のライブラリはほぼ同梱しています。`@types` が要るのは古いものだけ。

## 5. アンビエント宣言 — グローバルに型を足す

```ts
// globals.d.ts
declare global {
  interface Window {
    myApp: { version: string };
  }
}

export {};   // ← これがないとモジュールにならず declare global が使えない
```

これで `window.myApp` が型付きで使えます。

## 6. モジュール拡張（Module Augmentation）

既存ライブラリの型に、あとから項目を足せます。**`interface` の宣言のマージ**（第4章）の応用です。

```ts
declare module 'express' {
  interface Request {
    user?: { id: string };   // 認証ミドルウェアが足すプロパティ
  }
}
```

`type` ではこれができません。**ライブラリの公開型を `interface` にすべき理由**がこれです。

## 7. 型のない JS を使う応急処置

```ts
// shims.d.ts
declare module 'untyped-lib';          // 何でも any になる（最終手段）
declare module '*.css';                // CSS import を通すため
declare module '*.svg' {
  const src: string;
  export default src;
}
```

`declare module 'x';` は `any` を配るので、**とりあえず動かすため**の措置です。
使うなら、せめて自分が使う関数だけでも型を書きましょう（この章の演習でやります）。

---

## 演習

この章には型のない JavaScript ファイル `legacy-lib.js` が置いてあります。
`legacy-lib.d.ts` を書いて、型付きで使えるようにしてください。

```bash
npm run check 15
```
