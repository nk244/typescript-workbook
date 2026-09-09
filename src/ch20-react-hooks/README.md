# 第20章 hooks の型

---

## 1. useState — 推論と、推論できない場合

```tsx
const [count, setCount] = useState(0);           // number
const [name, setName] = useState('');            // string
const [user, setUser] = useState<User | null>(null);   // ← 型引数が必要
```

**初期値から推論できないときだけ型引数を書く**、が原則です。
`useState(null)` は `null` 型に推論されてしまい、あとから User を入れられません。

よくある間違い:

```tsx
const [items, setItems] = useState([]);          // never[] になる！
const [items, setItems] = useState<Item[]>([]);  // 正しい
```

### 更新関数の型

`setCount` は `Dispatch<SetStateAction<number>>`、つまり
「値そのもの」か「前の値から新しい値を作る関数」を受け取ります。

```tsx
setCount(5);
setCount((prev) => prev + 1);   // 前の値に依存するときは必ずこちら
```

## 2. useReducer — 判別可能なユニオンの本領

第9章のパターンがそのまま使えます。

```tsx
type State = { count: number };
type Action =
  | { type: 'increment'; by: number }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.by };
    case 'reset':
      return { count: 0 };
    default:
      return assertNever(action);   // 網羅性チェック
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment', by: 1 });   // 型が合わないとエラー
```

**reducer は純粋関数なので、React なしで単体テストできます。**
状態遷移の複雑さは reducer に押し込み、コンポーネントは表示に専念させる。
これが型と相性のよい設計です。

## 3. useRef — 2 つの顔

```tsx
// (a) DOM 参照。初期値 null、React が代入する
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// (b) 再レンダリングを起こさない可変の入れ物
const timerRef = useRef<number | undefined>(undefined);
timerRef.current = window.setTimeout(...);
```

`useRef<T>(null)` は `RefObject<T | null>`（current が読み取り専用扱い）、
`useRef<T | undefined>(undefined)` は `MutableRefObject`（自分で書き換える）になります。
**「DOM を掴む」のか「値を持ち回る」のかで書き方が変わる**と覚えてください。

## 4. useContext — undefined を型で殺す

素直に書くと、Provider の外で使ったときに `undefined` が返ります。

```tsx
const ThemeContext = createContext<Theme | undefined>(undefined);

export function useTheme(): Theme {
  const value = useContext(ThemeContext);
  if (value === undefined) {
    throw new Error('useTheme は ThemeProvider の中で使ってください');
  }
  return value;   // ここから先は Theme に確定
}
```

**この「カスタムフックで包んで undefined を潰す」形が定番**です。
使う側は毎回 null チェックしなくて済みます。

## 5. カスタムフックの戻り値

```tsx
// オブジェクトで返す（名前が固定される。項目が多いならこちら）
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return { on, toggle: () => setOn((v) => !v) };
}

// タプルで返す（呼び出し側で名前を付けられる。useState と同じ形）
function useToggle2(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v)] as const;
  //                                    ^^^^^^^^ これがないと (boolean | (() => void))[] になる
}
```

**タプルで返すなら `as const` が必須**です（第5章）。忘れると要素型がユニオンに潰れます。

## 6. useEffect の型で気をつけること

```tsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // クリーンアップは「関数」を返す
}, []);

useEffect(async () => {}, []);      // エラー: async 関数は Promise を返すのでダメ
```

`useEffect` のコールバックの戻り値型は `void | (() => void)` です。
`async` を直接渡せないのはこれが理由。中で即時実行関数を定義します。

---

## 演習

```bash
npm run check 20
```
