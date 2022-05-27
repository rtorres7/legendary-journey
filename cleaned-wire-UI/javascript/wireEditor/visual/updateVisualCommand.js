import Command from "@ckeditor/ckeditor5-core/src/command";
import { createVisual } from "./visualHelper";

export default class UpdateVisualCommand extends Command {
  execute(argument, node) {
    this.editor.model.change((writer) => {
      writer.insert(createVisual(writer, argument), node, "after");
      writer.remove(node);
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const allowedIn = model.schema.findAllowedParent(
      selection.getFirstPosition(),
      "visual"
    );

    this.isEnabled = allowedIn !== null;
  }
}
