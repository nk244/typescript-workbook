#!/usr/bin/env node
/**
 * TypeScript技術認定試験の模試。
 * 本番と同じ「四肢択一 35 問 / 60 分 / 正答率 70% で合格」で出題する。
 *
 *   npm run exam                    本番形式（35問 60分）
 *   npm run exam -- --count 10      問題数を指定して短く回す
 *   npm run exam -- --field class   分野を絞って練習（時間制限なし）
 *   npm run exam -- --review        過去に間違えた問題だけ復習
 *   npm run exam -- --stats         これまでの成績の推移
 *   npm run exam -- --validate      問題バンクの検査（CI 用。出題はしない）
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const questionsDir = join(root, 'exam', 'questions');
const historyPath = join(root, 'exam', 'history.json');

const EXAM_COUNT = 35;
const EXAM_MINUTES = 60;
const PASS_RATE = 0.7;

const c = {
  reset: '[0m',
  bold: '[1m',
  dim: '[2m',
  green: '[32m',
  red: '[31m',
  cyan: '[36m',
};
const green = (s) => c.green + s + c.reset;
const red = (s) => c.red + s + c.reset;
const bold = (s) => c.bold + s + c.reset;
const dim = (s) => c.dim + s + c.reset;

// --- 引数 ---
const argv = process.argv.slice(2);
const hasFlag = (name) => argv.includes('--' + name);
const flagValue = (name) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? null : (argv[i + 1] ?? null);
};

// --- 問題バンクの読み込みと検査 ---
function loadBank() {
  const files = readdirSync(questionsDir).filter((f) => f.endsWith('.json')).sort();
  const fields = [];
  const problems = [];
  const seen = new Set();

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(questionsDir, file), 'utf8'));
    const where = (id) => `${file} の ${id}`;

    if (typeof raw.field !== 'string' || typeof raw.label !== 'string') {
      problems.push(`${file}: field と label が要る`);
      continue;
    }
    if (!Array.isArray(raw.questions) || raw.questions.length === 0) {
      problems.push(`${file}: questions が空`);
      continue;
    }

    for (const q of raw.questions) {
      if (typeof q.id !== 'string') problems.push(`${file}: id の無い問題がある`);
      else if (seen.has(q.id)) problems.push(`${where(q.id)}: id が重複している`);
      else seen.add(q.id);

      if (typeof q.question !== 'string' || q.question.trim() === '')
        problems.push(`${where(q.id)}: question が空`);
      if (!Array.isArray(q.choices) || q.choices.length !== 4)
        problems.push(`${where(q.id)}: choices は 4 つ（四肢択一）`);
      else if (new Set(q.choices).size !== 4)
        problems.push(`${where(q.id)}: 選択肢が重複している`);
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
        problems.push(`${where(q.id)}: answer は 0〜3`);
      if (typeof q.explanation !== 'string' || q.explanation.trim() === '')
        problems.push(`${where(q.id)}: explanation が空`);
      if (typeof q.ref !== 'string') problems.push(`${where(q.id)}: ref（参照する章）が無い`);

      q.field = raw.field;
      q.fieldLabel = raw.label;
    }

    fields.push({ key: raw.field, label: raw.label, questions: raw.questions });
  }

  return { fields, problems };
}

const { fields, problems } = loadBank();
const allQuestions = fields.flatMap((f) => f.questions);

if (hasFlag('validate')) {
  if (problems.length > 0) {
    console.log(red(`\n❌ 問題バンクに ${problems.length} 件の不備があります。\n`));
    for (const p of problems) console.log('   - ' + p);
    process.exit(1);
  }
  console.log(green(`\n✅ 問題バンク OK — ${fields.length} 分野 / ${allQuestions.length} 問\n`));
  for (const f of fields) console.log(`   ${f.label.padEnd(12, '　')} ${f.questions.length} 問`);
  console.log('');
  process.exit(0);
}

if (problems.length > 0) {
  console.log(red('\n❌ 問題バンクが壊れています。npm run exam -- --validate で詳細を確認してください。\n'));
  process.exit(1);
}

// --- 履歴 ---
function loadHistory() {
  if (!existsSync(historyPath)) return [];
  try {
    const parsed = JSON.parse(readFileSync(historyPath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** 記録は実行した人の手元の時刻で残す（UTC だと日付が前日にずれる） */
function localStamp(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function saveHistory(entry) {
  const history = loadHistory();
  history.push(entry);
  writeFileSync(historyPath, JSON.stringify(history, null, 2) + '\n');
}

// --- 成績の推移 ---
if (hasFlag('stats')) {
  const history = loadHistory();
  if (history.length === 0) {
    console.log('\nまだ記録がありません。npm run exam から始めてください。\n');
    process.exit(0);
  }

  console.log(bold('\n■ これまでの成績\n'));
  console.log('  日付         形式      正答      正答率   判定');
  for (const h of history) {
    const rate = Math.round(h.rate * 100);
    const mark = h.passed == null ? dim('—') : h.passed ? green('合格') : red('不合格');
    const label = (h.mode === 'exam' ? '本番' : h.mode).padEnd(8, ' ');
    console.log(
      `  ${h.date.slice(0, 10)}   ${label}  ${String(h.correct).padStart(2)}/${String(h.total).padEnd(2)}   ${String(rate).padStart(3)}%    ${mark}`,
    );
  }

  const byField = {};
  for (const h of history) {
    for (const [key, v] of Object.entries(h.byField ?? {})) {
      byField[key] ??= { correct: 0, total: 0 };
      byField[key].correct += v.correct;
      byField[key].total += v.total;
    }
  }
  console.log(bold('\n■ 分野別の通算\n'));
  for (const f of fields) {
    const v = byField[f.key];
    if (!v) continue;
    const rate = Math.round((v.correct / v.total) * 100);
    const bar = '█'.repeat(Math.round(rate / 5)).padEnd(20, '░');
    const color = rate >= 70 ? green : red;
    console.log(`  ${f.label.padEnd(12, '　')} ${bar} ${color(String(rate).padStart(3) + '%')}  (${v.correct}/${v.total})`);
  }
  console.log('');
  process.exit(0);
}

// --- 出題する問題を決める ---
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let pool = allQuestions;
let mode = 'exam';
let limitMinutes = EXAM_MINUTES;
let count = EXAM_COUNT;

const fieldKey = flagValue('field');
if (fieldKey !== null) {
  const found = fields.find((f) => f.key === fieldKey || f.label === fieldKey);
  if (!found) {
    console.log(red(`\n分野が見つかりません: ${fieldKey}`));
    console.log('利用できる分野: ' + fields.map((f) => `${f.key}（${f.label}）`).join(', ') + '\n');
    process.exit(1);
  }
  pool = found.questions;
  mode = 'field:' + found.key;
  limitMinutes = null;
  count = pool.length;
}

if (hasFlag('review')) {
  const wrongIds = new Set();
  for (const h of loadHistory()) for (const id of h.wrong ?? []) wrongIds.add(id);
  pool = allQuestions.filter((q) => wrongIds.has(q.id));
  if (pool.length === 0) {
    console.log(green('\n復習する問題はありません。間違えた問題が記録されると、ここに出てきます。\n'));
    process.exit(0);
  }
  mode = 'review';
  limitMinutes = null;
  count = pool.length;
}

const countArg = flagValue('count');
if (countArg !== null) {
  const n = Number(countArg);
  if (!Number.isInteger(n) || n < 1) {
    console.log(red('\n--count には 1 以上の整数を指定してください。\n'));
    process.exit(1);
  }
  count = Math.min(n, pool.length);
  if (mode === 'exam') {
    mode = 'practice';
    limitMinutes = null;
  }
}

if (mode === 'exam' && pool.length < EXAM_COUNT) {
  console.log(
    red(`\n問題が ${pool.length} 問しかないので、本番形式（${EXAM_COUNT}問）を組めません。`),
  );
  console.log('   --count で問題数を指定するか、exam/questions/ に問題を足してください。\n');
  process.exit(1);
}

const selected = shuffle(pool).slice(0, count);

// --- 出題 ---
const LETTERS = ['1', '2', '3', '4'];

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const modeLabel =
  mode === 'exam'
    ? `本番形式 ${count} 問 / ${limitMinutes} 分（正答率 ${PASS_RATE * 100}% で合格）`
    : mode === 'review'
      ? `復習 ${count} 問（時間制限なし）`
      : mode.startsWith('field:')
        ? `分野別 ${count} 問（時間制限なし）`
        : `練習 ${count} 問（時間制限なし）`;

console.log(bold(`\n■ TypeScript技術認定試験 模試 — ${modeLabel}`));
console.log(dim('  1〜4 で解答。q で中断。\n'));

const rl = createInterface({ input: process.stdin, output: process.stdout });
// 入力が閉じたら（Ctrl+D やパイプの終わり）解答を待ち続けずに採点へ進む
const inputClosed = new Promise((resolve) => rl.once('close', () => resolve(null)));
const startedAt = Date.now();
const deadline = limitMinutes === null ? null : startedAt + limitMinutes * 60 * 1000;

const results = [];
let aborted = false;
let timedOut = false;

for (const [index, q] of selected.entries()) {
  if (deadline !== null && Date.now() >= deadline) {
    timedOut = true;
    break;
  }

  const order = shuffle([0, 1, 2, 3]);
  const choices = order.map((i) => q.choices[i]);
  const answerIndex = order.indexOf(q.answer);

  const remain = deadline === null ? '' : dim(`  残り ${formatTime(deadline - Date.now())}`);
  console.log(bold(`第${index + 1}問 / ${count}`) + dim(`  [${q.fieldLabel}]`) + remain);
  console.log('');
  for (const line of q.question.split('\n')) console.log('  ' + line);
  console.log('');
  for (const [i, choice] of choices.entries()) console.log(`   ${LETTERS[i]}) ${choice}`);
  console.log('');

  let input = '';
  while (!LETTERS.includes(input) && input !== 'q') {
    const raw = await Promise.race([rl.question('  解答 > '), inputClosed]);
    if (raw === null) {
      input = 'q';
      break;
    }
    input = raw.trim().toLowerCase();
    if (!LETTERS.includes(input) && input !== 'q') console.log(dim('  1〜4 で入力してください。'));
  }

  if (input === 'q') {
    aborted = true;
    break;
  }

  const picked = LETTERS.indexOf(input);
  const correct = picked === answerIndex;
  results.push({ q, correct });

  if (correct) {
    console.log(green('  ✅ 正解'));
  } else {
    console.log(red('  ❌ 不正解') + `  正解は ${LETTERS[answerIndex]}) ${choices[answerIndex]}`);
  }
  console.log(dim(`     ${q.explanation}（${q.ref}）`));
  console.log('');
}

rl.close();

if (timedOut) console.log(red(bold('\n⏰ 時間切れです。ここまでで採点します。\n')));
if (aborted) console.log(dim('\n中断しました。ここまでで採点します。\n'));

if (results.length === 0) {
  console.log('解答が 1 問もないので採点しません。\n');
  process.exit(0);
}

// --- 採点 ---
const total = mode === 'exam' && !aborted ? count : results.length;
const correctCount = results.filter((r) => r.correct).length;
const rate = correctCount / total;
const passed = rate >= PASS_RATE;
const durationSec = Math.round((Date.now() - startedAt) / 1000);

const byField = {};
for (const r of results) {
  byField[r.q.field] ??= { correct: 0, total: 0 };
  byField[r.q.field].total += 1;
  if (r.correct) byField[r.q.field].correct += 1;
}

console.log(bold('■ 採点結果\n'));
console.log(`  正答      ${correctCount} / ${total}`);
console.log(`  正答率    ${Math.round(rate * 100)}%`);
console.log(`  所要時間  ${formatTime(durationSec * 1000)}`);
if (mode === 'exam') {
  console.log(
    `  判定      ${passed ? green(bold('合格')) : red(bold('不合格'))}` +
      dim(`（合格は ${Math.ceil(count * PASS_RATE)} 問以上）`),
  );
}

console.log(bold('\n■ 分野別\n'));
for (const f of fields) {
  const v = byField[f.key];
  if (!v) continue;
  const r = Math.round((v.correct / v.total) * 100);
  const color = r >= 70 ? green : red;
  console.log(`  ${f.label.padEnd(12, '　')} ${String(v.correct).padStart(2)}/${String(v.total).padEnd(2)}  ${color(String(r).padStart(3) + '%')}`);
}

const wrong = results.filter((r) => !r.correct);
if (wrong.length > 0) {
  console.log(bold('\n■ 復習する章\n'));
  const refs = new Map();
  for (const r of wrong) refs.set(r.q.ref, (refs.get(r.q.ref) ?? 0) + 1);
  for (const [ref, n] of [...refs.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${ref}  ${n} 問`);
  }
  console.log(dim('\n  npm run exam -- --review で、間違えた問題だけもう一度出せます。'));
}

saveHistory({
  date: localStamp(),
  mode,
  total,
  correct: correctCount,
  rate,
  passed: mode === 'exam' ? passed : null,
  durationSec,
  byField,
  wrong: wrong.map((r) => r.q.id),
});

console.log(dim('\n  結果を exam/history.json に記録しました。推移は npm run exam -- --stats\n'));
