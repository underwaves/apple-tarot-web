with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('function openAdm')
if idx != -1:
    snippet = code[idx-1000:idx+8000]
    with open('admin_full_snippet.js', 'w', encoding='utf-8') as f:
        f.write(snippet)
    print("Saved admin_full_snippet.js, len:", len(snippet))
else:
    print("openAdm not found")
