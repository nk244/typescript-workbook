import { describe, expect, it } from 'vitest';
import { AdminQuery, addDistance, Box, close, connect, meters, QueryBuilder, send, useBox } from './exercise';

describe('ex04-1 接続', () => {
  it('送れる', () => {
    const conn = connect();
    expect(send(conn, 'a')).toEqual(['a']);
    expect(close(conn).state).toBe('closed');
  });
});

describe('ex04-2 QueryBuilder', () => {
  it('組み立てられる', () => {
    const sql = new QueryBuilder().set('table', 'users').set('limit', '10').build();
    expect(sql).toBe('table=users limit=10');
  });
});

describe('ex04-3 polymorphic this', () => {
  it('継承先でもチェーンできる', () => {
    const q = new AdminQuery().where('age>20').onlyAdmins();
    expect(q.conditions).toEqual(['age>20', 'role=admin']);
  });
});

describe('ex04-4 Box', () => {
  it('アサーション後に使える', () => {
    expect(useBox()).toBe('HELLO');
  });
  it('未ロードなら投げる', () => {
    const box: Box<string> = new Box();
    expect(() => box.assertLoaded()).toThrow();
  });
});

describe('ex04-5 Meters', () => {
  it('足せる', () => expect(addDistance(meters(1), meters(2))).toBe(3));
});
