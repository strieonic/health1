import os

root_dir = r'd:\arogyam\arogyam'

# Precise replacements to fix casing in code
replacements = [
    # Casing fixes for variables/fields
    (r'Arogyam:', r'arogyamId:'),
    (r'.Arogyam', r'.arogyamId'),
    (r'const Arogyam =', r'const arogyamId ='),
    (r'const { Arogyam } =', r'const { arogyamId } ='),
    (r'{ Arogyam }', r'{ arogyamId }'),
    (r'Arogyam,', r'arogyamId,'),
    (r' Arogyam ', r' arogyamId '),
    (r'\"Arogyam\"', r'\"arogyamId\"'), # populate fields
    (r'generateArogyam(', r'generateArogyamId('),
    (r'generateArogyamId', r'generateArogyamId'), # just to be sure
    (r'import generateArogyam from', r'import generateArogyamId from'),
    (r'searchPatientByArogyam', r'searchPatientByArogyamId'),
    (r'export const Arogyam', r'export const arogyamId'), # unlikely but safe
]

exclude_dirs = {'.git', 'node_modules', 'scratch'}
exclude_exts = {'.png', '.jpg', '.jpeg', '.ico', '.pdf', '.zip'}

for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if any(file.endswith(ext) for ext in exclude_exts):
            continue
            
        path = os.path.join(root, file)
        
        # skip this script
        if 'fix_casing.py' in path:
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
                print(f"Fixed casing in: {path}")
        except Exception as e:
            print(f"Error processing {path}: {e}")

print("Casing fix complete.")
