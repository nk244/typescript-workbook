import { describe, expect, it } from 'vitest';
import { buildPath } from './exercise';

describe('13-7 buildPath', () => {
  it('1 つ埋める', () => {
    expect(buildPath('/users/:userId', { userId: '42' } as never)).toBe('/users/42');
  });
  it('2 つ埋める', () => {
    expect(
      buildPath('/users/:userId/posts/:postId', { userId: '1', postId: '2' } as never),
    ).toBe('/users/1/posts/2');
  });
  it('パラメータなし', () => {
    expect(buildPath('/health', {} as never)).toBe('/health');
  });
});
