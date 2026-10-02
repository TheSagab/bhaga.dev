#!/usr/bin/env python3
"""Convert 'Mon DD YYYY' pubDate/updatedDate values to YYYY-MM-DD.

Used when syncing prototype branches onto the date-only schema. Operates only on
the quoted value, so the key and quote style are preserved.
"""
import os
import re
import sys

MONTHS = {
    m: i
    for i, m in enumerate(
        ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        1,
    )
}

PAT = re.compile(r"^((?:pubDate|updatedDate):\s*)(['\"])([^'\"]+)\2\s*$", re.M)


def to_iso(value: str) -> str:
    value = value.strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return value
    m = re.fullmatch(r"([A-Za-z]{3})[a-z]*\s+(\d{1,2}),?\s+(\d{4})", value)
    if not m:
        raise ValueError(f"unrecognised date: {value!r}")
    return f"{m.group(3)}-{MONTHS[m.group(1)]:02d}-{int(m.group(2)):02d}"


def main(base: str) -> int:
    changed = []
    for name in sorted(os.listdir(base)):
        path = os.path.join(base, name)
        if not os.path.isfile(path):
            continue
        text = open(path, encoding="utf-8").read()

        def repl(m: re.Match) -> str:
            head, quote, value = m.group(1), m.group(2), m.group(3)
            iso = to_iso(value)
            if iso != value:
                changed.append((name, value, iso))
            return f"{head}{quote}{iso}{quote}"

        new = PAT.sub(repl, text)
        if new != text:
            open(path, "w", encoding="utf-8").write(new)

    for name, old, new in changed:
        print(f"  {name:34} {old:14} -> {new}")
    print(f"{len(changed)} field(s) converted in {base}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "src/content/blog"))
