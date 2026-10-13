# jmporch.com

A small Eleventy site that renders the personal website as static HTML. Page sections live in Markdown under `src/sections/`; the navigation is generated from each section's front matter.

## Local development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm run serve
```

Eleventy serves the site locally and rebuilds when files change. Create the production output with:

```sh
pnpm run build
```

The generated site is in `_site/`.

## GitHub Pages

The GitHub Actions workflow in `.github/workflows/pages.yml` builds the site and publishes `_site/` to GitHub Pages whenever a commit is pushed to `main`. Enable **GitHub Actions** as the Pages build and deployment source in the repository's **Settings → Pages**. No custom domain is configured by this project yet.

## Editing content

- Edit the section files in `src/sections/` using Markdown.
- To add a section to the page and navigation, add a `.md` file with `title`, `id`, `order`, and `nav: true` front matter.
- Edit the site name, social links, and other shared details in `src/_data/site.json`.
- Put static files in `src/assets/`; Eleventy copies them to `_site/assets/`.

The source content was initialized from the public website. Before publishing the rebuild, confirm contact details and links whose destinations may have changed, and copy the original headshot and resume into the new site's static files if they should be hosted locally.
