with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

import re

for m in re.finditer(r'adm', code):
    start = max(0, m.start() - 50)
    end = min(len(code), m.end() + 200)
    snippet = code[start:end].replace('\n', ' ')
    if any(k in snippet for k in ['innerHTML', 'modal', 'tab', 'open', 'class']):
        print(snippet[:180])
