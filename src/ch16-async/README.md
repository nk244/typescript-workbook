# 第16章 非同期処理の型

`Promise` と `async/await` の型、そして**エラーを型で表現する**方法を学びます。

---

## 1. Promise の型

```ts
const p: Promise<string> = Promise.resolve('hello');

async function load(): Promise<User> {
  return fetchUser();
}
```

- **`async` 関数の戻り値は必ず `Promise<T>`**。`T` を書けば `Promise` は自動で巻かれます。
- `await` は `Promise<T>` を `T` にします。`T` が Promise ならさらに剥がされます。

```ts
type A = Awaited<Promise<Promise<number>>>;   // number
```

## 2. エラーは型に現れない

これが TypeScript の非同期でいちばん重要な事実です。

```ts
async function load(): Promise<User> {
  throw new Error('失敗');   // 戻り値型は Promise<User> のまま
}
```

**Java の検査例外のような仕組みは TypeScript にありません。**
どんな関数も、いつでも何でも throw できます。そして `catch` で受けた値は `unknown` です
（`useUnknownInCatchVariables`、`strict` に含まれる）。

```ts
try {
  await load();
} catch (e) {
  // e は unknown。e.message とは書けない
  const message = e instanceof Error ? e.message : String(e);
}
```

これは正しい設計です。**JS では Error 以外も throw できる**（文字列でも数値でも）ので、
`Error` だと決めつけるのは嘘だからです。

## 3. Result 型 — エラーを戻り値に載せる

「失敗しうる」ことを型に出したいなら、戻り値で表現します（第8章で作った型です）。

```ts
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function loadUser(id: string): Promise<Result<User, 'not-found' | 'network'>> {
  // ...
}

const result = await loadUser('1');
if (result.ok) {
  result.value;    // User
} else {
  result.error;    // 'not-found' | 'network'
}
```

利点:

- **呼び出し側がエラー処理を忘れられない**（`result.value` は絞り込まないと読めない）
- **どんなエラーがありうるかが型に書いてある**

欠点:

- 全部の関数でやると冗長。**境界（API 呼び出し・パース）だけ** Result にして、
  内部は素直に throw する、という使い分けが現実的です。

## 4. 並行処理の型

```ts
// すべて成功を待つ。1 つでも失敗すれば reject
const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
//     ^ User        ^ Post[]   ← タプルとして型が保たれる

// 成否をまとめて受け取る
const results = await Promise.allSettled([fetchUser(), fetchPosts()]);
for (const r of results) {
  if (r.status === 'fulfilled') r.value;   // 判別可能なユニオン！
  else r.reason;
}

// 最初に成功したものだけ
const first = await Promise.any([a(), b()]);
```

`Promise.all` に**配列リテラルを直接渡すとタプルとして推論される**のがポイントです。
一度変数に入れると `Promise<(User | Post[])[]>` になってしまうので注意。

## 5. よくある落とし穴

### (a) forEach の中の await は待たれない

```ts
items.forEach(async (item) => {
  await save(item);      // forEach は Promise を無視する
});
console.log('完了');      // まだ終わっていない
```

`for...of` を使うか、`Promise.all(items.map(save))` にします。
**`no-misused-promises` という ESLint ルールがこれを検出できます**（第23章）。

### (b) void を返す関数に async を渡す

```ts
type Handler = () => void;
const h: Handler = async () => { await save(); };   // 代入できてしまう
```

第6章でやった「void 期待には何を返してもよい」の副作用です。
呼び出し側は待てないので、**エラーが握りつぶされます**。イベントハンドラでは
`void doAsync()` と明示するか、内部で catch してください。

### (c) タイムアウトとキャンセル

`AbortController` を使います。型は `AbortSignal`。

```ts
async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(ms) });
}
```

---

## 演習

```bash
npm run check 16
```
