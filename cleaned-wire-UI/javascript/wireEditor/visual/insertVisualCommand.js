import Command from "@ckeditor/ckeditor5-core/src/command";
import { findOptimalInsertionRange } from "@ckeditor/ckeditor5-widget/src/utils";
import { createVisual } from "./visualHelper";
export default class InsertVisualCommand extends Command {
  execute(argument) {
    this.editor.model.change((writer) => {
      const model = this.editor.model;
      const selection = model.document.selection;

      this.editor.model.insertContent(
        createVisual(writer, argument),
        findOptimalInsertionRange(selection, model)
      );
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
