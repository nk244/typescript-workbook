import type { Equal, Expect } from '../lib/type-test';

/* ============================================================
 * 演習 21-1: ジェネリックなリスト
 * List は items / keyOf / renderItem を受け取り、<ul><li>… を返します。
 * 使う側で renderItem の引数に型注釈を書かなくて済むようにすること。
 * ============================================================ */
export type ListProps<T> = {
  // TODO
};

export function List<T>(props: ListProps<T>) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 21-2: value と onChange の型を結びつける
 * RadioGroup は options / value / onChange / labelOf を受け取り、
 * 各 option を <button data-selected="true|false"> として並べます。
 * ボタンのテキストは labelOf(option)。押すと onChange(option)。
 * ============================================================ */
export type RadioGroupProps<T> = {
  // TODO
};

export function RadioGroup<T>(props: RadioGroupProps<T>) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 21-3: ポリモーフィックコンポーネント
 * Text は as で出力タグを切り替えられます（既定は 'span'）。
 * as に応じた props（<a> なら href など）を受け付けること。
 * ============================================================ */
export type TextProps<E extends React.ElementType> = {
  // TODO
};

export function Text<E extends React.ElementType = 'span'>(props: TextProps<E>) {
  void props;
  // TODO: JSX を返す
  return null;
}

/* ============================================================
 * 演習 21-4: キーと値を結びつけるフォームフィールド
 * name に渡したキーに対応する型の値だけを value に許すようにしてください。
 * 実装は <input aria-label={String(name)} value={String(value)} onChange=... />。
 * onChange は (name, 入力された文字列) を渡すこと。
 * ============================================================ */
export type FieldProps<T, K extends keyof T> = {
  // TODO
};

export function Field<T, K extends keyof T>(props: FieldProps<T, K>) {
  void props;
  // TODO: JSX を返す
  return null;
}

// 型が正しく結びついていれば、次の型テストが通る
type Profile = { name: string; age: number };
export type _t1 = Expect<Equal<FieldProps<Profile, 'name'>['value'], string>>;
export type _t2 = Expect<Equal<FieldProps<Profile, 'age'>['value'], number>>;
