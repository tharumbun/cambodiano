// scripts/add-frontmatter.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

files.forEach((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(raw);

  // Separate front matter data from the content
  let { content } = parsed;
  let newTitle = parsed.data.title || path.basename(file, '.md');

  // 1) Promote the first line (# Heading) to front matter title if it exists
  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  if (firstLine.startsWith('# ')) {
    newTitle = firstLine.replace(/^#\s+/, '');
    lines.shift();
    content = lines.join('\n').trim();
  }

  // 2) Convert inline #tags => [#tag](/tags/tag),
  //    but only if not already preceded by “[” (which would mean it's already linked).
  content = content.replace(/\B#(\S+)/g, (fullMatch, tagName, offset, entireString) => {
    // Check the character before the “#”
    const precedingChar = entireString[offset - 1];
    // If there's a “[” immediately before the #, skip (already linked).
    if (precedingChar === '[') {
      return fullMatch;
    }
    // Otherwise, linkify
    return `[${fullMatch}](/tags/${encodeURIComponent(tagName)})`;
  });

  // 3) Extract tags for front matter by scanning #tag in the final content
  const tagMatches = content.match(/\B#(\S+)/g);
  const extractedTags = tagMatches ? tagMatches.map(t => t.slice(1)) : [];
  // Use existing front matter tags if present; otherwise use extracted
  const tags = parsed.data.tags || extractedTags;

  // 4) Merge final front matter data
  const data = {
    ...parsed.data,
    title: newTitle,
    description: parsed.data.description || '',
    pubDate: parsed.data.pubDate || new Date().toISOString().split('T')[0],
    tags,
  };

  // 5) Write the updated file
  const updated = matter.stringify(content, data);
  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(`Updated: ${file} (title: "${newTitle}", tags: ${JSON.stringify(tags)})`);
});
