# 第17章 外部から来るデータを型安全に扱う

TypeScript の型は**コンパイル時にしか存在しません**。だから外の世界（API・localStorage・
環境変数・ユーザー入力）から来た値については、**型は何の保証もしてくれません**。
この章は、その境界をどう守るかの話です。

---

## 1. 最大の嘘 — `as` で型を付ける

```ts
const user = (await res.json()) as User;
user.name.toUpperCase();   // サーバが name を返さなければ実行時エラー
```

`res.json()` の戻りは `any`（または `unknown`）です。`as User` は**検査ではなく宣言**なので、
実際のデータが違えば普通に落ちます。しかも落ちるのは `as` を書いた場所ではなく、
**ずっと後の、まったく関係なさそうな場所**です。デバッグが最も難しいバグの典型的な原因です。

**原則: 外から来た値は `unknown` で受け、検査してから使う。**

## 2. 検査の 3 段階

### (a) 手書きの型ガード

```ts
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number'
  );
}
```

`in` を使って絞り込むと、TypeScript 4.9 以降は `value.id` にアクセスできます。
小さい型ならこれで十分ですが、**フィールドが増えると破綻します**（型と検査が二重管理になる）。

### (b) スキーマから型を導く（推奨）

「検査するもの（スキーマ）を書いて、型はそこから導く」。二重管理が消えます。

```ts
const userSchema = v.object({
  id: v.number(),
  name: v.string(),
});

type User = Infer<typeof userSchema>;   // { id: number; name: string }
```

これが **zod / valibot / arktype** といったライブラリの発想です。
演習では、この仕組みのミニ版を自分で作ります。**作ると原理が完全に分かります。**

### (c) 実務では zod を使う

```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

const result = UserSchema.safeParse(await res.json());
if (!result.success) { /* エラー処理 */ }
result.data;   // User として安全に使える
```

**API 境界・フォーム・環境変数の 3 か所には、必ず入れる価値があります。**

## 3. 環境変数

`process.env.FOO` の型は `string | undefined` です（`noUncheckedIndexedAccess` なしでも）。
アプリ起動時に一度だけ検証して、以降は型付きの設定オブジェクトを使い回すのが定石です。

```ts
function loadConfig() {
  const port = process.env.PORT;
  if (port === undefined) throw new Error('PORT が未設定です');
  return { port: Number(port) } as const;
}
```

**起動時に落とす（fail fast）**のが重要です。使うたびにチェックすると漏れます。

## 4. JSON.parse の型

```ts
const data = JSON.parse(text);          // any（危険）
const data: unknown = JSON.parse(text); // unknown（安全）
```

`JSON.parse` の戻り値型は `any` です。**受ける変数に `: unknown` を書くだけ**で
安全側に倒せます。これは今日から使える小技です。

## 5. どこまで検証するか

全部を検証すると重いので、実務では線を引きます。

| 対象 | 検証 |
| --- | --- |
| 外部 API のレスポンス | **する**（相手の都合で変わる） |
| ユーザー入力・フォーム | **する** |
| 環境変数・設定ファイル | **する**（起動時に 1 回） |
| 自社の別サービス（型を共有） | 場合による |
| 同一プロセス内の関数呼び出し | しない（型で足りる） |

**「自分がコントロールできない境界」だけ検証する。** これが費用対効果の分かれ目です。

---

## 演習

```bash
npm run check 17
```
