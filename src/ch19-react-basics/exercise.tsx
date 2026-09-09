import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 19-1: props に型を付ける
 * Greeting は name（必須）と polite（省略可、既定 false）を受け取り、
 *   polite が true  -> '<name> 様、ようこそ'
 *   polite が false -> '<name> さん、ようこそ'
 * を <p> で表示します。React.FC は使わないこと。
 * ============================================================ */
export type GreetingProps = {
  // TODO
};

export function Greeting(props: GreetingProps) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 19-2: children を受け取る
 * Card は title と children を受け取り、
 *   <section><h2>{title}</h2>{children}</section>
 * を返します。children の型は何にすべきか考えること。
 * ============================================================ */
export type CardProps = {
  // TODO
};

export function Card(props: CardProps) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 19-3: HTML 要素の props を引き継ぐ
 * Button は <button> が受け取れる props すべてに加えて
 * variant?: 'primary' | 'danger' を受け取ります。
 *   - className は `btn btn-<variant>` にする（既定は primary）
 *   - 残りの props はそのまま <button> に渡す
 * ============================================================ */
export type ButtonProps = {
  // TODO
};

export function Button(props: ButtonProps) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 19-4: イベントハンドラを props で受け取る
 * SearchBox は onSearch: (query: string) => void を受け取り、
 * input の値が変わるたびに呼び出します。
 * DOM のイベント型を props に漏らさないこと。
 * input には aria-label="search" を付けてください。
 * ============================================================ */
export type SearchBoxProps = {
  // TODO
};

export function SearchBox(props: SearchBoxProps) {
  void props;
  // TODO: JSX を返す
  return null;
}

export type _t1 = Expect<Equal<SearchBoxProps, { onSearch: (query: string) => void }>>;

/* ============================================================
 * 演習 19-5: 条件付き props（判別可能なユニオン）
 * Action は label を必ず受け取り、
 *   as: 'link'   のとき href が必須 -> <a href={href}>{label}</a>
 *   as: 'button' のとき onClick が必須 -> <button onClick={onClick}>{label}</button>
 * を返します。
 * ============================================================ */
export type ActionProps = {
  // TODO: 判別可能なユニオンにする
};

export function Action(props: ActionProps) {
  void props;
  // TODO: JSX を返す
  return null;
}
