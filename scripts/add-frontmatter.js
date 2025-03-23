// scripts/add-frontmatter.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 1) Point this at your markdown folder
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

// 2) Read every .md file
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md'));

files.forEach((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');

  // 3) Parse using gray-matter
  const parsed = matter(raw);

  // 4) If frontmatter is empty, add some default values
  if (!Object.keys(parsed.data).length) {
    // For example, a default date & empty title:
    parsed.data = {
      title: path.basename(file, '.md'),
      description: '',
      pubDate: new Date().toISOString().split('T')[0],
    };

    // 5) Convert back to string w/ front matter
    const updated = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Added front matter to: ${file}`);
  }
});
