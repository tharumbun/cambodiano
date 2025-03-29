import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the folders to process
const folders = [
  path.join(process.cwd(), 'src/content/writing'),
  path.join(process.cwd(), 'src/content/thought'), // singular folder name
  path.join(process.cwd(), 'src/content/bookshelf')
];

folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    console.warn(`Directory does not exist: ${folder}`);
    return;
  }

  const files = fs.readdirSync(folder).filter((file) => file.endsWith('.md'));

  files.forEach((file) => {
    const fullPath = path.join(folder, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    let { content, data } = matter(raw);

    // 1. Promote the first line (if starting with "# ") into the title if not set.
    if (!data.title) {
      const lines = content.split('\n');
      const firstLine = lines[0].trim();
      if (firstLine.startsWith('# ')) {
        data.title = firstLine.slice(2).trim();
        lines.shift();
        content = lines.join('\n').trim();
      }
    }

    // 2. Extract inline tags using regex (optional)
    const tagMatches = content.match(/\B#(\S+)/g) || [];
    const extractedTags = tagMatches
      .map((tag) => tag.slice(1).trim())
      .filter(
        (tag) =>
          tag !== '' &&
          /[A-Za-z0-9]/.test(tag) &&
          tag.toLowerCase() !== 'status/publish'
      );
    if (!data.tags) {
      data.tags = extractedTags;
    }
    content = content.replace(/\B#(\S+)/g, '');

    // 3. Set defaults for other required fields:
    //    - description: a default empty string (or you can set a generic description)
    //    - category: default to 'uncategorized' if missing
    //    - pubDate: if not present, use the current date (or consider parsing a date from elsewhere)
    //    - updatedDate: default to the pubDate if not provided
    data.description = data.description || '';
    data.category = data.category || 'uncategorized';
    data.pubDate = data.pubDate || new Date().toISOString().split('T')[0];
    data.updatedDate = data.updatedDate || data.pubDate;

    // Write back the updated front matter and content
    const updated = matter.stringify(content, data);
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`Processed file: ${fullPath} (title: "${data.title}", tags: ${JSON.stringify(data.tags)})`);
  });
});
