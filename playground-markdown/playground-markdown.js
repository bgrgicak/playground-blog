(function () {
  console.log("hello", window.playgroundMarkdown, wpApiSettings.nonce);
  if (!window.playgroundMarkdown.markdown) {
    return;
  }
  for (let file of window.playgroundMarkdown.markdown) {
    console.log("file", file);
    fetch("/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: file.name,
        content: file.content,
        status: "publish",
      }),
    });
  }
})();