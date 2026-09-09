# 第21章 ジェネリックコンポーネントと高度な props

「どんな型のデータでも扱える、けれど型は失われない」コンポーネントの作り方です。
ライブラリを作るとき、社内の共通 UI を作るときに効きます。

---

## 1. ジェネリックコンポーネント

関数コンポーネントはただの関数なので、型引数を持てます。

```tsx
type ListProps<T> = {
  items: readonly T[];
  keyOf: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
};

export function List<T>({ items, keyOf, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyOf(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
```

使う側では **T が呼び出しごとに推論されます**。

```tsx
<List
  items={users}                       // User[] を渡すと
  keyOf={(u) => u.id}                 // u は User と推論される
  renderItem={(u) => <b>{u.name}</b>} // ここでも User
/>
```

`renderItem` の引数に型注釈を書かなくていい。**これがジェネリックコンポーネントの価値**です。

### アロー関数で書くときの注意（.tsx 特有）

```tsx
const List = <T>(props: ListProps<T>) => {};      // エラー: JSX タグと解釈される
const List = <T,>(props: ListProps<T>) => {};     // カンマを入れて回避
const List = <T extends unknown>(props: ListProps<T>) => {};  // または制約を書く
```

`.tsx` では `<T>` が JSX の開始タグに見えてしまいます。**`function` 宣言で書けばこの問題は起きません。**

## 2. 関連する props を型で結びつける

```tsx
type SelectProps<T> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelOf: (option: T) => string;
};
```

`value` と `onChange` と `options` の型が **必ず一致する**ことをコンパイラが保証します。
`string` で決め打ちするより、使い回しが効いて安全です。

## 3. ポリモーフィックコンポーネント（as prop）

「見た目は同じだが、出力するタグを変えたい」ときのパターンです。

```tsx
type TextProps<E extends React.ElementType> = {
  as?: E;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>;

export function Text<E extends React.ElementType = 'span'>({
  as,
  ...rest
}: TextProps<E>) {
  const Component = as ?? 'span';
  return <Component {...rest} />;
}
```

```tsx
<Text>ふつうの文字</Text>
<Text as="a" href="/next">リンク</Text>     // href が使える
<Text as="button" href="/next" />           // エラー: button に href はない
```

`as` の値によって、**受け付ける props が切り替わります**。
実装はやや複雑ですが、UI ライブラリ（MUI、Chakra など）の中身はこれです。

## 4. キーと値を結びつけるフォーム

第8章の `K extends keyof T` の応用です。

```tsx
type FieldProps<T, K extends keyof T> = {
  name: K;
  value: T[K];
  onChange: (name: K, value: T[K]) => void;
};
```

`name="age"` を渡したら `value` は `number` でなければならない、と型で強制できます。
react-hook-form のようなライブラリは、これをさらに推し進めて
**ネストしたパス（'user.address.city'）まで型で追跡**します（第13章のテンプレートリテラル型）。

## 5. ref の扱い（React 19 での変化）

React 18 までは `forwardRef` が必要でした。

```tsx
const Input = forwardRef<HTMLInputElement, Props>((props, ref) => <input ref={ref} {...props} />);
```

**React 19 からは `ref` がふつうの props になりました。**

```tsx
function Input({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}
```

既存コードでは `forwardRef` を目にするので、両方知っておく必要があります。

---

## 演習

```bash
npm run check 21
```
