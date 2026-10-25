with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('setAdminUI')
if idx != -1:
    print("Found setAdminUI at index", idx)
    snippet = code[idx:idx+5000]
    with open('admin_ui_snippet.js', 'w', encoding='utf-8') as f:
        f.write(snippet)
    print("Saved admin_ui_snippet.js")
else:
    print("setAdminUI not found")
