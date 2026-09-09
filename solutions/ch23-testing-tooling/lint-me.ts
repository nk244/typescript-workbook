/**
 * 演習 23-5 解答例
 */

export async function save(id: number): Promise<void> {
  void id;
}

// (1) forEach は Promise を無視するので、await できる形に直す。
//     直列でよければ for...of、並行でよければ Promise.all
export async function saveAll(ids: number[]): Promise<void> {
  await Promise.all(ids.map((id) => save(id)));
}

// (2) Promise は常に truthy なので、条件式に置いても意味がない。await してから判断する
export async function loadCount(): Promise<number> {
  await save(1);
  return 1;
}

// (3) any ではなく unknown で受け、検査してから使う
export function parseConfig(raw: unknown): string {
  if (typeof raw === 'object' && raw !== null && 'name' in raw && typeof raw.name === 'string') {
    return raw.name;
  }
  throw new Error('name がありません');
}
