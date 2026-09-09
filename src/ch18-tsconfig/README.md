# 第18章 tsconfig.json を読み切る

設定を理解していないと、「同じコードなのにプロジェクトによってエラーが出たり出なかったり」で
消耗します。ここで全体像を押さえます。

---

## 1. 大きく 3 グループ

1. **どんな JS を出力するか** — target / module / lib
2. **どうやってファイルを見つけるか** — moduleResolution / paths / include
3. **どれくらい厳しくチェックするか** — strict 系

## 2. 出力に関する設定

| オプション | 意味 | 実務での選び方 |
| --- | --- | --- |
| target | 出力する JS のバージョン | Node 18+ / モダンブラウザなら ES2022 |
| lib | 使える組み込み API の型 | 既定は target 依存。DOM が要るなら ES2022 + DOM |
| module | 出力するモジュール形式 | バンドラなら preserve、Node なら nodenext |
| outDir / rootDir | 出力先 / 入力ルート | dist / src |
| sourceMap | ソースマップを出すか | 開発では true |
| declaration | .d.ts を出すか | **ライブラリを配るなら必須** |

**注意: target を下げてもランタイムの機能は増えません。** ES5 にしても
`Array.prototype.at` は存在しません（構文は変換されるが、API は polyfill が要る）。
lib と実行環境が一致しているかは自分で保証する必要があります。

## 3. モジュール解決

| オプション | 意味 |
| --- | --- |
| moduleResolution | bundler（Vite/webpack）/ nodenext（Node の ESM/CJS） |
| baseUrl + paths | エイリアス（@/utils など） |
| resolveJsonModule | JSON を import できるようにする |
| allowJs / checkJs | JS も対象にする / JS も型チェックする |

paths を使うときの注意: **TypeScript はパスを解決するだけで、出力は書き換えません。**
バンドラや tsconfig-paths 側にも同じ設定が要ります。ここは事故が多い場所です。

## 4. strict 系 — 1 つずつの意味

`"strict": true` は次をまとめてオンにします。

| オプション | 何を防ぐか |
| --- | --- |
| noImplicitAny | 型を書き忘れた引数が暗黙に any になるのを防ぐ |
| strictNullChecks | **null / undefined の混入**（いちばん重要） |
| strictFunctionTypes | 関数引数の変性チェック（第14章） |
| strictBindCallApply | bind / call / apply の引数チェック |
| strictPropertyInitialization | クラスの初期化漏れ |
| noImplicitThis | this が暗黙の any になるのを防ぐ |
| useUnknownInCatchVariables | catch (e) を unknown にする |
| alwaysStrict | 出力を strict モードにする |

**新規プロジェクトは常に strict: true から始めてください。** あとからオンにするのは
非常に大変です（既存コードが数百のエラーを出す）。

## 5. strict に含まれない、しかし入れるべきもの

| オプション | 効果 | おすすめ |
| --- | --- | --- |
| noUncheckedIndexedAccess | 配列やマップの読み出しを T または undefined にする | **強く推奨** |
| noImplicitOverride | override キーワードを必須にする | 推奨 |
| noFallthroughCasesInSwitch | switch の break 漏れを検出 | 推奨 |
| noUnusedLocals / noUnusedParameters | 未使用を検出 | ESLint に任せるほうが柔軟 |
| exactOptionalPropertyTypes | ? と undefined 明示を区別する | 厳しめ。新規なら検討 |
| verbatimModuleSyntax | import type を強制する | バンドラを使うなら推奨 |
| isolatedModules | 1 ファイル単位で変換できる形に制限 | esbuild/swc を使うなら必須 |

### exactOptionalPropertyTypes の違い

```ts
type A = { name?: string };
// off: name には string | undefined を明示的に入れてもよい
// on : name?: string は「キーがないか、string」。undefined の明示代入はエラー
const a: A = { name: undefined };   // on だとエラー
```

厳密ですが、既存ライブラリと衝突することがあります。このリポジトリでは off にしてあります。

## 6. プロジェクト参照と複合ビルド

大規模なリポジトリでは、references で複数の tsconfig を繋ぎ、
composite: true と `tsc --build` で差分ビルドします。モノレポでは必須の知識ですが、
まずは単一プロジェクトを完全に理解してからで十分です。

## 7. このリポジトリの tsconfig を読む

ルートの `tsconfig.json` を開いて、1 行ずつ「なぜそうなっているか」を説明してみてください。
説明できない行があれば、それがあなたの次に学ぶべきところです。

---

## 演習

```bash
npm run check 18
```
