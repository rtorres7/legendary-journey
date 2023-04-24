import VisualUI from "./visualUi";
import VisualEditing from "./visualEditing";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class Visual extends Plugin {
  static get requires() {
    return [VisualUI, VisualEditing];
  }
}
