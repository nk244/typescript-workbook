import type { Equal, Expect } from '../lib/type-test';

// 21-1
export type ListProps<T> = {
  items: readonly T[];
  keyOf: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
};

// function 宣言で書けば .tsx でも <T> が JSX と誤解されない
export function List<T>({ items, keyOf, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyOf(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// 21-2
export type RadioGroupProps<T> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelOf: (option: T) => string;
};

export function RadioGroup<T>({ options, value, onChange, labelOf }: RadioGroupProps<T>) {
  return (
    <div>
      {options.map((option) => (
        <button
          key={labelOf(option)}
          data-selected={option === value}
          onClick={() => onChange(option)}
        >
          {labelOf(option)}
        </button>
      ))}
    </div>
  );
}

// 21-3
export type TextProps<E extends React.ElementType> = {
  as?: E;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children'>;

export function Text<E extends React.ElementType = 'span'>({
  as,
  children,
  ...rest
}: TextProps<E>) {
  const Component = as ?? 'span';
  return <Component {...rest}>{children}</Component>;
}

// 21-4
export type FieldProps<T, K extends keyof T> = {
  name: K;
  // T[K] にすることで「name に渡したキーの型」と value が一致することを強制できる
  value: T[K];
  onChange: (name: K, value: string) => void;
};

export function Field<T, K extends keyof T>({ name, value, onChange }: FieldProps<T, K>) {
  return (
    <input
      aria-label={String(name)}
      value={String(value)}
      onChange={(e) => onChange(name, e.target.value)}
    />
  );
}

type Profile = { name: string; age: number };
export type _t1 = Expect<Equal<FieldProps<Profile, 'name'>['value'], string>>;
export type _t2 = Expect<Equal<FieldProps<Profile, 'age'>['value'], number>>;
