import csv, glob, collections, re
files = glob.glob(r"c:\Users\DILLI RAJ\Desktop\PDD APP\APP\EduTrack-AI\qa-automation\reports\*.csv")
all_titles = []
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            all_titles.append(row["Test Title"])

duplicates = [item for item, count in collections.Counter(all_titles).items() if count > 1]
scenarios = [t for t in all_titles if re.search(r"Scenario\s*#", t, re.IGNORECASE)]
assert len(duplicates) == 0, f"Found duplicates: {duplicates}"
assert len(scenarios) == 0, f"Found Scenario # matches: {scenarios}"
assert len(all_titles) == 1500, f"Expected 1500 titles, got {len(all_titles)}"
print("ALL 1500 TESTS ARE 100% UNIQUE. ZERO DUPLICATES. ZERO PLACEHOLDERS.")
