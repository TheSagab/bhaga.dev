import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Astro 6+ requires each collection to declare a loader and the config to live
// at src/content.config.ts. The shapes below are unchanged from the pre-v6
// `type: 'content'` form, so frontmatter stays as it was.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
