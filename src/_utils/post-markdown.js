const markdownIt = require('markdown-it');
const anchor = require('markdown-it-anchor').default;

const anchorOptions = {
  permalink: false,
  level: 2,
};

function buildMarkdownForPosts() {
  return markdownIt({html: true}).use(anchor, anchorOptions);
}

function extractTocFromMarkdown(markdownBody) {
  const toc = [];
  const md = markdownIt({html: true}).use(anchor, {
    ...anchorOptions,
    callback(token, info) {
      toc.push({
        level: parseInt(token.tag.slice(1), 10),
        text: info.title,
        slug: info.slug,
      });
    },
  });
  md.render(markdownBody || '');
  return toc;
}

module.exports = {
  buildMarkdownForPosts,
  extractTocFromMarkdown
};
