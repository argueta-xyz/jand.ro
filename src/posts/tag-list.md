---
pagination:
  data: collections.postTagIndex
  size: 1
  alias: tag
permalink: "/posts/tags/{{ tag.slug }}/index.html"
layout: layouts/post-list.njk
eleventyComputed:
  title: "{{ tag.name }}"
---
