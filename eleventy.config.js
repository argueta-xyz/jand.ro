const {buildMarkdownForPosts} = require('./src/_utils/post-markdown.js');

function tagSlug(name) {
  return String(name)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({'src/assets': 'assets'});

  eleventyConfig.setLibrary('md', buildMarkdownForPosts());

  eleventyConfig.addGlobalData('currentYear', () => new Date().getFullYear());

  eleventyConfig.addCollection(
      'posts',
      (collectionApi) =>
          collectionApi.getFilteredByGlob('src/posts/*.md')
              .filter((item) => item.data.layout === 'layouts/post.njk')
              .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection('postTagIndex', (collectionApi) => {
    const bySlug = new Map();
    const postItems =
        collectionApi.getFilteredByGlob('src/posts/*.md')
            .filter((item) => item.data.layout === 'layouts/post.njk');
    postItems.forEach((item) => {
      const tags = item.data.tags;
      if (!Array.isArray(tags)) return;
      tags.forEach((raw) => {
        const name = String(raw).trim();
        if (!name) return;
        const slug = tagSlug(name);
        if (!slug) return;
        if (!bySlug.has(slug)) bySlug.set(slug, {slug, name});
      });
    });
    return Array.from(bySlug.values())
        .sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addCollection(
      'albums',
      (collectionApi) =>
          collectionApi.getFilteredByGlob('**/albums/**/*.md')
              .filter((item) => item.data.layout === 'layouts/album.njk')
              .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection('albumTagIndex', (collectionApi) => {
    const bySlug = new Map();
    const albumItems =
        collectionApi.getFilteredByGlob('**/albums/**/*.md')
            .filter((item) => item.data.layout === 'layouts/album.njk');
    albumItems.forEach((item) => {
      const tags = item.data.tags;
      if (!Array.isArray(tags)) return;
      tags.forEach((raw) => {
        const name = String(raw).trim();
        if (!name) return;
        const slug = tagSlug(name);
        if (!slug) return;
        if (!bySlug.has(slug)) bySlug.set(slug, {slug, name});
      });
    });
    return Array.from(bySlug.values())
        .sort((a, b) => a.name.localeCompare(b.name));
  });

  function photoToLightboxPayload(photo) {
    if (!photo || typeof photo !== 'object') return null;
    const exif = photo.exif && typeof photo.exif === 'object' &&
            Object.keys(photo.exif).length ?
        photo.exif :
        null;
    return {
      src: photo.url || '',
      alt: photo.alt || '',
      caption: photo.caption || '',
      location: photo.location || '',
      exif,
    };
  }

  eleventyConfig.addFilter('lightboxPayload', (photo) => {
    const p = photoToLightboxPayload(photo);
    return p ? JSON.stringify(p).replace(/</g, '\\u003c') : '';
  });

  eleventyConfig.addFilter('lightboxSeriesJson', (photos) => {
    if (!photos || !Array.isArray(photos)) return '[]';
    const arr = photos.map(photoToLightboxPayload).filter((p) => p && p.src);
    return JSON.stringify(arr).replace(/</g, '\\u003c');
  });

  eleventyConfig.addFilter('albumCoverUrl', (data) => {
    if (!data || typeof data !== 'object') return '';
    if (data.coverImage) return data.coverImage;
    const photos = data.photos;
    if (photos && photos[0] && photos[0].url) return photos[0].url;
    return '';
  });

  eleventyConfig.addFilter('postDate', (value) => {
    if (!value) return '';
    const d = value instanceof Date ? value : new Date(value);
    return d.toLocaleDateString(
        'en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  });

  eleventyConfig.addFilter('takeRelated', (posts, currentUrl) => {
    if (!posts || !currentUrl) return [];
    return posts.filter((p) => p.url !== currentUrl).slice(0, 2);
  });

  function normalizedPagePath(pageUrl) {
    if (!pageUrl) return '/';
    let path = String(pageUrl).split('?')[0].replace(/\/index\.html$/, '');
    if (path !== '/' && path !== '' && !path.endsWith('/')) path = `${path}/`;
    if (path === '') path = '/';
    return path;
  }

  function navPathMatchesSection(path, section) {
    if (!section) return false;
    if (section === 'home') return path === '/';
    const prefix = `/${section}/`;
    return path === prefix || path.startsWith(prefix);
  }

  eleventyConfig.addFilter('navIsActive', (pageUrl, section) => {
    return navPathMatchesSection(normalizedPagePath(pageUrl), section);
  });

  eleventyConfig.addFilter(
      'navActivePrimaryLabel', (pageUrl, primary, fallback) => {
        const path = normalizedPagePath(pageUrl);
        for (const item of primary || []) {
          if (navPathMatchesSection(path, item.section)) return item.label;
        }
        return fallback != null && fallback !== '' ? fallback : 'Menu';
      });

  eleventyConfig.addFilter('tagSlug', (name) => tagSlug(name));

  eleventyConfig.addFilter('postsWithTagSlug', (posts, slug) => {
    if (!posts || !slug) return [];
    const s = String(slug).trim().toLowerCase();
    return posts.filter((p) => {
      const tags = p.data.tags;
      if (!Array.isArray(tags)) return false;
      return tags.some((t) => tagSlug(t) === s);
    });
  });

  eleventyConfig.addFilter('albumsWithTagSlug', (albums, slug) => {
    if (!albums || !slug) return [];
    const s = String(slug).trim().toLowerCase();
    return albums.filter((item) => {
      const tags = item.data.tags;
      if (!Array.isArray(tags)) return false;
      return tags.some((t) => tagSlug(t) === s);
    });
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
