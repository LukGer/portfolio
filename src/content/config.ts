import { defineCollection, z } from "astro:content";

const explorations = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      date: z.string(),
    }),
});

export const collections = {
  explorations,
};
