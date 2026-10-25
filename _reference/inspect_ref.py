import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import re
from bs4 import BeautifulSoup

with open('reference_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

with open('ref_analysis.txt', 'w', encoding='utf-8') as out:
    out.write("=== PAGE TITLE ===\n")
    out.write(str(soup.title.string if soup.title else "No title") + "\n")

    out.write("\n=== META TAGS ===\n")
    for m in soup.find_all('meta'):
        out.write(str(m.attrs) + "\n")

    out.write("\n=== HEADINGS ===\n")
    for h in soup.find_all(['h1', 'h2', 'h3', 'h4']):
        out.write(f"<{h.name}>: {h.get_text(strip=True)}\n")

    out.write("\n=== ALL BUTTONS & LINKS ===\n")
    for b in soup.find_all(['button', 'a']):
        out.write(f"<{b.name} id='{b.get('id','')}' class='{b.get('class','')}'> {b.get_text(strip=True)}\n")

    out.write("\n=== STRUCTURAL ELEMENTS WITH ID OR CLASS ===\n")
    for elem in soup.find_all(True):
        classes = " ".join(elem.get('class', []))
        elem_id = elem.get('id', '')
        if elem_id or any(k in classes for k in ['modal', 'cart', 'queue', 'music', 'hero', 'cat', 'order', 'step', 'pkg', 'popup', 'track', 'dialog', 'drawer']):
            out.write(f"<{elem.name} id='{elem_id}' class='{classes}'>\n")

    out.write("\n=== INLINE JAVASCRIPT DETAILS ===\n")
    scripts = soup.find_all('script')
    for i, s in enumerate(scripts):
        text = s.get_text()
        out.write(f"\n--- SCRIPT {i} (len: {len(text)}) ---\n")
        out.write(text[:3000] + ("\n... [truncated]" if len(text) > 3000 else "") + "\n")

print("Analysis saved to ref_analysis.txt")
