// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

import commonjs from "vite-plugin-commonjs";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    // @ts-ignore
    plugins: [tailwindcss(), commonjs()],
  },
});
