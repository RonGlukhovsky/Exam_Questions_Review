const fs=require('fs');
const P=JSON.parse(fs.readFileSync('pages_fixed.json','utf8'));
function clean(t){
  return t.replace(/הטכניון[^\n]{0,140}\n/g,'')
          .replace(/מערכות ספרתיות ומבנה המחשב[^\n]{0,90}\n/g,'')
          .replace(/הפקולטה להנדסת חשמל[^\n]*\n/g,'')
          .replace(/[ \t]+/g,' ').replace(/\n{2,}/g,'\n');
}
function run(a,b,mx){
  mx=mx||300;
  let stream='',marks=[];
  for(let i=a-1;i<b;i++){marks.push([stream.length,i+1]);stream+=clean(P[i])+'\n';}
  const re=/שאלה\s*(\d{1,2})/g; let m,prev=-999,out=[];
  while((m=re.exec(stream))){
    if(m.index-prev<120) continue;
    prev=m.index;
    let pg=marks.filter(x=>x[0]<=m.index).pop()[1];
    let seg=stream.slice(m.index,m.index+900).replace(/\s+/g,' ').trim();
    let pm=seg.slice(0,70).match(/[()]\s*(\d{1,2})\s*(?:נקודות|נק)/);
    let pts=pm?+pm[1]:null;
    let opts=(seg.match(/(?:^|\s)[אבגדהו][.'׳]\s/g)||[]).length;
    let cut=seg.length;
    for(const k of ['פתרון','תשובה נכונה','תשובה:','הפתרון']){const j=seg.indexOf(k,40);if(j>60)cut=Math.min(cut,j);}
    const mo=seg.slice(60).match(/\sא[.'׳]\s/);
    if(mo)cut=Math.min(cut,60+mo.index);
    out.push({pg,pts,mc:opts>=3,txt:seg.slice(0,cut).slice(0,mx)});
  }
  return out;
}
if(require.main===module){
  const [a,b,mx]=process.argv.slice(2).map(Number);
  run(a,b,mx).forEach((q,i)=>console.log(`Q${i+1}|p${q.pg}|${q.pts}נק|${q.mc?'MC':'OPEN?'}| ${q.txt}`));
}
module.exports={run,P};
