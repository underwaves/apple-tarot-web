with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    code = f.read()

idx = code.find('function showEdit')
if idx != -1:
    snippet = code[idx:idx+6000]
    with open('showedit_snippet.js', 'w', encoding='utf-8') as f:
        f.write(snippet)
    print("Saved showedit_snippet.js, len:", len(snippet))
else:
    print("showEdit not found")
