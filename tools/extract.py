import sys, json
sys.path.insert(0,'./pylibs')
from pypdf import PdfReader
p="/Users/rongluhovsky/Desktop/תקופת מבחנים/מערכות ספרתיות/All Past Exams 2018-2026.pdf"
r=PdfReader(p)
print("pages",len(r.pages))
out=[]
for i,pg in enumerate(r.pages):
    try: t=pg.extract_text() or ""
    except Exception as e: t=f"[ERR {e}]"
    out.append(t)
json.dump(out,open("pages.json","w"))
# print first 3 pages
for i in range(3):
    print("="*20,"PAGE",i+1)
    print(out[i][:1500])
