# Design notes

Running log of design decisions on this site, including the ones that were
prototyped and then deliberately parked. Prototype code lives on throwaway
branches (`prototype/*`); `main` keeps only the decisions that were made.

## Type: main font, PARKED (revisit later)

**Decision:** keep Plus Jakarta Sans as the main font for now (Mode A in the
prototype: Jakarta everywhere, JetBrains Mono reserved for accents: rail dates,
handle, monogram, code).

**Question it settles:** should the site's main font be Plus Jakarta Sans or
JetBrains Mono?

**Recommendation on record:** mono headings with a Jakarta body (Mode C), so the
mono voice carries the display type while long-form prose keeps a proportional
face. Reasons: mono advances ~20% wider, so body copy at the current width runs
to ~95 characters a line (comfortable is 60-75); word shapes stop varying, which
slows scanning over paragraphs; and bold/italic carry little weight in mono, so
hierarchy has to lean on rules and spacing instead.

Mode B (mono everywhere) is defensible if the site stays short-form and
code-heavy, with the prose measure tightened to ~68ch.

**Prototype:** branch `prototype/font-choice` (commit `fa2caeb`). Site-wide
switcher, `?type=A|B|C`, dev-only, mounted in `Layout.astro`.

## Home: post list, no spotlight

**Decision:** the home page drops the "Latest post" spotlight panel and shows
every post in the dated rail grouped by year. One list, no featured item.

**Question it settles:** should the newest post get a promoted panel, or should
the home page be a single flat log of posts?

The rail's header link now reads "Blog index →" (it points at `/blog`, which
still carries tags), since "All posts →" no longer distinguishes anything.

## Earlier prototypes (decided, folded in)

- `prototype/home-redesign` (`afb1007`) settled as: latest post spotlight panel
  plus a dated rail grouped by year. Folded in `48a9509`.
- `prototype/home-intro` (`490bbcd`) settled as: profile row intro (monogram,
  full name, `Bhaga / @TheSagab`). Folded in `29c279e`.
