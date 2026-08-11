const fs=require('fs');
const P=JSON.parse(fs.readFileSync('pages_fixed.json','utf8'));
function clean(t){
  return t.replace(/[ \t]+/g,' ')
          .replace(/[^\n]*הטכניון[^\n]*\n?/g,'')
          .replace(/\n{2,}/g,'\n');
}
const [a,b,mx=280]=process.argv.slice(2).map(Number);
for(let i=a-1;i<b;i++){
  let t=clean(P[i]).replace(/\s+/g,' ').trim();
  const m=[...t.matchAll(/(\d{1,2})\s*שאלה/g)];
  if(!m.length) continue;
  for(const mm of m){
    const num=mm[1];
    const before=t.slice(Math.max(0,mm.index-mx),mm.index).trim();
    const pm=before.match(/[()]\s*(\d{1,2})\s*(?:נקודות|נק)/) || before.match(/(\d{1,2})\s*\)\s*תודוקנ/);
    console.log(`p${i+1}|Q${num}|pts=${pm?pm[1]:'?'}| ${before}`);
  }
}
