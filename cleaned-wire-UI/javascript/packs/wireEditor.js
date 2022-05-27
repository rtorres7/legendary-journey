async function loadCKEditor() {
  if (typeof globalThis.wireEditorModule === "undefined") {
    globalThis.wireEditorModule = await import("@/wireEditor/wireEditor");
    // The ckeditor5-inspector is turned on by default in develpment for future ease of debuggging
    if (WHERE_AM_I === "development") {
      globalThis.cKEditorInspector = await import(
        "@ckeditor/ckeditor5-inspector"
      );
    }
  }
  instantiateEditor();
}

function instantiateEditor() {
  globalThis.wireEditorModule.default
    .create(document.querySelector(".ck_editor_wrap #document_html_body"))
    .then((editor) => {
      if (WHERE_AM_I === "development") {
        globalThis.cKEditorInspector.default.attach(editor);
      }
      globalThis.documentEditor = editor;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function reloadEditor() {
  globalThis.documentEditor.destroy();
  instantiateEditor();
}

document.addEventListener("attachmentsDataChanged", (evt) => {
  if (evt.detail) {
    // attachment metadata was updated, so we need to sync up values in the editor
    let docRoot = globalThis.documentEditor.model.document.getRoot().root;

    for (var node of docRoot._children._nodes.values()) {
      if (node.name === "visual" && node._attrs.get("id") === evt.detail.id) {
        globalThis.documentEditor.execute("updateVisual", evt.detail, node);
        break;
      }
    }
  }
  reloadEditor();
});
loadCKEditor();
