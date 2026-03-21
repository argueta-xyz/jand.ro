---
pagination:
  data: collections.albumTagIndex
  size: 1
  alias: tag
permalink: "/albums/tags/{{ tag.slug }}/index.html"
layout: layouts/post-list.njk
listSection: albums
eleventyComputed:
  title: "Albums tagged “{{ tag.name }}”"
---
