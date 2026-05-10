import os
import re

root_dir = r'd:\arogyam\arogyam\frontend\src'

replacements = [
    (r'\bArogyam\b', 'arogyamId'),
    (r':Arogyam\b', ':arogyamId'),
    (r'setArogyam', 'setArogyamId'),
]

exclude_dirs = {'node_modules', '.git'}

for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if not file.endswith(('.jsx', '.js', '.css')):
            continue
            
        path = os.path.join(root, file)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements:
                # Use regex with boundary check
                new_content = re.sub(pattern, repl, new_content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed: {path}")
        except Exception as e:
            print(f"Error {path}: {e}")

print("Frontend variable fix complete.")
