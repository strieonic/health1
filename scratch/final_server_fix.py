import os
import re

root_dir = r'd:\arogyam\arogyam\server'

# Exhaustive list of problematic terms to replace in code
# (term_to_find, replacement)
# These will be applied case-insensitively for variable/function naming patterns
patterns = [
    (r'searchPatientByHealthId', 'searchPatientByArogyamId'),
    (r'generateHealthId', 'generateArogyamId'),
    (r'healthId', 'arogyamId'),
    (r'HealthID', 'ArogyamId'),
    (r'HealthId', 'ArogyamId'),
    (r'healthid', 'arogyamId'),
    (r'HEALTHID', 'AROGYAMID'),
]

exclude_dirs = {'node_modules', '.git'}

for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    for file in files:
        if not file.endswith(('.js', '.json', '.yaml', '.yml')):
            continue
            
        path = os.path.join(root, file)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            # Case-insensitive replacement for these specific code patterns
            for pattern, repl in patterns:
                new_content = re.sub(pattern, repl, new_content, flags=re.IGNORECASE)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed: {path}")
        except Exception as e:
            print(f"Error {path}: {e}")

print("Exhaustive server-side fix complete.")
