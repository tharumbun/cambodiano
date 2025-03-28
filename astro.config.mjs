import { defineConfig } from 'astro/config';
import { visit } from 'unist-util-visit';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// 1) Plugin to remove the first H1 heading
function removeFirstH1() {
  return (tree) => {
    if (
      tree.children?.[0]?.type === 'heading' &&
      tree.children[0].depth === 1
    ) {
      tree.children.shift(); // remove the first heading node
    }
  };
}

// 2) Plugin to turn "[Something](file.md)" into "[Something](/blog/something)"
function remarkLocalLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      // e.g. node.url = "B. Feel-Good Productivity.md"
      if (node.url.endsWith('.md')) {
        // Remove ".md"
        let base = node.url.replace(/\.md$/, '');
        // Slugify "B. Feel-Good Productivity" => "b-feel-good-productivity"
        let slug = base
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') // collapse non-alphanumeric
          .replace(/^-|-$/g, '');     // remove leading/trailing dashes

        // Final link => "/blog/b-feel-good-productivity"
        node.url = `/blog/${slug}`;
      }
    });
  };
}

export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    // Add both plugins to remarkPlugins
    remarkPlugins: [removeFirstH1, remarkLocalLinks],
    shikiConfig: {
      themes: {
        light: 'poimandres',
        dark: 'catppuccin-latte',
      },
    },
  },
});
