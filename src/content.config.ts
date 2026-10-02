import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Astro 6+ requires each collection to declare a loader and the config to live
// at src/content.config.ts. The shapes below are unchanged from the pre-v6
// `type: 'content'` form, so frontmatter stays as it was.
// Dates are date-only: `YYYY-MM-DD`, validated as such and kept as strings.
//
// Deliberately not a Date. A post's date is a calendar date, not an instant, and
// converting it through Date reintroduces a timezone: `new Date("2022-07-08")`
// is UTC midnight, so formatting it locally in any negative-offset timezone
// renders the 7th. The previous `z.coerce.date()` accepted free-form strings and
// had exactly that bug: `Jul 08 2022` was parsed in the build machine's zone and
// formatted in another, so the site rendered `2022-07-07` for a post dated the
// 8th, and the RSS feed published `07 Jul 2022 17:00:00 GMT`.
// Keeping the string makes sorting, display and the feed independent of where the
// build runs. Nothing here should construct a Date from these values.
const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected a YYYY-MM-DD date");

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: dateOnly,
    updatedDate: dateOnly.optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    tech: z.array(z.string()).optional(),
  }),
});

export const collections = { blog, projects };
