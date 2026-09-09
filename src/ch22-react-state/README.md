# 第22章 非同期データと状態管理の型設計

第9章「不正な状態を表現できなくする」を、実際の React アプリに適用します。

---

## 1. 非同期状態を型で表す

よく見る書き方:

```tsx
const [data, setData] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

3 つの独立した状態 = 2×2×2 = 8 通りの組み合わせがありますが、
**実際に意味があるのは 4 つだけ**です。残りはバグです
（loading なのに data もある、error も data もある、など）。

判別可能なユニオンにします。

```tsx
type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

const [state, setState] = useState<AsyncState<User>>({ status: 'idle' });
```

すると、レンダリングは網羅的に書けます。

```tsx
switch (state.status) {
  case 'idle':    return null;
  case 'loading': return <Spinner />;
  case 'success': return <UserCard user={state.data} />;   // data は必ずある
  case 'error':   return <ErrorBox error={state.error} />;
}
```

**`state.data!` のような `!`（non-null assertion）が消える**のが、この設計の実利です。

## 2. カスタムフックに閉じ込める

```tsx
function useAsync<T>(fetcher: () => Promise<T>, deps: React.DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    fetcher()
      .then((data) => { if (!cancelled) setState({ status: 'success', data }); })
      .catch((e: unknown) => {
        if (!cancelled) setState({ status: 'error', error: e instanceof Error ? e : new Error(String(e)) });
      });
    return () => { cancelled = true; };   // アンマウント後の setState を防ぐ
  }, deps);

  return state;
}
```

ポイント:

- **キャンセルフラグ**は非同期 UI の必須作法です（型では守れない）。
- `catch` の値は `unknown`。**必ず Error に正規化してから state に入れる**。

実務では TanStack Query などのライブラリを使いますが、**中でやっていることはこれ**です。

## 3. Context + useReducer の型付け

小〜中規模なら、これで十分に足ります。

```tsx
type Store = { state: State; dispatch: React.Dispatch<Action> };

const StoreContext = createContext<Store | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // useMemo しないと、Provider が再レンダリングされるたびに全消費者が再描画される
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('StoreProvider の中で使ってください');
  return store;
}
```

`dispatch` の型 `React.Dispatch<Action>` は `(action: Action) => void` です。
**Action が判別可能なユニオンなら、間違った action は書けません。**

## 4. 型安全な API クライアント

エンドポイントごとの「パスとレスポンス型の対応表」を 1 か所に持ち、そこから型を導きます。

```ts
type Endpoints = {
  '/users': User[];
  '/users/:id': User;
};

async function api<P extends keyof Endpoints>(path: P): Promise<Endpoints[P]> { /* ... */ }

const users = await api('/users');    // User[]
const user = await api('/user');      // エラー: そんなパスはない
```

**呼び出し側は型注釈を 1 文字も書かずに、正しい型を受け取れます。**
第13章のテンプレートリテラル型と組み合わせると、パスパラメータも型で要求できます。

## 5. 設計の指針

- **状態はできるだけ「導出」する。** 保持する状態が増えるほど、不整合の余地が増えます。
  `filteredItems` を state に持つのではなく、`items` と `filter` から毎回計算する。
- **サーバの状態とクライアントの状態を分ける。** 前者はキャッシュ、後者は UI の都合。
- **型で表現できない不変条件（キャンセル、順序）はコメントとテストで守る。**

---

## 演習

```bash
npm run check 22
```
