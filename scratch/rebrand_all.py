import os
import re

root_dir = r'd:\arogyam\arogyam'

# Files to rename
renames = [
    (r'server\utils\generateHealthId.js', r'server\utils\generateArogyamId.js'),
]

# Patterns to replace in content
replacements = [
    (r'Health ID', r'Arogyam ID'),
    (r'HealthID', r'Arogyam'),
    (r'healthId', r'arogyamId'),
    (r'health_id', r'arogyam_id'),
    (r'generateHealthId', r'generateArogyamId'),
]

exclude_dirs = {'.git', 'node_modules', 'scratch'}
exclude_exts = {'.png', '.jpg', '.jpeg', '.ico', '.pdf', '.zip'}

for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if any(file.endswith(ext) for ext in exclude_exts):
            continue
            
        path = os.path.join(root, file)
        
        # Don't touch the script itself
        if 'rebrand_all.py' in path:
            continue

        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements:
                new_content = new_content.replace(pattern, repl)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated: {path}")
        except Exception as e:
            print(f"Error processing {path}: {e}")

# Perform file renames
for old, new in renames:
    old_path = os.path.join(root_dir, old)
    new_path = os.path.join(root_dir, new)
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"Renamed: {old} -> {new}")

print("Exhaustive rebranding complete.")
