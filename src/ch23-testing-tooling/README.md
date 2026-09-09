# 第23章 テスト・型テスト・Lint・CI

型は「書いた時点」を守り、テストは「動かした結果」を守ります。両方が要ります。

---

## 1. Vitest の基本

```ts
import { describe, expect, it } from 'vitest';

describe('sum', () => {
  it('数値を足す', () => {
    expect(sum([1, 2])).toBe(3);
  });

  it('空配列は 0', () => {
    expect(sum([])).toBe(0);
  });
});
```

よく使うマッチャ:

| マッチャ | 用途 |
| --- | --- |
| `toBe` | プリミティブの同一性（`Object.is`） |
| `toEqual` | オブジェクト・配列の再帰的な等価 |
| `toStrictEqual` | `undefined` のキーやクラスの違いまで見る |
| `toThrow` | 例外が投げられること |
| `rejects.toThrow` | Promise が reject されること |
| `toHaveBeenCalledWith` | モック関数の呼ばれ方 |

**非同期のテストは `await` を忘れると常に緑になります。** これは実際によくある事故で、
`@typescript-eslint/no-floating-promises` が守ってくれます（後述）。

## 2. 型のテスト

型は実行されないので、`expect` では検査できません。**コンパイルできるかどうか**で検査します。

このリポジトリの `src/lib/type-test.ts` がその道具です。

```ts
type Result = MyPick<User, 'id'>;
type _ = Expect<Equal<Result, { id: number }>>;   // 違えば tsc がエラーを出す
```

Vitest にも同じ用途の API があります。

```ts
import { expectTypeOf } from 'vitest';

expectTypeOf(createUser).returns.toEqualTypeOf<User>();
expectTypeOf<Partial<User>>().toMatchObjectType<{ id?: number }>();
```

`vitest --typecheck` で実行します。**ライブラリを作るなら型テストは必須**です。
型は API の一部であり、壊れたことに気づけないと利用者が困るからです。

### 「エラーになること」のテスト

```ts
// @ts-expect-error 数値は渡せないはず
greet(42);
```

`@ts-expect-error` は「次の行はエラーになるはず」という宣言で、
**エラーが出なくなったら逆にエラーになります。** `@ts-ignore` と違って腐りません。
使うなら常にこちらを。

## 3. ESLint — 型情報を使ったルール

型があるからこそ検出できるバグがあります。

| ルール | 検出するもの |
| --- | --- |
| `no-floating-promises` | `await` を忘れた Promise |
| `no-misused-promises` | `forEach(async ...)` や `if (promise)` |
| `await-thenable` | Promise でないものへの `await` |
| `no-unnecessary-condition` | 常に真（または偽）になる条件式 |
| `strict-boolean-expressions` | `if (str)` のような曖昧な真偽判定 |
| `no-unsafe-*` | `any` 由来の値の使用 |

このリポジトリの `eslint.config.js` は `recommendedTypeChecked` を使っています。

```bash
npm run lint
```

**tsc と ESLint は役割が違います。** tsc は型の整合性、ESLint はコードの書き方と
「型を使った危険検出」。両方 CI に入れてください。

## 4. Prettier との住み分け

- **Prettier**: 見た目（改行・クォート・セミコロン）。議論の余地なく自動整形。
- **ESLint**: 意味（バグになりうる書き方）。

ESLint の整形系ルールは Prettier と衝突するので、`eslint-config-prettier` で無効化するのが定番です。
**整形の議論に時間を使わないこと**が最大の利点です。

## 5. CI での型チェック

GitHub Actions の最小構成:

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit     # 型チェック
      - run: npm run lint         # Lint
      - run: npm test             # テスト
```

**`tsc --noEmit` を CI に入れないと、型エラーがあるまま main にマージされます。**
エディタでしか型を見ていないチームでは、これが本当によく起きます。

## 6. 型カバレッジという指標

`any` がどれだけ紛れ込んでいるかを測るツールがあります。

```bash
npx type-coverage --detail
```

既存プロジェクトを `strict` にしていく作業では、この数値を上げていくのが良い進め方です。

---

## 演習

この章には 2 つの課題があります。

1. `exercise.ts` の実装を、**先に用意されたテストが通るように**書く（テストが仕様書）
2. `lint-me.ts` の Lint エラーをすべて直す

`npm run check 23` は、型チェック → テスト → Lint の順に実行します。

```bash
npm run check 23
```
