with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

import re

# Find sections relating to admin
print("--- Searching for admin DOM or views ---")
admin_blocks = re.findall(r'(setAdminUI|adminLogin|renderAdmin|tab\w+|admBody|adm\w+)[^;{]*[{=]', code)
print(list(dict.fromkeys(admin_blocks))[:30])

# Let's inspect where adm is referenced
for line in code.split(';'):
    if any(k in line for k in ['adm', 'tab', 'orders', 'slips', 'queues', 'packages', 'music']):
        if len(line.strip()) < 150 and any(kw in line for kw in ['innerHTML', 'render', 'click', 'switch']):
            print("Line:", line.strip()[:100])
