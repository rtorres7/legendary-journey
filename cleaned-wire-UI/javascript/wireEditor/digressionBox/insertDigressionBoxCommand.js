import Command from "@ckeditor/ckeditor5-core/src/command";

export default class InsertDigressionBoxCommand extends Command {
  execute() {
    this.editor.model.change((writer) => {
      this.editor.model.insertContent(
        createDigressionBox(writer, this.editor.model)
      );
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      "digressionBox"
    );

    this.isEnabled = allowedIn !== null;
  }
}

function createDigressionBox(writer, model) {
  const selected = model.getSelectedContent(model.document.selection);
  const digressionContent = selected.getChildren();

  const digressionBox = writer.createElement("digressionBox");
  const digressionBoxContent = writer.createElement("digressionBoxContent");

  writer.append(digressionBoxContent, digressionBox);

  for (const node of digressionContent) {
    if (node.name === "digressionBox" && selected.childCount === 1) {
      // Selected content is already a digression box, just clone and return
      return writer.cloneElement(node);
    } else {
      // Clone selected content and add to the new digression box
      writer.append(writer.cloneElement(node), digressionBoxContent);
    }
  }

  return digressionBox;
}
