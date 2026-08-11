#!/bin/bash
# בונה מחדש את האתר, מבצע commit ודוחף ל-GitHub.
# שימוש:  ./update.sh "תיאור השינוי"
set -e
cd "$(dirname "$0")"
node tools/build.js
if git diff --quiet && git diff --cached --quiet; then
  echo "אין שינויים לדחוף."
  exit 0
fi
git add -A
git commit -m "${1:-עדכון נתוני שאלות}"
git push
echo "נדחף. GitHub Pages יתעדכן תוך דקה."
