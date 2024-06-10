(async function () {
  if (!window.playgroundMarkdown.markdown || !window.playgroundMarkdown.markdown.length) {
    return;
  }

  await import('../blocky-formats/vendor/commonmark.min.js');
  const { markdownToBlocks } = await import('../blocky-formats/src/markdown.js');

  for (let file of window.playgroundMarkdown.markdown) {
    await fetch("/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: file.name,
        content: JSON.stringify(markdownToBlocks(file.content)),
        status: "publish",
      }),
    });
  }

  if (window.location.pathname !== "/category/uncategorized/") {
    window.open("/category/uncategorized/", "_self");
  }
})();
