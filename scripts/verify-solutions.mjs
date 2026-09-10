#!/usr/bin/env node
/**
 * 解答例が本当に全部通るかを検証する（カリキュラム保守用）。
 * src/ の演習ファイルを解答例で置き換えたコピーを verify-tmp/ に作り、そこで型チェック+テストを回す。
 *
 *   node scripts/verify-solutions.mjs           全章
 *   node scripts/verify-solutions.mjs 03 ex02   指定した章だけ
 *   node scripts/verify-solutions.mjs --keep    検証後も verify-tmp/ を残す（失敗の調査用）
 *
 * verify-tmp/ には解答例が展開される。終了時に必ず消すこと。
 * 残したままにすると、エディタの全文検索に解答例が引っかかってしまう。
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const verifyDir = join(root, 'verify-tmp');
const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const keep = process.argv.slice(2).includes('--keep');
const DIR_PATTERN = /^(ch|ex)\d\d/;

function normalize(arg) {
  const key = arg.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matched = /^([a-z]*)(\d+)$/.exec(key);
  if (!matched) return null;
  const prefix = matched[1] === '' ? 'ch' : matched[1];
  return prefix + matched[2].padStart(2, '0');
}

const keys = args.map(normalize).filter((k) => k !== null);

const chapters = readdirSync(join(root, 'src'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && DIR_PATTERN.test(d.name))
  .map((d) => d.name)
  .filter((c) => (keys.length === 0 ? true : keys.some((k) => c.startsWith(k))))
  .sort();

const tmpConfig = join(root, 'tsconfig.verify.json');

/** 一時ファイルの後始末。process.exit() でも走るように exit イベントに載せる */
function cleanup() {
  if (keep) return;
  rmSync(verifyDir, { recursive: true, force: true });
  rmSync(tmpConfig, { force: true });
}
process.on('exit', cleanup);

rmSync(verifyDir, { recursive: true, force: true });
mkdirSync(verifyDir, { recursive: true });
cpSync(join(root, 'src', 'lib'), join(verifyDir, 'lib'), { recursive: true });

for (const ch of chapters) {
  const from = join(root, 'src', ch);
  const to = join(verifyDir, ch);
  cpSync(from, to, { recursive: true, filter: (s) => !s.endsWith('README.md') });
  const sol = join(root, 'solutions', ch);
  if (existsSync(sol)) cpSync(sol, to, { recursive: true });
}

writeFileSync(
  tmpConfig,
  JSON.stringify({ extends: './tsconfig.json', include: ['verify-tmp'] }, null, 2),
);

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const opts = { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' };

const tsc = spawnSync(npx, ['tsc', '-p', 'tsconfig.verify.json'], opts);
if (tsc.status !== 0) {
  console.log('\n❌ 解答例の型チェックに失敗');
  console.log('   調べるときは --keep を付けて再実行すると verify-tmp/ が残ります。');
  process.exit(1);
}
console.log('✅ 解答例の型チェック OK');

const vitest = spawnSync(
  npx,
  ['vitest', 'run', '--passWithNoTests', '--config', 'scripts/vitest.verify.config.ts'],
  opts,
);
process.exit(vitest.status ?? 1);
