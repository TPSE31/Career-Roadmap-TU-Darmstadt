import re
import json
from pathlib import Path

# Input/output paths
text_folder = Path(r"C:\Users\Yigit\Desktop\Career-Roadmap-FINAL-v3\docs\course-pdfs-text")
output_file = Path(r"C:\Users\Yigit\Desktop\Career-Roadmap-FINAL-v3\docs\data-model\all_modules_full.json")

def parse_module_block(text):
    """Parse a single module block and extract all fields."""
    module = {}

    # Module name
    name_match = re.search(r'Modulname\s*\n(.+?)(?=\nModul Nr\.)', text, re.DOTALL)
    if name_match:
        module['name_de'] = name_match.group(1).strip()

    # Module number
    code_match = re.search(r'Modul Nr\.\s*\n?([\d-]+)', text)
    if code_match:
        module['code'] = code_match.group(1).strip()

    # Credit points
    cp_match = re.search(r'Leistungspun\s*kte\s*\n?\s*(\d+)\s*CP', text)
    if cp_match:
        module['credits'] = int(cp_match.group(1))

    # Workload
    workload_match = re.search(r'Arbeitsaufwand\s*\n?\s*(\d+)\s*h', text)
    if workload_match:
        module['workload_hours'] = int(workload_match.group(1))

    # Self-study hours
    self_study_match = re.search(r'Selbststudium\s*\n?\s*(\d+)\s*h', text)
    if self_study_match:
        module['self_study_hours'] = int(self_study_match.group(1))

    # Duration
    duration_match = re.search(r'Moduldauer\s*\n?\s*(\d+)\s*Semester', text)
    if duration_match:
        module['duration_semesters'] = int(duration_match.group(1))

    # Offering frequency
    freq_match = re.search(r'Angebotsturnus\s*\n?(.+?)(?=\nSprache)', text, re.DOTALL)
    if freq_match:
        module['offering_frequency'] = freq_match.group(1).strip().replace('\n', ' ')

    # Language
    lang_match = re.search(r'Sprache\s*\n?(\w+)', text)
    if lang_match:
        module['language'] = lang_match.group(1).strip()

    # Responsible person
    resp_match = re.search(r'Modulverantwortliche Person\s*\n?(.+?)(?=\n\d\s*\nKurse des Moduls)', text, re.DOTALL)
    if resp_match:
        module['responsible_person'] = resp_match.group(1).strip().replace('\n', ' ')

    # Learning content (Lerninhalt)
    content_match = re.search(r'\d\s*\nLerninhalt\s*\n(.+?)(?=\n\d\s*\nQualifikationsziele)', text, re.DOTALL)
    if content_match:
        module['learning_content'] = content_match.group(1).strip()

    # Learning objectives (Qualifikationsziele)
    objectives_match = re.search(r'\d\s*\nQualifikationsziele\s*/?\s*Lernergebnisse\s*\n(.+?)(?=\n\d\s*\nVoraussetzung für die Teilnahme)', text, re.DOTALL)
    if objectives_match:
        module['learning_objectives'] = objectives_match.group(1).strip()

    # Prerequisites
    prereq_match = re.search(r'\d\s*\nVoraussetzung für die Teilnahme\s*\n(.+?)(?=\n\d\s*\nPrüfungsform)', text, re.DOTALL)
    if prereq_match:
        prereq_text = prereq_match.group(1).strip()
        if prereq_text and prereq_text != '':
            module['prerequisites'] = prereq_text

    # Exam form
    exam_match = re.search(r'\d\s*\nPrüfungsform\s*\n(.+?)(?=\n\d\s*\nVoraussetzung für die Vergabe)', text, re.DOTALL)
    if exam_match:
        module['exam_form'] = exam_match.group(1).strip()

    # Usability in programs
    usage_match = re.search(r'\d\s*\nVerwendbarkeit des Moduls\s*\n(.+?)(?=\n\d\s*\nLiteratur|\n={10,})', text, re.DOTALL)
    if usage_match:
        module['usable_in_programs'] = usage_match.group(1).strip()

    return module

def split_into_modules(text):
    """Split the text into individual module blocks."""
    # Split on "Modulbeschreibung" which marks the start of each module
    blocks = re.split(r'\nModulbeschreibung\s*\n', text)
    return [b for b in blocks if 'Modulname' in b]

def determine_category(text_before_module, module_name):
    """Try to determine the category based on context."""
    # This is a simplified approach - you may need to refine based on actual structure
    if 'Pflichtbereich' in text_before_module[-500:]:
        return 'Pflichtbereich'
    elif 'Wahlpflichtbereich' in text_before_module[-500:]:
        return 'Wahlpflichtbereich'
    elif 'Wahlbereich Künstliche Intelligenz' in text_before_module[-1000:]:
        return 'Wahlbereich - Künstliche Intelligenz'
    elif 'Wahlbereich Cybersicherheit' in text_before_module[-1000:]:
        return 'Wahlbereich - Cybersicherheit und Privatheit'
    elif 'Wahlbereich Komplexe vernetzte Systeme' in text_before_module[-1000:]:
        return 'Wahlbereich - Komplexe vernetzte Systeme'
    elif 'Wahlbereich Software und Hardware' in text_before_module[-1000:]:
        return 'Wahlbereich - Software und Hardware'
    elif 'Wahlbereich Theorie' in text_before_module[-1000:]:
        return 'Wahlbereich - Theorie'
    elif 'Seminare' in text_before_module[-500:]:
        return 'Wahlbereich - Seminare'
    elif 'Praktika' in text_before_module[-500:]:
        return 'Wahlbereich - Praktika'
    return 'Unknown'

# Process all text files
all_modules = []
seen_codes = set()

# Sort files numerically
text_files = sorted(text_folder.glob("*.txt"), key=lambda x: int(re.search(r'part-(\d+)', x.name).group(1)))

for text_file in text_files:
    print(f"Processing: {text_file.name}")

    with open(text_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into module blocks
    module_blocks = split_into_modules(content)
    print(f"  Found {len(module_blocks)} modules")

    for block in module_blocks:
        module = parse_module_block(block)

        if module.get('code') and module['code'] not in seen_codes:
            seen_codes.add(module['code'])
            all_modules.append(module)

print(f"\nTotal unique modules extracted: {len(all_modules)}")

# Save to JSON
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_modules, f, ensure_ascii=False, indent=2)

print(f"Saved to: {output_file}")

# Print sample
print("\n--- Sample module ---")
if all_modules:
    print(json.dumps(all_modules[1] if len(all_modules) > 1 else all_modules[0], ensure_ascii=False, indent=2))
