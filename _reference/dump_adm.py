with open('reference_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

import re

out = []
idx = html.find("id='adm'")
if idx == -1:
    idx = html.find('id="adm"')
out.append(f"id='adm' found at: {idx}")
if idx != -1:
    out.append("HTML around id='adm':\n" + html[idx-200:idx+1500])

matches = [m.start() for m in re.finditer(r'[\'\"#]adm[\'\"#]', html)]
out.append(f"\nScript occurrences of 'adm': {len(matches)}")
for m in matches:
    out.append("... " + html[m-60:m+100].replace('\n', ' '))

with open('adm_details.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(out))

print("Dumped adm_details.txt")
