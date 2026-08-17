import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const noticias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/noticias" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    author: z.string().default("AC Monsefú"),
  }),
});

export const collections = { noticias };