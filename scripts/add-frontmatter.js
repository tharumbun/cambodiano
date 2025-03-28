// scripts/add-frontmatter.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

files.forEach((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  let { content, data } = matter(raw);

  // (A) Promote first line "# Heading" to front matter `title` if not set
  if (!data.title) {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine.startsWith('# ')) {
      data.title = firstLine.slice(2);
      lines.shift();
      content = lines.join('\n').trim();
    }
  }

  // (B) Extract #tags from the body
  //     This captures anything that looks like `#some-tag` until whitespace
  const allMatches = content.match(/\B#(\S+)/g) || [];
  // Turn ["#type/quote", "#status/launching"] into ["type/quote", "status/launching"]
  const extractedTags = allMatches.map((tag) => tag.slice(1));

  // (C) Merge with any existing front matter tags, if you want
  if (!data.tags) {
    data.tags = extractedTags;
  } else {
    // If you want to combine, uncomment:
    // data.tags = [...new Set([...data.tags, ...extractedTags])];
  }

  // (D) Remove #tags from the body entirely, so they only appear in the front matter
  content = content.replace(/\B#(\S+)/g, '');

  // (E) Fill out required front matter fields
  data.description ||= '';
  data.pubDate ||= new Date().toISOString().split('T')[0];

  // (F) Stringify back to Markdown with updated front matter & content
  const updated = matter.stringify(content, data);
  fs.writeFileSync(fullPath, updated, 'utf8');
  console.log(`Processed file: ${file} (title: "${data.title}")`);
});
