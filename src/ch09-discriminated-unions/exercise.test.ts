import { describe, expect, it } from 'vitest';
import {
  area,
  assertIsDefined,
  EXHAUSTIVE_CONFIRMED,
  isStringArray,
  renderState,
  type Shape,
} from './exercise';

describe('9-2 area', () => {
  it('円', () => expect(area({ kind: 'circle', radius: 1 } as Shape)).toBeCloseTo(Math.PI));
  it('長方形', () => expect(area({ kind: 'rect', width: 2, height: 3 } as Shape)).toBe(6));
  it('三角形', () => expect(area({ kind: 'triangle', base: 4, height: 3 } as Shape)).toBe(6));
});

describe('9-4 renderState', () => {
  it('idle', () => expect(renderState({ status: 'idle' } as never)).toBe('待機中'));
  it('loading', () => expect(renderState({ status: 'loading' } as never)).toBe('読み込み中...'));
  it('success', () =>
    expect(renderState({ status: 'success', data: ['a', 'b', 'c'] } as never)).toBe('3 件'));
  it('error', () =>
    expect(renderState({ status: 'error', message: '失敗' } as never)).toBe('エラー: 失敗'));
});

describe('9-5 isStringArray', () => {
  it('文字列配列', () => expect(isStringArray(['a', 'b'])).toBe(true));
  it('空配列も true', () => expect(isStringArray([])).toBe(true));
  it('数値が混じると false', () => expect(isStringArray(['a', 1])).toBe(false));
  it('配列でなければ false', () => expect(isStringArray('a')).toBe(false));
});

describe('9-6 assertIsDefined', () => {
  it('値があれば何も起きない', () => expect(() => assertIsDefined(0)).not.toThrow());
  it('null なら投げる', () => expect(() => assertIsDefined(null)).toThrow());
  it('undefined なら投げる', () => expect(() => assertIsDefined(undefined)).toThrow());
});

describe('9-7 網羅性チェックの体験', () => {
  it('自分の目で確認した', () => expect(EXHAUSTIVE_CONFIRMED).toBe(true));
});
