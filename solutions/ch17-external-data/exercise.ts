import type { Equal, Expect } from '../lib/type-test';

// 17-1
export type User = { id: number; name: string };

export function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

// 17-2
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function safeJsonParse(text: string): Result<unknown, 'invalid-json'> {
  try {
    // JSON.parse の戻りは any。unknown で受け直すのが肝
    const value: unknown = JSON.parse(text);
    return { ok: true, value };
  } catch {
    return { ok: false, error: 'invalid-json' };
  }
}

// 17-3
export type Validator<T> = {
  parse: (value: unknown) => Result<T, string>;
};

// Validator<T> から T を取り出す。zod の z.infer と同じ発想
export type Infer<V> = V extends Validator<infer T> ? T : never;

export function typeNameOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/** プリミティブ検査を作る小さなヘルパー */
function primitive<T>(name: string, check: (value: unknown) => value is T): Validator<T> {
  return {
    parse: (value) =>
      check(value)
        ? { ok: true, value }
        : { ok: false, error: `expected ${name} but got ${typeNameOf(value)}` },
  };
}

export const v = {
  string(): Validator<string> {
    return primitive('string', (value): value is string => typeof value === 'string');
  },

  number(): Validator<number> {
    return primitive('number', (value): value is number => typeof value === 'number');
  },

  boolean(): Validator<boolean> {
    return primitive('boolean', (value): value is boolean => typeof value === 'boolean');
  },

  array<T>(item: Validator<T>): Validator<T[]> {
    return {
      parse: (value) => {
        if (!Array.isArray(value)) {
          return { ok: false, error: `expected array but got ${typeNameOf(value)}` };
        }
        const out: T[] = [];
        for (const [index, element] of value.entries()) {
          const result = item.parse(element);
          if (!result.ok) return { ok: false, error: `[${index}] ${result.error}` };
          out.push(result.value);
        }
        return { ok: true, value: out };
      },
    };
  },

  object<S extends Record<string, Validator<unknown>>>(
    shape: S,
  ): Validator<{ [K in keyof S]: Infer<S[K]> }> {
    type Out = { [K in keyof S]: Infer<S[K]> };
    return {
      parse: (value) => {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return { ok: false, error: `expected object but got ${typeNameOf(value)}` };
        }
        const source = value as Record<string, unknown>;
        const out = {} as Out;
        for (const key of Object.keys(shape)) {
          const validator = shape[key];
          if (validator === undefined) continue;
          const result = validator.parse(source[key]);
          if (!result.ok) return { ok: false, error: `${key}: ${result.error}` };
          out[key as keyof Out] = result.value as Out[keyof Out];
        }
        return { ok: true, value: out };
      },
    };
  },
};

// 17-4
export const userSchema = v.object({
  id: v.number(),
  name: v.string(),
  tags: v.array(v.string()),
});

export type InferredUser = Infer<typeof userSchema>;

export type _t1 = Expect<Equal<InferredUser, { id: number; name: string; tags: string[] }>>;

// 17-5
export function parseUser(text: string): Result<InferredUser, string> {
  const parsed = safeJsonParse(text);
  if (!parsed.ok) return parsed;
  return userSchema.parse(parsed.value);
}
