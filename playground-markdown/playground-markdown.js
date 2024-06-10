(async function () {
  if (!window.playgroundMarkdown.markdown || !window.playgroundMarkdown.markdown.length) {
    return;
  }

  await import('../blocky-formats/vendor/commonmark.min.js');
  const { markdownToBlocks } = await import('../blocky-formats/src/markdown.js');

  for (let file of window.playgroundMarkdown.markdown) {
  console.log(file.content);
  console.log(markdownToBlocks(file.content));
  console.log(wp.blocks.serializeRawBlock(markdownToBlocks(file.content)));
    await fetch("/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: file.name,
        // TODO content is empty
        content: wp.blocks.serializeRawBlock(markdownToBlocks(file.content)),
        status: "publish",
      }),
    });
  }

  if (window.location.pathname !== "/category/uncategorized/") {
    //window.open("/category/uncategorized/", "_self");
  }
})();
