import os
import json
import re

locales_dir = r'd:\arogyam\arogyam\frontend\src\i18n\locales'

def replace_in_dict(d):
    new_dict = {}
    for k, v in d.items():
        if isinstance(v, dict):
            new_dict[k] = replace_in_dict(v)
        elif isinstance(v, str):
            # Replace in values only
            val = v
            val = val.replace('Arogyam ID', 'Arogyam ID')
            val = val.replace('Arogyam', 'Arogyam')
            val = val.replace('Arogyam', 'arogyam')
            new_dict[k] = val
        else:
            new_dict[k] = v
    return new_dict

# First, we need to know the original keys. 
# Since I already messed up the keys, I need to restore them.
# The keys usually follow camelCase like Arogyam, statArogyams, etc.
# I'll use a regex to find keys that were incorrectly replaced and fix them.

key_replacements = {
    'statArogyams': 'statArogyams',
    'globalArogyam': 'globalArogyam',
    'noArogyam': 'noArogyam',
    'ArogyamNumber': 'ArogyamNumber',
    'findByArogyam': 'findByArogyam',
    'enterArogyam': 'enterArogyam',
    'patientArogyam': 'patientArogyam',
    'patientArogyamLabel': 'patientArogyamLabel',
    'ArogyamPlaceholder': 'ArogyamPlaceholder',
    'patientArogyamField': 'patientArogyamField',
    'uploadToArogyam': 'uploadToArogyam',
    'footerCreateArogyam': 'footerCreateArogyam',
}

for filename in os.listdir(locales_dir):
    if filename.endswith('.json'):
        path = os.path.join(locales_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                continue
        
        # Function to fix keys and values
        def fix_data(obj):
            if isinstance(obj, dict):
                new_obj = {}
                for k, v in obj.items():
                    # Fix key if it was replaced
                    new_k = key_replacements.get(k, k)
                    # If it's still 'Arogyam' in some form, try to guess
                    if 'Arogyam' in new_k and new_k not in key_replacements.values():
                         # This is risky, but let's see
                         pass
                    
                    new_obj[new_k] = fix_data(v)
                return new_obj
            elif isinstance(obj, str):
                # Ensure values are rebranded
                val = obj
                val = val.replace('Arogyam ID', 'Arogyam ID')
                val = val.replace('Arogyam', 'Arogyam')
                # Also handle cases where my previous bulk replace might have missed or double replaced
                return val
            else:
                return obj

        fixed_data = fix_data(data)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(fixed_data, f, ensure_ascii=False, indent=2)

print("Finished fixing JSON files.")
