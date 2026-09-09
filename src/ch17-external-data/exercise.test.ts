import { describe, expect, it } from 'vitest';
import { isUser, parseUser, safeJsonParse, userSchema, v } from './exercise';

describe('17-1 isUser', () => {
  it('正しい形', () => expect(isUser({ id: 1, name: 'ken' })).toBe(true));
  it('型が違う', () => expect(isUser({ id: '1', name: 'ken' })).toBe(false));
  it('キーがない', () => expect(isUser({ id: 1 })).toBe(false));
  it('オブジェクトでない', () => {
    expect(isUser(null)).toBe(false);
    expect(isUser('x')).toBe(false);
    expect(isUser([])).toBe(false);
  });
});

describe('17-2 safeJsonParse', () => {
  it('成功', () => expect(safeJsonParse('{"a":1}')).toEqual({ ok: true, value: { a: 1 } }));
  it('失敗', () => expect(safeJsonParse('{oops')).toEqual({ ok: false, error: 'invalid-json' }));
});

describe('17-3 バリデータ', () => {
  it('string', () => {
    expect(v.string().parse('a')).toEqual({ ok: true, value: 'a' });
    expect(v.string().parse(1)).toEqual({ ok: false, error: 'expected string but got number' });
  });
  it('number', () => {
    expect(v.number().parse(1)).toEqual({ ok: true, value: 1 });
    expect(v.number().parse(null)).toEqual({ ok: false, error: 'expected number but got null' });
  });
  it('boolean', () => {
    expect(v.boolean().parse(true)).toEqual({ ok: true, value: true });
  });
  it('array', () => {
    expect(v.array(v.string()).parse(['a', 'b'])).toEqual({ ok: true, value: ['a', 'b'] });
    expect(v.array(v.string()).parse('a')).toEqual({
      ok: false,
      error: 'expected array but got string',
    });
    expect(v.array(v.string()).parse(['a', 1])).toEqual({
      ok: false,
      error: '[1] expected string but got number',
    });
  });
  it('object', () => {
    const schema = v.object({ id: v.number(), name: v.string() });
    expect(schema.parse({ id: 1, name: 'ken' })).toEqual({
      ok: true,
      value: { id: 1, name: 'ken' },
    });
    expect(schema.parse({ id: 1 })).toEqual({
      ok: false,
      error: 'name: expected string but got undefined',
    });
    expect(schema.parse({ id: '1', name: 'ken' })).toEqual({
      ok: false,
      error: 'id: expected number but got string',
    });
    expect(schema.parse(null)).toEqual({ ok: false, error: 'expected object but got null' });
  });
  it('入れ子', () => {
    const schema = v.object({ tags: v.array(v.string()) });
    expect(schema.parse({ tags: ['a'] })).toEqual({ ok: true, value: { tags: ['a'] } });
    expect(schema.parse({ tags: [1] })).toEqual({
      ok: false,
      error: 'tags: [0] expected string but got number',
    });
  });
});

describe('17-4/17-5 実用', () => {
  it('スキーマが組めている', () => {
    expect(userSchema.parse({ id: 1, name: 'ken', tags: [] }).ok).toBe(true);
  });
  it('正しい JSON', () => {
    expect(parseUser('{"id":1,"name":"ken","tags":["a"]}')).toEqual({
      ok: true,
      value: { id: 1, name: 'ken', tags: ['a'] },
    });
  });
  it('壊れた JSON', () => {
    expect(parseUser('{oops')).toEqual({ ok: false, error: 'invalid-json' });
  });
  it('形が違う', () => {
    expect(parseUser('{"id":"1","name":"ken","tags":[]}')).toEqual({
      ok: false,
      error: 'id: expected number but got string',
    });
  });
});
