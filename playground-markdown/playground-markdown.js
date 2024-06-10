(async function () {
  console.log("hello", window.playgroundMarkdown, wpApiSettings.nonce);
  if (!window.playgroundMarkdown.markdown) {
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
        content: markdownToBlocks(file.content),
        status: "publish",
      }),
    });
  }

  if (window.location.pathname !== "/category/uncategorized/") {
    window.open("/category/uncategorized/", "_self");
  }
})();
