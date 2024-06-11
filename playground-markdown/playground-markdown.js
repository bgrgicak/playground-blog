(async function () {
  if (
    !window.playgroundMarkdown.markdown ||
    !window.playgroundMarkdown.markdown.length
  ) {
    return;
  }

  document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('loading');
  });

  await import("../blocky-formats/vendor/commonmark.min.js");
  const { markdownToBlocks } = await import(
    "../blocky-formats/src/markdown.js"
  );

  for (let file of window.playgroundMarkdown.markdown) {
    const content = markdownToBlocks(file.content).map((block) => wp.blocks.serializeRawBlock({
      blockName: block.name,
      attrs: block.attributes,
      innerBlocks: block.innerBlocks,
      innerContent: [block.attributes.content],
    }));
    await fetch("/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: file.name,
        content: content.join(""),
        status: "publish",
      }),
    });
  }

  if (window.location.pathname !== "/category/uncategorized/") {
    window.open("/category/uncategorized/", "_self");
  }

  document.body.classList.remove('loading');
})();
