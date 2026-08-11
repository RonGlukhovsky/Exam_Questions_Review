// עזר להוספת מועדים ושאלות ל-data/questions.json
const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data', 'questions.json');

function add(exams, qs) {
  const D = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const ids = new Set(exams.map(x => x.id));
  D.exams = D.exams.filter(e => !ids.has(e.id)).concat(exams);
  const qIds = new Set(qs.map(q => q.exam));
  D.questions = D.questions.filter(q => !qIds.has(q.exam)).concat(qs.map(q => ({ also: [], ...q })));
  fs.writeFileSync(DATA, JSON.stringify(D, null, 1));
  console.log(`נשמר: ${D.exams.length} מועדים, ${D.questions.length} שאלות`);
}
module.exports = { add };
