import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    // 1) Add the remark plugin
    remarkPlugins: [
      function removeFirstH1() {
        return function (tree) {
          // if the first node is an H1, remove it
          if (
            tree.children?.[0]?.type === 'heading' &&
            tree.children[0].depth === 1
          ) {
            tree.children.shift(); // remove the heading node
          }
        };
      },
    ],
    // 2) Shiki config remains the same
    shikiConfig: {
      themes: {
        light: 'poimandres',
        dark: 'catppuccin-latte',
      },
    },
  },
});
