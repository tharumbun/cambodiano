import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

files.forEach((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  let { data, content } = matter(raw);

  // 1) Normalize weird Unicode slash/spaces
  content = content
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')  // remove zero-width
    .replace(/[\u2044\u2215]/g, '/');       // fraction slash -> ASCII slash

  // 2) Promote first line (# Title) if no frontmatter title
  if (!data.title) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine.startsWith('# ')) {
      data.title = firstLine.slice(2); // remove "# "
      lines.shift();
      content = lines.join('\n').trim();
    }
  }

  // 3) Convert #tag -> link only if not already linked
  content = content.replace(/\B#(\S+)/g, (match, tagName, offset, str) => {
    // If there's a "[" right before it, skip (already linkified)
    if (str[offset - 1] === '[') return match;
    return `[${match}](/tags/${encodeURIComponent(tagName)})`;
  });

  // 4) Build or merge tags in front matter if desired
  if (!data.tags) {
    const newTags = [];
    // find all #something in final content
    const matches = content.match(/\B#(\S+)/g);
    if (matches) {
      for (const t of matches) {
        newTags.push(t.slice(1)); // remove "#"
      }
    }
    data.tags = newTags;
  }

  // 5) Final data
  data.description ||= '';
  data.pubDate ||= new Date().toISOString().split('T')[0];

  const updated = matter.stringify(content, data);
  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(`Updated file: ${file}, final title: "${data.title}"`);
});
