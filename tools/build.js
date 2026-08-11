#!/usr/bin/env node
// בונה את index.html מתוך data/questions.json + tools/template.html
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'questions.json');
const TPL  = path.join(__dirname, 'template.html');
const OUT  = path.join(ROOT, 'index.html');

const D = JSON.parse(fs.readFileSync(DATA, 'utf8'));
D.exams.forEach(x => x.year = +x.order.slice(0, 4));
D.exams.sort((a, b) => (a.order < b.order ? -1 : 1));
const byid = Object.fromEntries(D.exams.map(x => [x.id, x]));

const unknown = D.questions.filter(q => !byid[q.exam]);
if (unknown.length) {
  console.warn(`אזהרה: ${unknown.length} שאלות מפנות למועד שלא קיים ב-exams:`,
    [...new Set(unknown.map(q => q.exam))].join(', '));
}
const qs = D.questions.filter(q => byid[q.exam]).sort((a, b) =>
  byid[a.exam].order === byid[b.exam].order
    ? a.n - b.n
    : (byid[a.exam].order < byid[b.exam].order ? -1 : 1));

const years = [...new Set(D.exams.map(x => x.year))].sort();
const chips = years.map(y =>
  `<button class="chip year" data-year="${y}" aria-pressed="false" type="button">${y}</button>`
).join('\n        ');

const out = fs.readFileSync(TPL, 'utf8')
  .replace('__EXAMS__', JSON.stringify(D.exams))
  .replace('__Q__', JSON.stringify(qs))
  .replace('__YEARCHIPS__', chips)
  .replace('__YEARSPAN__', `${years[0]}–${years[years.length - 1]}`)
  .replace('__NEXAMS__', String(D.exams.length))
  .replace('__NQ__', String(qs.length));

fs.writeFileSync(OUT, out);
console.log(`נבנה index.html — ${D.exams.length} מועדים, ${qs.length} שאלות, ${years[0]}–${years[years.length - 1]}`);
