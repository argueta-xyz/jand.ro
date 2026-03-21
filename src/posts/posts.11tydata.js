const fs = require('fs');
const { extractTocFromMarkdown } = require('../_utils/post-markdown.js');

module.exports = {
  eleventyComputed: {
    toc(data) {
      if (data.layout !== 'layouts/post.njk') return [];
      const raw = fs.readFileSync(data.page.inputPath, 'utf8');
      const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      return extractTocFromMarkdown(body);
    },
  },
};
