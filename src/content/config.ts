import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
	}),
});

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string().url().optional(),
		github: z.string().url().optional(),
		tech: z.array(z.string()).optional(),
		featured: z.boolean().optional().default(false),
		date: z.coerce.date().optional(),
	}),
});

export const collections = { blog, projects };
