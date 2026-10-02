---
title: "bhaga.dev"
description: "This site. A static Astro blog with a hand-tuned Radix palette, a compact post list, and no client-side framework."
url: "https://bhaga.dev"
github: "https://github.com/TheSagab/bhaga.dev"
tech: ["astro", "tailwindcss", "mdx", "typescript"]
featured: true
date: "2026-10-02"
---

The site you are reading. It is deliberately small: static pages, no client
framework, and a stylesheet that does almost all of the work.

## What is here

- **Astro**, static output, with MDX for the posts that need components.
- **Tailwind CSS v4**, driven entirely by custom properties, so the palette can be
  swapped per theme without touching component markup.
- **One post list component** shared by the home page, `/blog` and every tag
  page, so those three cannot drift apart.

## Decisions worth noting

The palette is the Radix cyan, slate and gray scales converted to oklch, kept in
`global.css` with the source hex in a trailing comment. The first version was
hand-rounded and lost the scale's shape, which left light-mode body text at
roughly 10:1 instead of 16:1. See `DESIGN-NOTES.md` for that and the rest.

Formatting and linting are Prettier and oxlint; `pnpm build` runs `astro check`
first, so a type error fails the build.
