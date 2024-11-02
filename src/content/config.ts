import { defineCollection, z } from "astro:content";

const explorations = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      date: z.string(),
    }),
});

export const collections = {
  explorations,
};
