#!/usr/bin/env python3
"""Replace Tailwind slate-* pairs with design tokens (foreground, muted, border, card)."""

import re
import sys
from pathlib import Path

REPLACEMENTS: list[tuple[str, str]] = [
    # Longest / most specific first
    (
        r"border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950",
        "border-border bg-card p-4",
    ),
    (
        r"border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        "border-border bg-card",
    ),
    (
        r"rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        "rounded-lg border border-border bg-card",
    ),
    (
        r"border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
        "border border-border bg-card",
    ),
    (r"bg-white dark:bg-slate-950", "bg-card"),
    (r"border-slate-200 dark:border-slate-800", "border-border"),
    (r"border-slate-100 dark:border-slate-800/80", "border-border"),
    (r"border-slate-100 dark:border-slate-800", "border-border"),
    (r"border-slate-200/80 dark:border-slate-800", "border-border"),
    (r"divide-slate-200 dark:divide-slate-800", "divide-border"),
    (r"border-t border-slate-200 dark:border-slate-800", "border-t border-border"),
    (r"border-b border-slate-200 dark:border-slate-800", "border-b border-border"),
    (r"border-b border-slate-200 px-4 dark:border-slate-800", "border-b border-border px-4"),
    (r"border-b border-slate-200 bg-slate-50", "border-b border-border bg-muted"),
    (r"border-slate-200 px-4 dark:border-slate-800", "border-border px-4"),
    # Text
    (r"text-slate-900 dark:text-slate-50", "text-foreground"),
    (r"text-slate-800 dark:text-slate-200", "text-foreground"),
    (r"text-slate-800 dark:text-slate-100", "text-foreground"),
    (r"text-slate-700 dark:text-slate-200", "text-foreground"),
    (r"text-slate-700 dark:text-slate-300", "text-muted-foreground"),
    (r"text-slate-600 dark:text-slate-300", "text-muted-foreground"),
    (r"text-slate-600 dark:text-slate-400", "text-muted-foreground"),
    (r"text-slate-500 dark:text-slate-400", "text-muted-foreground"),
    (r"text-slate-500 dark:text-slate-500", "text-muted-foreground"),
    # Backgrounds / hovers
    (r"bg-slate-50 dark:bg-slate-950", "bg-muted"),
    (r"bg-slate-50 dark:bg-slate-900", "bg-muted"),
    (r"bg-slate-50 dark:bg-slate-900/30", "bg-muted/80"),
    (r"hover:bg-slate-50 dark:hover:bg-slate-900/30", "hover:bg-muted/70"),
    (r"bg-slate-50/80 dark:bg-slate-900/50", "bg-muted/90"),
    (r"bg-slate-50 dark:bg-slate-900/20", "bg-muted/70"),
    (r"active && \"bg-slate-50 dark:bg-slate-900/30\"", 'active && "bg-muted/70"'),
    (r"bg-slate-100 dark:bg-slate-800", "bg-muted"),
    # Table / header row
    (
        r"border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
        "border-b border-border bg-muted/50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
    ),
    (r"border-b border-slate-200 px-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200", "border-b border-border px-4 text-sm text-foreground"),
    # Dashed empty state
    (r"border-dashed border-slate-300 p-8 text-center dark:border-slate-700", "border-dashed border-border p-8 text-center"),
    # Inputs (sort-menu pattern)
    (
        r'h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm',
        "h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm",
    ),
    (
        r'focus:outline-none focus:ring-2 focus:ring-slate-400/60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        "focus:outline-none focus:ring-2 focus:ring-ring dark:border-border dark:bg-card dark:text-foreground",
    ),
    # Progress bar fill
    (r"bg-slate-900 dark:bg-slate-50", "bg-foreground"),
    # Skeleton
    (r"bg-slate-200/70 dark:bg-slate-800/60", "bg-muted-foreground/15 dark:bg-muted-foreground/20"),
    # Pass 2 — remaining common combos
    (
        r"h-9 rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950",
        "h-9 rounded-md border border-border bg-card px-2 text-sm",
    ),
    (
        r"h-8 rounded-md border border-slate-200 bg-white px-2 text-xs dark:border-slate-800 dark:bg-slate-950",
        "h-8 rounded-md border border-border bg-card px-2 text-xs",
    ),
    (
        r"h-9 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950",
        "h-9 rounded-md border border-border bg-card px-3 text-sm",
    ),
    (
        r"h-9 min-w-[11rem] rounded-md border border-slate-200 bg-white px-2 text-sm dark:border-slate-800 dark:bg-slate-950",
        "h-9 min-w-[11rem] rounded-md border border-border bg-card px-2 text-sm",
    ),
    (
        r"min-h-[140px] rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950",
        "min-h-[140px] rounded-md border border-border bg-card p-3 text-sm",
    ),
    (
        r'"rounded-lg border bg-white p-3 transition-colors dark:bg-slate-950"',
        '"rounded-lg border border-border bg-card p-3 transition-colors"',
    ),
    (r"border-t border-slate-100 pt-2 dark:border-slate-800", "border-t border-border pt-2"),
    (r"min-h-[320px] rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30", "min-h-[320px] rounded-lg border border-border bg-muted/40 p-4"),
    (r"mt-4 border-t border-slate-200 pt-4 dark:border-slate-800", "mt-4 border-t border-border pt-4"),
    (
        r"max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950",
        "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl",
    ),
    (
        r"rounded-lg border border-slate-200 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20",
        "rounded-lg border border-border p-3 text-left transition hover:border-primary hover:bg-accent/80 dark:hover:bg-accent/30",
    ),
    (r'text-slate-600 underline dark:text-slate-300', "text-muted-foreground underline"),
    (r"rounded bg-slate-100 px-1 dark:bg-slate-900", "rounded bg-muted px-1"),
    (r"mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950", "mt-4 rounded-lg border border-border bg-card p-4 text-sm"),
    (r"rounded-lg border border-slate-100 p-3 dark:border-slate-800/80", "rounded-lg border border-border p-3"),
    (
        r"h-9 cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
        "h-9 cursor-not-allowed rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground",
    ),
    (
        r"h-9 cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-800 dark:bg-slate-900",
        "h-9 cursor-not-allowed rounded-md border border-border bg-muted px-3 text-sm",
    ),
    (r"border-b border-slate-200 py-2 pr-3 dark:border-slate-800", "border-b border-border py-2 pr-3"),
    (r"border-b border-slate-200 px-2 py-2 text-center dark:border-slate-800", "border-b border-border px-2 py-2 text-center"),
    (r"border-b border-slate-100 py-2.5 pr-3 dark:border-slate-800/80", "border-b border-border py-2.5 pr-3"),
    (r"border-b border-slate-100 px-2 py-2.5 text-center dark:border-slate-800/80", "border-b border-border px-2 py-2.5 text-center"),
    (r"flex flex-col gap-0.5 rounded-md border border-slate-100 p-3 dark:border-slate-800/80", "flex flex-col gap-0.5 rounded-md border border-border p-3"),
    (r"flex flex-col gap-1 rounded-md border border-slate-100 p-3 dark:border-slate-800/80", "flex flex-col gap-1 rounded-md border border-border p-3"),
    (r"rounded-md border border-slate-100 p-3 dark:border-slate-800/80", "rounded-md border border-border p-3"),
    (r"text-slate-300 dark:text-slate-600", "text-muted-foreground/40"),
    (r"mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400", "mt-6 border-t border-border pt-4 text-xs text-muted-foreground"),
    (r"rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800/80", "rounded-md border border-border px-3 py-2"),
    (
        r"inline-flex h-8 items-center justify-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800",
        "inline-flex h-8 items-center justify-center rounded-md bg-muted px-3 text-sm font-medium text-foreground hover:bg-muted/80 dark:hover:bg-muted/70",
    ),
    (r"flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 dark:border-slate-800/80", "flex items-center justify-between rounded-md border border-border px-3 py-2"),
    (r"rounded-md border border-slate-200 p-3 dark:border-slate-800", "rounded-md border border-border p-3"),
    (
        r"rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-200",
        "rounded-lg border border-border bg-muted/60 p-4 text-sm text-foreground",
    ),
    (r"rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/20", "rounded-md border border-border bg-muted/60 p-3"),
    (r"flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800", "flex items-start justify-between gap-3 rounded-md border border-border p-3"),
    (r"rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/20", "rounded-lg border border-border bg-muted/60 p-4"),
    (r"rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800", "rounded-md border border-border p-3 text-sm"),
    (r"rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm dark:border-slate-800 dark:bg-slate-900/40", "rounded-lg border border-border bg-muted/70 p-4 text-sm"),
    (r"space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400", "space-y-2 border-t border-border pt-4 text-xs text-muted-foreground"),
    (r"border-slate-200 shadow-sm dark:border-slate-800", "border-border shadow-sm"),
    (r"shrink-0 border-t border-slate-200 pt-2 dark:border-slate-800", "shrink-0 border-t border-border pt-2"),
    (r"pointer-events-none absolute inset-y-0 w-px bg-slate-400/70 dark:bg-slate-500/70", "pointer-events-none absolute inset-y-0 w-px bg-border"),
    (r"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"),
    (
        r"flex flex-col gap-1 border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800",
        "flex flex-col gap-1 border-b border-border py-3 last:border-b-0",
    ),
    (
        r"h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-200",
        "h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-foreground dark:border-muted-foreground/30 dark:border-t-foreground",
    ),
    (
        r"max-h-[420px] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100",
        "max-h-[420px] overflow-auto rounded-md border border-border bg-muted/50 p-3 text-sm text-foreground",
    ),
    (
        r"break-all rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100",
        "break-all rounded-md border border-border bg-muted/50 p-3 text-sm text-foreground",
    ),
    (
        r"mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-200",
        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-semibold text-foreground",
    ),
    (
        r"border-b border-border bg-muted px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300",
        "border-b border-border bg-muted px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
    ),
    (
        r"border-b border-slate-200 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200",
        "border-b border-border px-4 py-2.5 text-sm text-foreground",
    ),
    (
        r"border-b border-slate-200 px-4 py-2.5 text-right text-sm tabular-nums text-slate-700 dark:border-slate-800 dark:text-slate-200",
        "border-b border-border px-4 py-2.5 text-right text-sm tabular-nums text-foreground",
    ),
    (r"border-b border-slate-200 px-4 py-2.5 text-right dark:border-slate-800", "border-b border-border px-4 py-2.5 text-right"),
    (
        r"grid border-b border-border bg-muted dark:border-slate-800 dark:bg-slate-900/40",
        "grid border-b border-border bg-muted",
    ),
    (
        r"h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm",
        "h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground shadow-sm",
    ),
    (
        r"placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring dark:border-border dark:bg-card dark:text-foreground dark:placeholder:text-slate-500",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:border-border dark:bg-card dark:text-foreground",
    ),
    (
        r"flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800",
        "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
    ),
    (r"rounded-md border border-slate-200 p-3 dark:border-slate-800", "rounded-md border border-border p-3"),
    (r"flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800", "flex items-start justify-between gap-3 border-b border-border px-4 py-3"),
    (r"border-b border-slate-200 px-4 py-3 dark:border-slate-800", "border-b border-border px-4 py-3"),
]


def migrate_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    roots = [Path("apps/web/src"), Path("packages/ui/src")]
    changed = 0
    for root in roots:
        if not root.exists():
            continue
        for path in root.rglob("*.tsx"):
            if migrate_file(path):
                print(path)
                changed += 1
    print(f"Updated {changed} files.", file=sys.stderr)


if __name__ == "__main__":
    main()
