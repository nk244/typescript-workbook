// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Field, List, RadioGroup, Text } from './exercise';

type User = { id: number; name: string };
const users: User[] = [
  { id: 1, name: 'ken' },
  { id: 2, name: 'yui' },
];

describe('21-1 List', () => {
  it('要素を並べる', () => {
    render(
      <List
        items={users}
        keyOf={(u) => u.id}
        renderItem={(u) => <b>{u.name}</b>}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('ken')).toBeTruthy();
  });
});

describe('21-2 RadioGroup', () => {
  it('選択状態を表示し、押すと通知する', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        options={users}
        value={users[0]!}
        onChange={onChange}
        labelOf={(u) => u.name}
      />,
    );
    expect(screen.getByRole('button', { name: 'ken' }).dataset.selected).toBe('true');
    expect(screen.getByRole('button', { name: 'yui' }).dataset.selected).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'yui' }));
    expect(onChange).toHaveBeenCalledWith(users[1]);
  });
});

describe('21-3 Text', () => {
  it('既定は span', () => {
    const { container } = render(<Text>ふつう</Text>);
    expect(container.querySelector('span')?.textContent).toBe('ふつう');
  });
  it('as でタグを変えられる', () => {
    render(
      <Text as="a" href="/next">
        リンク
      </Text>,
    );
    expect(screen.getByRole('link', { name: 'リンク' }).getAttribute('href')).toBe('/next');
  });
});

describe('21-4 Field', () => {
  it('キーと値が結びつく', () => {
    const onChange = vi.fn();
    render(<Field<{ name: string; age: number }, 'name'> name="name" value="ken" onChange={onChange} />);
    const input = screen.getByLabelText('name');
    expect((input as HTMLInputElement).value).toBe('ken');
    fireEvent.change(input, { target: { value: 'yui' } });
    expect(onChange).toHaveBeenCalledWith('name', 'yui');
  });
});
