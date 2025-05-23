(async function () {

  function endLoading() {
    document.body.classList.remove('playground-markdown-loading');
  }

  if (
    !window.playgroundMarkdown.markdown ||
    !window.playgroundMarkdown.markdown.length
  ) {
    document.addEventListener("DOMContentLoaded", endLoading);
    return;
  }

  await import("../blocky-formats/vendor/commonmark.min.js");
  const { markdownToBlocks } = await import(
    "../blocky-formats/src/markdown.js"
  );

  for (let file of window.playgroundMarkdown.markdown) {
    const content = markdownToBlocks(file.content).map((block) => {
      const data = {
        blockName: block.name,
        attrs: block.attributes,
        innerBlocks: block.innerBlocks,
        innerContent: [block.attributes.content],
      };
      if ( data.blockName === "core/image" && data.attrs.url ) {
        const attachment =  window.playgroundMarkdown.attachments.find(attachment => attachment['local_path'] === data.attrs.url);
        if ( attachment ) {
          data.attrs.url = attachment['url'];
        }
      }
      let serializedContent = wp.blocks.serializeRawBlock(data);
      // Check if the serialized content starts with "<" to determine if it contains HTML tags or XML
      if (!serializedContent.trim().startsWith("<")) {
        // Wrap the content in a <p> tag if it doesn't start with "<"
        serializedContent = `<p>${serializedContent}</p>`;
      }
      return serializedContent;
    }).join("");
    await fetch("/wp-json/wp/v2/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": wpApiSettings.nonce,
      },
      body: JSON.stringify({
        title: file.name,
        content,
        status: "publish",
      }),
    });
  }

  if (window.location.pathname !== "/category/uncategorized/") {
    window.open("/category/uncategorized/", "_self");
  } else {
    endLoading();
  }
})();
