import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

(async () => {
  // 1) Recursively find all .md files in src/content/blog (adjust path as needed)
  const mdPaths = await fg('src/content/blog/**/*.md');

  for (const mdPath of mdPaths) {
    let content = fs.readFileSync(mdPath, 'utf8');

    // 2) Regex to match Obsidian/Bear wiki link: [[Some Title]]
    //    We convert to [Some Title](/blog/some-title)
    content = content.replace(/\[\[([^]+?)\]\]/g, (match, wikiTitle) => {
      // e.g. "B. Feel-Good Productivity"
      // Slugify "B. Feel-Good Productivity" => "b-feel-good-productivity"
      const slug = wikiTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric => "-"
        .replace(/^-|-$/g, '');     // remove leading/trailing dashes

      // Return normal Markdown link
      return `[${wikiTitle}](/blog/${slug})`;
    });

    // 3) Write updated content back to disk
    fs.writeFileSync(mdPath, content, 'utf8');
    console.log(`Rewrote wiki links in: ${mdPath}`);
  }
})();
