# Design notes

Running log of design decisions on this site, including the ones that were
prototyped and then deliberately parked. Prototype code lives on throwaway
branches (`prototype/*`); `main` keeps only the decisions that were made.

## Dependencies: on latest, TypeScript held at 6 (SETTLED)

**Decision:** every dependency is on its latest release except TypeScript, which
is pinned to `^6`. `astro check` refuses TypeScript 7 ("does not currently
support TypeScript 7.0"), and `pnpm build` runs `astro check`, so TS 7 breaks the
build. Move to 7 when `@astrojs/ts-content-mapper` is no longer experimental.

**Upgrade notes:** Astro 5 to 7 needed three source changes, all mechanical:

- `experimental.fonts` is now top-level `fonts`.
- Content config moves from `src/content/config.ts` to `src/content.config.ts`,
  and each collection declares a loader (`glob`).
- In the loader API `post.slug` became `post.id`, `post.render()` became the
  `render()` import from `astro:content`, and `post.body` is now optional.

The `projects` collection is restored and declares a glob loader over
`src/content/projects`, with the pre-v6 schema (`url`, `github`, `tech`,
`featured`, `date`). It currently holds one entry, this site. No page renders it
yet, so the collection is data-only for now; `/projects` is still a stub.

**UI equivalence is verified, not assumed.** `scripts/ui-fingerprint.sh` hashes
the build; a stricter comparison checks that every page's visible words, class
sets and link targets are unchanged. All 18 pages match, as do `rss.xml` links
and the sitemap URLs. Two build-output changes were confirmed harmless:
Tailwind rewrites `calc(var(--spacing) * 1)` to `var(--spacing)`, and Astro 7 may
change `--font-sans` (unused, `body` sets Jakarta explicitly). Astro 7 also stops
emitting legacy woff fallbacks; the four woff2 files are byte-identical to before,
and italics were already browser-synthesised in both versions, so nothing moves.

## Palette: real Radix scales (SETTLED)

**Decision:** `:root` and `.dark` in `global.css` hold the cyan, slate and gray
scales, converted from Radix to oklch. Each value carries the hex it came from
in a trailing comment, so it can be checked and regenerated. Regenerate, never
hand-tune.

**Question it settled:** are these actually the Radix scales, or an
approximation? They were an approximation. Two things were wrong:

- Cyan was pinned at hue 210 for every step. Radix cyan runs 203-222, shifting
  blue-ward as it darkens. A flat hue makes the light steps mint-ish and the dark
  steps under-saturated.
- `slate-12`, the body and heading colour, was a mid grey instead of near-black.
  Light-mode body text measured 9.9:1 against the page instead of 16:1, which is
  what made light mode look washed out.

The dark theme was off too, in the other direction: `slate-1` through `slate-10`
were two to three steps darker than Radix (page background `#0d0e11` vs
`#111113`), while `slate-11` was much lighter, at 12.6:1 where Radix intends 9:1.
Loud secondary text rather than washed-out, so it escaped notice.

**How it is verified:** every value in `global.css` is checked to round-trip to
the hex in its trailing comment, so what ships is Radix's published colour rather
than a re-derivation. Light body text now 15.98:1, dark 16.25:1; both themes pass
WCAG AA for body and secondary text.

**No runtime dependency:** the package `@radix-ui/colors` was removed once the
values were settled. It was only ever the source of the numbers, never imported,
and keeping it implied the build depended on something it did not. To regenerate,
reinstall it temporarily, convert its hex values to oklch, and delete it again.
The scale is pinned by the trailing hex comments rather than by the package.

**Prototype (primary source):** branch `prototype/light-palette`, route
`/prototype/light`, switched with `?v=<old|radix|side>`. `old` keeps the previous
hand-tuned values so the change can be seen, `side` shows both at once. Toggle
the site's dark mode while on `side` to check the dark scales. Run with
`pnpm dev` (the route is on-demand rendered).

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

## Post list: ledger with linked tags (SETTLED)

**Decision:** `src/components/PostList.astro` is the post list, used by the home
page (5 most recent), `/blog` (full archive) and every `/blog/tag/[tag]` page.

**Question it settled:** how compact should the list be, and what belongs in a
row? A fixed monospace date column, then title / blurb, with reading time and
linked tags in a right-hand meta column. No background change on hover: only the
link targets respond, which keeps a long archive calm.

**Prototype (primary source):** branch `prototype/blog-list`, route
`/prototype/blog-list`, switched with `?s=<A|B|E|F>.<home|blog>.<real|long>`.
Four shapes were built (ledger / chevron / rail / editorial), narrowed to the
ledger, then E added reading time and F added tag links. F won. That branch also
carries the fixture posts used to judge the list at 20 posts; they are
prototype-only and do not belong here.

**Constraint to keep:** tags are links, so the row cannot be one big anchor.
`<a>` inside `<a>` is invalid and browsers break it apart. The title and the
blurb are linked separately; the reading time and tags sit outside both. Verified
there are zero nested anchors across every built page.

**Where tags appear:** the list (`PostList.astro`) shows them in the row's
right-hand meta column, and each post page shows them above the title, so they
read as context before the article. Both link to `/blog/tag/<tag>` with the same
cyan-plus-underline hover, so a tag reads the same wherever it appears.

**One meta line, one style:** the post page's date / reading time / updated line
uses the list's mono treatment (`font-mono text-sm` with middot separators), not
the proportional face with bullet separators it used before. The two places a
reader sees post metadata now look like the same system.

**Knock-on changes:** `/blog` and `/blog/tag/[tag]` lost their large 4xl-title
cards for this list, which is what made the archive compact. `FormattedDate` is
no longer used by any list (the component emits its own ISO date); it is still
used by `BlogPost`.

## Home: post list, no spotlight

**Decision:** the home page drops the "Latest post" spotlight panel and shows
every post in the dated rail grouped by year. One list, no featured item.

**Question it settles:** should the newest post get a promoted panel, or should
the home page be a single flat log of posts?

The rail's header link reads "All posts →" (it points at `/blog`, which still
carries tags).

## Home: how many posts to show

**Decision:** the home page shows the 5 most recent posts and links to `/blog`
for the rest. `/blog` is the full archive.

**Question it settles:** should the home page carry every post, or a short
recent list?

A flat rail of everything does not stay readable as the archive grows, and the
year grouping stopped meaning anything once every post landed in one year. The
cap is a single `HOME_LIMIT` constant in `src/pages/index.astro`.

## Earlier prototypes (decided, folded in)

- `prototype/home-redesign` (`afb1007`) settled as: latest post spotlight panel
  plus a dated rail grouped by year. Folded in `48a9509`.
- `prototype/home-intro` (`490bbcd`) settled as: profile row intro (monogram,
  full name, `Bhaga / @TheSagab`). Folded in `29c279e`.
