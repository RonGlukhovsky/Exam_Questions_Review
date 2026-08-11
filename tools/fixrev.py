import json,re
pages=json.load(open("pages.json"))

def is_rev(t):
    # reversed Hebrew signature words
    sig=["ןוינכטה","הלאש","ןורתפ","תודוקנ","רטסמס"]
    hits=sum(t.count(s) for s in sig)
    norm=sum(t.count(s) for s in ["הטכניון","שאלה","פתרון","נקודות","סמסטר"])
    return hits>norm

def unrev_line(l):
    l=l[::-1]
    return re.sub(r"[A-Za-z0-9]+", lambda m: m.group(0)[::-1], l)

def fix(t):
    return "\n".join(unrev_line(l) for l in t.split("\n"))

fixed=[]
revpages=[]
for i,t in enumerate(pages):
    if is_rev(t):
        revpages.append(i+1); fixed.append(fix(t))
    else:
        fixed.append(t)
json.dump(fixed,open("pages_fixed.json","w"))
print("reversed pages:",len(revpages), revpages[:5], "...", revpages[-5:] if revpages else "")
# ranges
if revpages:
    rs=[]; s=revpages[0]; p=revpages[0]
    for x in revpages[1:]:
        if x!=p+1: rs.append((s,p)); s=x
        p=x
    rs.append((s,p))
    print("ranges:",rs)
