"""Rebuild the complete offline ECDICT import from a local CSV.
Usage: python scripts/import-ecdict.py /path/to/ecdict.csv
Source: https://github.com/skywind3000/ECDICT (MIT; see public/licenses).
Only rows with a searchable Latin headword and a Chinese definition are imported.
"""
import csv
import hashlib
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
entries = defaultdict(dict)
forms = defaultdict(lambda: defaultdict(set))
def shard_key(word):
    return word[:2].ljust(2, '_')
pattern = re.compile(r"[a-z]+(?:[-'][a-z]+)*")
with source.open(encoding='utf-8-sig', newline='') as handle:
    for row in csv.DictReader(handle):
        word = row['word'].strip().lower()
        translation = row['translation'].strip()
        if not pattern.fullmatch(word) or not re.search(r'[\u4e00-\u9fff]', translation):
            continue
        key = shard_key(word)
        entries[key][word] = [translation.replace('\\n', '\n'), row['phonetic'].strip(), row.get('pos', '').strip()]
        for exchange in row.get('exchange', '').split('/'):
            kind, _, values = exchange.partition(':')
            if kind not in {'p', 'd', 'i', '3', 's', 'r', 't'}:
                continue
            for value in values.split(','):
                if pattern.fullmatch(value) and value != word:
                    forms[shard_key(value)][value].add(word)

out_dir = root / 'src/data/ecdict'
out_dir.mkdir(parents=True, exist_ok=True)
for old in out_dir.glob('*.json'):
    old.unlink()
shard_keys = sorted(set(entries) | set(forms))
for key in shard_keys:
    payload = {
        'entries': dict(sorted(entries.get(key, {}).items())),
        'forms': {k: sorted(v) for k, v in sorted(forms.get(key, {}).items())},
    }
    (out_dir / f'{key}.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

entry_count = sum(map(len, entries.values()))
form_count = sum(map(len, forms.values()))
manifest = {
    'name': 'ECDICT', 'upstream': 'https://github.com/skywind3000/ECDICT',
    'download': 'https://raw.githubusercontent.com/skywind3000/ECDICT/master/ecdict.csv',
    'license': 'MIT', 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'selection': 'All upstream rows with a searchable Latin headword and a Chinese definition; partitioned by two-character prefix',
    'entries': entry_count, 'inflectedForms': form_count, 'shards': len(shard_keys),
    'notice': 'General dictionary definitions, not contextual translations. Imported data has not been individually reviewed.',
}
(root / 'src/data/ecdict-meta.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
old_file = root / 'src/data/ecdict.json'
if old_file.exists():
    old_file.unlink()
print(json.dumps(manifest, ensure_ascii=False, indent=2))
