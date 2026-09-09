// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Action, Button, Card, Greeting, SearchBox } from './exercise';

describe('19-1 Greeting', () => {
  it('通常', () => {
    render(<Greeting name="ken" />);
    expect(screen.getByText('ken さん、ようこそ')).toBeTruthy();
  });
  it('丁寧', () => {
    render(<Greeting name="ken" polite />);
    expect(screen.getByText('ken 様、ようこそ')).toBeTruthy();
  });
});

describe('19-2 Card', () => {
  it('タイトルと中身を出す', () => {
    render(<Card title="見出し">本文</Card>);
    expect(screen.getByRole('heading', { name: '見出し' })).toBeTruthy();
    expect(screen.getByText('本文')).toBeTruthy();
  });
});

describe('19-3 Button', () => {
  it('variant がクラスになる', () => {
    render(<Button variant="danger">押す</Button>);
    expect(screen.getByRole('button', { name: '押す' }).className).toBe('btn btn-danger');
  });
  it('既定は primary で、他の props も渡る', () => {
    render(<Button disabled>押せない</Button>);
    const button = screen.getByRole('button', { name: '押せない' }) as HTMLButtonElement;
    expect(button.className).toBe('btn btn-primary');
    expect(button.disabled).toBe(true);
  });
});

describe('19-4 SearchBox', () => {
  it('入力のたびに onSearch が呼ばれる', () => {
    const onSearch = vi.fn();
    render(<SearchBox onSearch={onSearch} />);
    fireEvent.change(screen.getByLabelText('search'), { target: { value: 'ts' } });
    expect(onSearch).toHaveBeenCalledWith('ts');
  });
});

describe('19-5 Action', () => {
  it('link', () => {
    render(<Action as="link" href="/next" label="行く" />);
    const link = screen.getByRole('link', { name: '行く' });
    expect(link.getAttribute('href')).toBe('/next');
  });
  it('button', () => {
    const onClick = vi.fn();
    render(<Action as="button" onClick={onClick} label="押す" />);
    fireEvent.click(screen.getByRole('button', { name: '押す' }));
    expect(onClick).toHaveBeenCalled();
  });
});
