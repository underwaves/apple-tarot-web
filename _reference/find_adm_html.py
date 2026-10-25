with open('reference_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

import re

# Find id="adm" in html
idx = html.find('id="adm"')
if idx == -1:
    idx = html.find("id='adm'")
print("id='adm' found at:", idx)
if idx != -1:
    print("HTML around id='adm':")
    print(html[idx-100:idx+300])

# Find references to 'adm' in scripts
matches = [m.start() for m in re.finditer(r'[\'\"#]adm[\'\"#]', html)]
print("Script occurrences of 'adm':", len(matches))
for m in matches:
    print("...", html[m-40:m+60].replace('\n', ' '))
