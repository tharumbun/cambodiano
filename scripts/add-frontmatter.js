// scripts/add-frontmatter.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the blog directory relative to the project root
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

// Get all Markdown files in the blog directory
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

files.forEach((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  let { content, data } = matter(raw);

  // 1. Promote the first line if it starts with "# " into front matter 'title'
  if (!data.title) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine.startsWith('# ')) {
      data.title = firstLine.slice(2).trim();
      lines.shift(); // remove the first heading line
      content = lines.join('\n').trim();
    }
  }

  // 2. Extract inline tags using regex \B#(\S+)
  const tagMatches = content.match(/\B#(\S+)/g) || [];
  
  // Map each match (e.g. "#tools/astro") to "tools/astro" and filter:
  //   - Remove empty strings
  //   - Remove tags that don't contain any alphanumeric character (i.e. stray "#")
  //   - Remove the "publish" tag (case-insensitive)
  const extractedTags = tagMatches
    .map((tag) => tag.slice(1).trim())
    .filter(
      (tag) =>
        tag !== '' &&
        /[A-Za-z0-9]/.test(tag) && // must contain at least one letter or digit
        tag.toLowerCase() !== 'publish'
    );

  // 3. Merge with any existing tags in front matter or assign if missing.
  if (!data.tags) {
    data.tags = extractedTags;
  }
  // Alternatively, to combine:
  // data.tags = [...new Set([...(data.tags || []), ...extractedTags])];

  // 4. Remove inline tags from the body so they don't appear twice.
  content = content.replace(/\B#(\S+)/g, '');

  // 5. Ensure required front matter fields have defaults.
  data.description = data.description || '';
  data.pubDate = data.pubDate || new Date().toISOString().split('T')[0];

  // 6. Write the updated content and front matter back to the file.
  const updated = matter.stringify(content, data);
  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(
    `Processed file: ${file} (title: "${data.title}", tags: ${JSON.stringify(
      data.tags
    )})`
  );
});
