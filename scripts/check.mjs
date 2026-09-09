#!/usr/bin/env node
/**
 * 章ごとに「型チェック → テスト → Lint」をまとめて実行する採点スクリプト。
 *
 *   npm run check 03        -> 第3章
 *   npm run check 03 04     -> 第3章と第4章
 *   npm run check ex02      -> 外伝 第2章
 *   npm run check           -> 全章（進捗の確認用。未着手の章は当然赤くなる）
 */
import { readdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const DIR_PATTERN = /^(ch|ex)\d\d/;

const chapters = readdirSync(srcDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && DIR_PATTERN.test(d.name))
  .map((d) => d.name)
  .sort();

/** '3' -> 'ch03' / 'ex2' -> 'ex02' のように正規化する */
function normalize(arg) {
  const key = arg.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matched = /^([a-z]*)(\d+)$/.exec(key);
  if (!matched) return null;
  const prefix = matched[1] === '' ? 'ch' : matched[1];
  return prefix + matched[2].padStart(2, '0');
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const targets = args.length
  ? args.flatMap((a) => {
      const key = normalize(a);
      const hit = key === null ? [] : chapters.filter((c) => c.startsWith(key));
      if (hit.length === 0) {
        console.error(`該当する章がありません: ${a}`);
        console.error(`利用可能: ${chapters.join(', ')}`);
        process.exit(1);
      }
      return hit;
    })
  : chapters;

const label = args.length ? targets.join(', ') : '全章';
console.log(`\n▶ 対象: ${label}\n`);

// --- 1) 型チェック（tsc） ---
const tmpConfig = join(root, 'tsconfig.check.json');
writeFileSync(
  tmpConfig,
  JSON.stringify(
    {
      extends: './tsconfig.json',
      include: ['src/lib', ...targets.map((t) => `src/${t}`)],
    },
    null,
    2,
  ),
);

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const opts = { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' };

const tsc = spawnSync(npx, ['tsc', '-p', 'tsconfig.check.json'], opts);
rmSync(tmpConfig, { force: true });

if (tsc.status !== 0) {
  console.log('\n❌ 型チェックに失敗しました。まずコンパイルエラーを消しましょう。');
  console.log('   （型レベルの演習は「エラーが消えたら正解」です）\n');
  process.exit(tsc.status ?? 1);
}
console.log('\n✅ 型チェック OK');

// --- 2) 実行時テスト（vitest） ---
const hasTests = targets.some(
  (t) =>
    existsSync(join(srcDir, t)) &&
    readdirSync(join(srcDir, t)).some((f) => f.includes('.test.')),
);

if (hasTests) {
  const vitest = spawnSync(npx, ['vitest', 'run', ...targets.map((t) => `src/${t}/`)], opts);
  if (vitest.status !== 0) process.exit(vitest.status ?? 1);
} else {
  console.log('（この章に実行時テストはありません）');
}

// --- 3) Lint（エラーのみ。未実装スタブでも出る警告は無視する） ---
const eslint = spawnSync(npx, ['eslint', '--quiet', ...targets.map((t) => `src/${t}`)], opts);
if (eslint.status !== 0) {
  console.log('\n❌ Lint エラーがあります。');
  process.exit(eslint.status ?? 1);
}
console.log('\n✅ Lint OK');
console.log('🎉 この章は合格です。\n');
