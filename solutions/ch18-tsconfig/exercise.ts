/* ============================================================
 * この章の演習は「どの設定が、どのバグを防ぐか」を対応づけるクイズです。
 * 各定数に、正しいコンパイラオプション名を入れてください。
 * ============================================================ */

export type CompilerOption =
  | 'strictNullChecks'
  | 'noImplicitAny'
  | 'noUncheckedIndexedAccess'
  | 'noImplicitOverride'
  | 'useUnknownInCatchVariables'
  | 'noFallthroughCasesInSwitch'
  | 'strictFunctionTypes'
  | 'strictPropertyInitialization'
  | 'verbatimModuleSyntax';

/* 18-1  const user: User = null; を防ぐのは？ */
export const Q1: CompilerOption = 'strictNullChecks';

/* 18-2  function f(x) { return x * 2; }  引数の型を書き忘れた。防ぐのは？ */
export const Q2: CompilerOption = 'noImplicitAny';

/* 18-3  const first = items[0]; first.toUpperCase();  空配列だと落ちる。防ぐのは？ */
export const Q3: CompilerOption = 'noUncheckedIndexedAccess';

/* 18-4  catch (e) { console.log(e.message); }  e が Error とは限らない。防ぐのは？ */
export const Q4: CompilerOption = 'useUnknownInCatchVariables';

/* 18-5  親のメソッドを上書きしたつもりが綴り違いだった。防ぐのは？ */
export const Q5: CompilerOption = 'noImplicitOverride';

/* 18-6  switch の break 忘れを防ぐのは？ */
export const Q6: CompilerOption = 'noFallthroughCasesInSwitch';

/* 18-7  class User { name: string; } を初期化しないまま使うのを防ぐのは？ */
export const Q7: CompilerOption = 'strictPropertyInitialization';

/* 18-8  型としてしか使っていない import が実行時に残るのを防ぐのは？ */
export const Q8: CompilerOption = 'verbatimModuleSyntax';

/* ============================================================
 * 18-9: 実際に設定を触ってみる
 * ルートの tsconfig.json で noUncheckedIndexedAccess を一時的に false にして、
 * この下の ?? '' が不要になる（= 型エラーが出なくなる）ことを確認してください。
 * 確認したら CONFIRMED を true にして、設定は必ず元に戻すこと。
 * ============================================================ */
export function firstChar(items: string[]): string {
  return items[0] ?? '';
}

export const CONFIRMED_INDEXED_ACCESS = true;
