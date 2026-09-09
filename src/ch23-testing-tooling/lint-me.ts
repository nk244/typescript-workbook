/**
 * 演習 23-5: このファイルの Lint エラーをすべて直してください。
 *
 *   npx eslint src/ch23-testing-tooling/lint-me.ts
 *
 * 直し方が分からないルールは、エラーメッセージのルール名で検索すること。
 * 「なぜそれが危険なのか」を理解してから直してください。
 */

export async function save(id: number): Promise<void> {
  void id;
}

// (1) Promise を待っていない
export function saveAll(ids: number[]): void {
  ids.forEach((id) => {
    save(id);
  });
}

// (2) Promise をそのまま条件式に使っている（Promise は常に truthy）
export async function loadCount(): Promise<number> {
  if (save(1)) return 1;
  return 0;
}

// (3) any が紛れ込んでいる
export function parseConfig(raw: any): string {
  return raw.name;
}
