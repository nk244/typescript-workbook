# 第24章 総合演習 — 型安全なタスク管理

最終章です。これまでの 23 章で学んだものを、1 つのアプリに組み上げます。
**新しい文法は出てきません。** 使いどころを自分で判断できるかを試す章です。

---

## 課題

小さなタスク管理アプリを、次の 3 層に分けて作ります。

```
domain.ts   … 型とビジネスロジック（React に依存しない）
parse.ts    … 外部データ（JSON）を検証してドメインに取り込む
app.tsx     … React の UI
```

**この分割自体が設計の練習**です。ロジックを React の外に出しておくと、
テストが速く、書きやすく、壊れにくくなります。

## 仕様

### ドメイン（domain.ts）

- `TaskId` は **ブランド型**（第14章）。ただの `string` と取り違えられないこと
- `Priority` は `'low' | 'normal' | 'high'`
- `Task` は `{ id, title, priority, done, createdAt }`
- `TaskAction` は**判別可能なユニオン**（第9章）
  - `add`（title と priority）/ `toggle`（id）/ `remove`（id）/ `setFilter`（filter）/ `clearDone`
- `TaskState` は `{ tasks, filter, nextId }`
- `taskReducer` は**純粋関数**。元の state を破壊しないこと。**網羅性チェックを入れること**
- `visibleTasks(state)` は filter を適用した配列を返す（`all` / `active` / `done`）
- `sortByPriority(tasks)` は high → normal → low の順に並べた**新しい配列**を返す
  （同じ優先度なら元の順序を保つ = 安定ソート）

### 取り込み（parse.ts）

- `parseTasks(input: unknown)` は `Result<Task[], string>` を返す（第16・17章）
- 配列でなければ `'expected array'`
- 各要素が Task の形でなければ `'invalid task at N'`（N は 0 始まりの添字）
- `createdAt` は ISO 文字列で入ってくるので `Date` に変換すること

### UI（app.tsx）

- `aria-label="new-task"` の入力欄と「追加」ボタン
- 追加時の優先度は `aria-label="priority"` の select から取る（既定 `normal`）
- タスクは `<li>` で表示。タイトルをクリックすると done を反転
- `<li>` には `data-priority` に優先度を入れる
- done のタスクの `<li>` に `data-done="true"`
- フィルタボタン（`すべて` / `未完了` / `完了`）
- 残り件数を `<p data-testid="summary">残り N 件</p>` で表示

## 進め方

1. `exercise.test.ts` / `exercise.test.tsx` を先に読む（**テストが仕様の詳細**）
2. `domain.ts` → `parse.ts` → `app.tsx` の順に埋める
3. `npm run check 24`

## 自己採点のポイント

テストが緑になったら、次を自問してください。

- `as` を何回使ったか？（ブランド型の変換以外で使っていたら、絞り込みで書けないか考える）
- `!`（non-null assertion）を使ったか？（使ったなら、その型設計は正しいか）
- `any` は 0 回か？
- reducer に新しいアクションを 1 つ足したとき、**コンパイラは直すべき場所を教えてくれるか？**
  （教えてくれないなら網羅性チェックが抜けています）

最後の項目がいちばん大事です。**型は「今動くこと」ではなく「変更したときに壊れないこと」のために書きます。**
