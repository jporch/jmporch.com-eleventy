export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("buildYear", new Date().getFullYear());

  eleventyConfig.amendLibrary("md", (markdownIt) => {
    const renderer = markdownIt.renderer;
    const renderHeadingOpen = renderer.rules.heading_open ??
      ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
    const renderHeadingClose = renderer.rules.heading_close ??
      ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
    const renderTokens = renderer.render.bind(renderer);

    renderer.rules.heading_open = (tokens, index, options, env, self) => {
      if (tokens[index].tag !== "h2") return renderHeadingOpen(tokens, index, options, env, self);

      const previous = env.collapseOpen ? "</div></div>\n" : "";
      env.collapseOpen = true;
      env.collapseIndex = (env.collapseIndex ?? 0) + 1;
      const pageSlug = env.page?.fileSlug?.replace(/[^a-z0-9_-]/gi, "-") || "section";
      env.collapseBodyId = `collapse-body-${pageSlug}-${env.collapseIndex}`;
      return `${previous}<div class="collapse"><h2 class="minor-heading collapse-heading"><button class="collapse-toggle" type="button" aria-expanded="true" aria-controls="${env.collapseBodyId}"><span class="collapse-icon" aria-hidden="true"></span>`;
    };

    renderer.rules.heading_close = (tokens, index, options, env, self) => {
      if (tokens[index].tag !== "h2") return renderHeadingClose(tokens, index, options, env, self);
      return `</button></h2><div class="collapse-body" id="${env.collapseBodyId}">\n`;
    };

    renderer.render = (tokens, options, env = {}) => {
      env.collapseOpen = false;
      env.collapseIndex = 0;
      env.collapseBodyId = "";
      const output = renderTokens(tokens, options, env);
      return env.collapseOpen ? `${output}</div></div>\n` : output;
    };
  });

  eleventyConfig.addCollection("sections", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/sections/*.md")
      .sort((a, b) => a.data.order - b.data.order)
  );

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
