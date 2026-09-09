import type { Equal, Expect } from '../lib/type-test';

// 19-1
export type GreetingProps = {
  name: string;
  polite?: boolean;
};

// React.FC は使わず、props を分割代入して既定値を与えるのが現在の標準形
export function Greeting({ name, polite = false }: GreetingProps) {
  return <p>{polite ? `${name} 様、ようこそ` : `${name} さん、ようこそ`}</p>;
}

// 19-2
export type CardProps = {
  title: string;
  // 文字列・数値・要素・配列・null をすべて許すのが ReactNode
  children?: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

// 19-3
// ComponentProps<'button'> で button が受け取れる props をすべて引き継ぐ
export type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'danger';
};

export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant}`} {...rest} />;
}

// 19-4
export type SearchBoxProps = {
  // DOM のイベント型を props に出さない。「何が起きたか」だけを渡す
  onSearch: (query: string) => void;
};

export function SearchBox({ onSearch }: SearchBoxProps) {
  // e の型は JSX 側から推論されるので注釈は不要
  return <input aria-label="search" onChange={(e) => onSearch(e.target.value)} />;
}

export type _t1 = Expect<Equal<SearchBoxProps, { onSearch: (query: string) => void }>>;

// 19-5
export type ActionProps = { label: string } & (
  | { as: 'link'; href: string }
  | { as: 'button'; onClick: () => void }
);

export function Action(props: ActionProps) {
  // as で絞り込めば、href / onClick が存在することが型で保証される
  if (props.as === 'link') {
    return <a href={props.href}>{props.label}</a>;
  }
  return <button onClick={props.onClick}>{props.label}</button>;
}
