# 第19章 React + TypeScript の基礎

ここから React です。**React 固有の型の付け方**に集中します。
（React そのものの使い方は既知として進めますが、必要な範囲は説明します）

---

## 1. コンポーネントの型付け — 結論から

```tsx
type Props = {
  title: string;
  count?: number;
  children?: React.ReactNode;
};

export function Card({ title, count = 0, children }: Props) {
  return (
    <section>
      <h2>{title}</h2>
      <span>{count}</span>
      {children}
    </section>
  );
}
```

**これが現在の標準形です。** ポイント:

- **`React.FC` は使わなくてよい。** 昔は `children` を自動で足してくれる利点がありましたが、
  React 18 でその挙動はなくなりました。今は「ただの関数」として書くのが素直です。
- **props は `type` で定義して分割代入。** デフォルト値は分割代入時に書く。
- **戻り値の型は書かなくてよい**（JSX から推論されます）。

## 2. children の型

| 型 | 意味 |
| --- | --- |
| `React.ReactNode` | **ほぼ常にこれ**。文字列・数値・要素・配列・null すべて |
| `React.ReactElement` | JSX 要素だけ（文字列は不可） |
| `(value: T) => React.ReactNode` | render props |

## 3. イベントハンドラの型

型を手で書く前に、**まず JSX の上でホバーして推論を見る**のが速いです。

```tsx
<button onClick={(e) => {}} />       // e は React.MouseEvent<HTMLButtonElement> と推論される
<input onChange={(e) => {}} />       // e は React.ChangeEvent<HTMLInputElement>
<form onSubmit={(e) => {}} />        // e は React.FormEvent<HTMLFormElement>
```

props としてハンドラを受け取るときは自分で書く必要があります。

```tsx
type Props = {
  onSelect: (id: string) => void;                       // ← できるだけこの形（DOM に依存しない）
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // DOM イベントをそのまま渡すなら
};
```

**指針: props のコールバックは「何が起きたか」を表す引数にする。**
`onChange: (e: ChangeEvent) => void` より `onChange: (value: string) => void` のほうが、
使う側も実装側も楽になります。

## 4. HTML 要素の props を引き継ぐ

自作ボタンに `className` や `disabled` を全部書き直すのは無駄です。

```tsx
type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'danger';
};

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant}`} {...rest} />;
}
```

`React.ComponentProps<'button'>` で `<button>` が受け取れる props 全部が手に入ります。
既存コンポーネントの props も `React.ComponentProps<typeof Card>` で取れます。

## 5. 条件付き props — 判別可能なユニオン（第9章の応用）

「`href` があるときはリンク、ないときはボタン」のような**排他的な props** は、
オプショナルの重ね合わせではなくユニオンで表します。

```tsx
type Props =
  | { as: 'link'; href: string }
  | { as: 'button'; onClick: () => void };

function Action(props: Props) {
  if (props.as === 'link') return <a href={props.href}>行く</a>;
  return <button onClick={props.onClick}>押す</button>;
}
```

`<Action as="link" />` は「href が足りない」とコンパイル時に怒られます。
**「不正な状態を表現できなくする」を UI にも適用する**わけです。

## 6. key と配列

```tsx
{items.map((item) => <Row key={item.id} item={item} />)}
```

`key` は React が管理する特別な props で、型としては `string | number` です。
**index を key にしない**（並び替えで壊れる）のは型では守れないので、
ESLint や規約で守ります。

---

## 演習

この章の演習は `exercise.tsx` です。テストは実際にコンポーネントを描画して検証します。

```bash
npm run check 19
```
