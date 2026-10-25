import io, sys, re, json
from bs4 import BeautifulSoup

with open('reference_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

analysis = {
    "title": soup.title.string.strip() if soup.title else "",
    "meta": [m.attrs for m in soup.find_all('meta')],
    "sections": [],
    "modals": [],
    "admin_features": [],
    "customer_steps": []
}

# Modals
for sec in soup.find_all(['section', 'div', 'dialog']):
    sec_id = sec.get('id', '')
    sec_cls = " ".join(sec.get('class', []))
    if 'modal' in sec_cls or sec_id in ['mc', 's2', 's3', 's4', 'mk', 'lg', 'rg', 'done', 'adm', 'chp']:
        h = sec.find(['h2', 'h3', 'h4', 'b', 'strong'])
        header_text = h.get_text(strip=True) if h else ""
        analysis["modals"].append({
            "id": sec_id,
            "classes": sec_cls,
            "header": header_text,
            "inputs": [inp.get('id') or inp.get('name') for inp in sec.find_all(['input', 'textarea', 'select'])],
            "buttons": [btn.get_text(strip=True) for btn in sec.find_all('button')]
        })

# Extract DEFAULTS and CONFIG from S3
with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    s3_code = f.read()

defaults_match = re.search(r'const\s+DEFAULTS\s*=\s*({.*?});', s3_code, re.DOTALL)
if defaults_match:
    try:
        # approximate json or extract keys
        def_str = defaults_match.group(1)
        analysis["defaults_snippet"] = def_str[:1500]
    except Exception as e:
        pass

# Find admin panels
admin_sections = re.findall(r'(\bfunction\s+(?:admin\w+|openAdmin\w*|renderAdmin\w*|saveAdmin\w*)\b.*?{)', s3_code)
analysis["admin_functions"] = admin_sections

with open('morjeng_summary.json', 'w', encoding='utf-8') as f:
    json.dump(analysis, f, indent=2, ensure_ascii=False)

print("Saved morjeng_summary.json")
