import os
import json

locales_dir = r'd:\arogyam\arogyam\frontend\src\i18n\locales'

key_replacements = {
    'statArogyams': 'statHealthIds',
    'globalArogyam': 'globalHealthId',
    'noArogyam': 'noHealthId',
    'ArogyamNumber': 'healthIdNumber',
    'findByArogyam': 'findByHealthId',
    'enterArogyam': 'enterHealthId',
    'patientArogyam': 'patientHealthId',
    'patientArogyamLabel': 'patientHealthIdLabel',
    'ArogyamPlaceholder': 'healthIdPlaceholder',
    'patientArogyamField': 'patientHealthIdField',
    'uploadToArogyam': 'uploadToHealthId',
    'footerCreateArogyam': 'footerCreateHealthId',
    'statArogyamId': 'statHealthIds',
}

def fix_value(val):
    if not isinstance(val, str):
        return val
    # Fix casing for brand names
    val = val.replace('arogyamId ID', 'Arogyam ID')
    val = val.replace('arogyamId', 'Arogyam ID')
    val = val.replace('Arogyam ID ID', 'Arogyam ID')
    val = val.replace('Arogyam Arogyam', 'Arogyam')
    val = val.replace('arogyam', 'Arogyam')
    val = val.replace('Arogyam ID ID', 'Arogyam ID')
    # Final cleanup
    val = val.replace('Arogyam ID ID', 'Arogyam ID')
    return val

for filename in os.listdir(locales_dir):
    if filename.endswith('.json'):
        path = os.path.join(locales_dir, filename)
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        def process_obj(obj):
            if isinstance(obj, dict):
                new_obj = {}
                for k, v in obj.items():
                    new_k = key_replacements.get(k, k)
                    new_obj[new_k] = process_obj(v)
                return new_obj
            elif isinstance(obj, str):
                return fix_value(obj)
            else:
                return obj

        fixed_data = process_obj(data)
        
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(fixed_data, f, ensure_ascii=False, indent=2)

print("Locales fixed with correct casing.")
