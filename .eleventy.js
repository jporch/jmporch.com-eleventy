export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("buildYear", new Date().getFullYear());

  eleventyConfig.amendLibrary("md", (markdownIt) => {
    const renderHeadingOpen = markdownIt.renderer.rules.heading_open ??
      ((tokens, index, options, env, renderer) => renderer.renderToken(tokens, index, options));
    markdownIt.renderer.rules.heading_open = (tokens, index, options, env, self) => {
      if (tokens[index].tag === "h2") tokens[index].attrJoin("class", "minor-heading");
      return renderHeadingOpen(tokens, index, options, env, self);
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
